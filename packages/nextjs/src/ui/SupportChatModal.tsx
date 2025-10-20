'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Send, Paperclip, Loader2, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useBlarioContext } from '../provider/BlarioProvider';
import { useSupportChat } from '../hooks/useSupportChat';
import { getUploadManager } from '../core/upload';
import { getApiClient } from '../core/api';
import { Button } from './components/button';
import { Input } from './components/input';
import { Dialog, DialogContent } from './components/dialog';
import { cn } from './lib/utils';
import type { SupportChatMessage, ChatAttachment } from '../core/schemas';

export interface SupportChatModalProps {
  className?: string;
}

export function SupportChatModal({ className }: SupportChatModalProps) {
  const { isSupportChatOpen, closeSupportChat, config } = useBlarioContext();
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    sendMessage,
    connectionState,
    isConnected,
    isTyping,
    clearHistory,
  } = useSupportChat({
    onError: (error) => {
      console.error('Support chat error:', error);
      config.onError?.(error);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when modal opens
  useEffect(() => {
    if (isSupportChatOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isSupportChatOpen]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const MAX_FILES = 5;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        config.onError?.(new Error(`File ${file.name} is too large (max 10MB)`));
        return false;
      }
      return true;
    });

    setAttachments((prev) => [...prev, ...validFiles].slice(0, MAX_FILES));
    event.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachments.length === 0) return;
    if (!isConnected) return;

    const messageContent = inputValue.trim();
    let chatAttachments: ChatAttachment[] | undefined;

    // Upload attachments if any
    if (attachments.length > 0) {
      setIsUploading(true);
      try {
        const apiClient = getApiClient(config);
        const uploadManager = getUploadManager(apiClient);

        // Upload files and get upload tokens
        const uploadTokens = await uploadManager.uploadFiles(attachments);

        // Convert upload tokens to attachment URLs
        // Note: The backend should provide the full URLs, but for now we'll construct them
        chatAttachments = attachments.map((file, index) => ({
          url: uploadTokens[index] ?? '',
          name: file.name,
          mime: file.type,
        }));
      } catch (error) {
        console.error('Failed to upload attachments:', error);
        config.onError?.(error instanceof Error ? error : new Error('Failed to upload attachments'));
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    // Send message
    sendMessage(messageContent, chatAttachments);

    // Clear input and attachments
    setInputValue('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getConnectionBadge = () => {
    switch (connectionState) {
      case 'connected':
        return (
          <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
            <Wifi className="h-3 w-3" />
            <span>Connected</span>
          </div>
        );
      case 'connecting':
        return (
          <div className="flex items-center gap-1.5 text-xs text-yellow-600 dark:text-yellow-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Connecting...</span>
          </div>
        );
      case 'reconnecting':
        return (
          <div className="flex items-center gap-1.5 text-xs text-yellow-600 dark:text-yellow-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Reconnecting...</span>
          </div>
        );
      case 'disconnected':
      case 'failed':
        return (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
            <WifiOff className="h-3 w-3" />
            <span>Disconnected</span>
          </div>
        );
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const renderMessage = (message: SupportChatMessage) => {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';

    if (isSystem) {
      return (
        <div key={message.id} className="flex justify-center py-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
            <AlertCircle className="h-3 w-3" />
            <span>{message.content}</span>
          </div>
        </div>
      );
    }

    return (
      <div
        key={message.id}
        className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
      >
        <div className="max-w-[80%] space-y-1">
          <div
            className={cn(
              'rounded-lg px-3 py-2 text-sm',
              isUser
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
            )}
          >
            {!isUser && message.agentName && (
              <div className="text-xs font-semibold mb-1 opacity-70">
                {message.agentName}
              </div>
            )}
            <p className="whitespace-pre-wrap break-words">{message.content}</p>

            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {message.attachments.map((att, idx) => (
                  <a
                    key={idx}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs underline opacity-80 hover:opacity-100"
                  >
                    📎 {att.name}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div
            className={cn(
              'text-xs text-gray-500 dark:text-gray-400 px-1',
              isUser ? 'text-right' : 'text-left'
            )}
          >
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isSupportChatOpen} onOpenChange={(open) => !open && closeSupportChat()}>
      <DialogContent
        className={cn('blario-wrapper max-w-md h-[600px] flex flex-col p-0', className)}
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Customer Support</h3>
              {getConnectionBadge()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
              title="Clear history"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSupportChat}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-sm text-gray-500 dark:text-gray-400">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
                <svg
                  className="h-8 w-8 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <p className="font-medium mb-1">Start a conversation</p>
              <p className="text-xs max-w-[250px]">
                Send us a message and our support team will get back to you shortly.
              </p>
            </div>
          )}

          {messages.map(renderMessage)}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="px-4 py-2 border-t border-b bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-2 px-2 py-1 bg-white dark:bg-gray-800 rounded border text-xs"
                >
                  <Paperclip className="h-3 w-3" />
                  <span className="max-w-[150px] truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-4 py-3 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <Input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
            />

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={!isConnected || isUploading || attachments.length >= 5}
              className="h-10 w-10 p-0"
              title="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isConnected ? 'Type a message...' : 'Connecting...'}
              className="flex-1"
              disabled={!isConnected || isUploading}
            />

            <Button
              type="submit"
              size="sm"
              disabled={!isConnected || isUploading || (!inputValue.trim() && attachments.length === 0)}
              className="h-10 w-10 p-0"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
