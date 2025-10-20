'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useBlarioContext } from '../provider/BlarioProvider';
import { getWebSocketManager, type ConnectionState, type WebSocketMessage } from '../core/websocket';
import { getStorageManager } from '../core/storage';
import type { SupportChatMessage, ChatAttachment } from '../core/schemas';

export interface UseSupportChatOptions {
  onMessage?: (message: SupportChatMessage) => void;
  onConnectionChange?: (state: ConnectionState) => void;
  onError?: (error: Error) => void;
}

export interface UseSupportChatReturn {
  messages: SupportChatMessage[];
  sendMessage: (content: string, attachments?: ChatAttachment[]) => void;
  connectionState: ConnectionState;
  isConnected: boolean;
  isTyping: boolean;
  clearHistory: () => void;
  sessionId: string | null;
}

/**
 * Hook for managing support chat WebSocket connection and messages
 */
export function useSupportChat(options: UseSupportChatOptions = {}): UseSupportChatReturn {
  const { config } = useBlarioContext();
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const wsManagerRef = useRef(getWebSocketManager({
    baseUrl: config.apiBaseUrl,
    publishableKey: config.publishableKey,
    userId: config.user?.id,
  }));

  const storageManager = useRef(getStorageManager());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const streamingMessageRef = useRef<string>(''); // For building streaming message chunks

  // Store callbacks in refs to avoid recreating listeners on every render
  const onMessageRef = useRef(options.onMessage);
  const onConnectionChangeRef = useRef(options.onConnectionChange);
  const onErrorRef = useRef(options.onError);

  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = options.onMessage;
    onConnectionChangeRef.current = options.onConnectionChange;
    onErrorRef.current = options.onError;
  }, [options.onMessage, options.onConnectionChange, options.onError]);

  // Load messages from storage on mount
  useEffect(() => {
    const storedMessages = storageManager.current.getChatMessages();
    if (storedMessages.length > 0) {
      // Filter out connection messages (they are transient and will be sent again on connect)
      const filteredMessages = storedMessages.filter((msg) =>
        !(msg.type === 'system' && msg.content.includes('Connected to'))
      );
      setMessages(filteredMessages);
    }

    // Get chat room ID from WebSocket manager
    const chatRoomId = wsManagerRef.current.getChatRoomId();
    setSessionId(chatRoomId);

    // Save to storage
    const storedSession = storageManager.current.getChatSession();
    if (!storedSession) {
      storageManager.current.saveChatSession({
        sessionId: chatRoomId,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  }, []);

  // Connect to WebSocket on mount
  useEffect(() => {
    const wsManager = wsManagerRef.current;

    // Set up event handlers
    const unsubscribeMessage = wsManager.on('message', (event) => {
      const message = event as WebSocketMessage;

      // Handle info messages (welcome message)
      if (message.type === 'info') {
        const chatMessage: SupportChatMessage = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'system',
          content: message.message,
          timestamp: Date.now(),
        };

        // Add to messages but don't persist to storage (transient connection message)
        setMessages((prev) => [...prev, chatMessage]);

        onMessageRef.current?.(chatMessage);
      }
      // Handle user message echo (acknowledgment)
      else if (message.type === 'user_message') {
        // Server acknowledged the message - we already have it optimistically added, so skip
        console.log('Message acknowledged by server:', message.message);
      }
      // Handle typing indicator
      else if (message.type === 'agent_typing') {
        setIsTyping(message.is_typing);

        if (message.is_typing) {
          // Auto-clear typing indicator after 10 seconds (in case we miss the stop signal)
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
          }, 10000);
        } else {
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
          }
        }
      }
      // Handle streaming message chunks
      else if (message.type === 'agent_message_chunk') {
        // Extract text from the content array structure
        const chunkText = message.content
          .map((item) => item.text)
          .join('');

        // Append chunk to streaming message
        streamingMessageRef.current += chunkText;

        // Update the last message if it's a streaming agent message, or create a new one
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];

          // Check if the last message is our streaming placeholder
          if (lastMessage && lastMessage.type === 'agent' && lastMessage.id === 'streaming') {
            // Update existing streaming message
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...lastMessage,
              content: streamingMessageRef.current,
            };
            return updated;
          } else {
            // Create new streaming message placeholder
            const streamingMessage: SupportChatMessage = {
              id: 'streaming',
              type: 'agent',
              content: streamingMessageRef.current,
              timestamp: Date.now(),
            };
            return [...prev, streamingMessage];
          }
        });
      }
      // Handle complete message
      else if (message.type === 'agent_message_complete') {
        // Replace the streaming placeholder with the final complete message
        const finalMessage: SupportChatMessage = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'agent',
          content: message.message,
          timestamp: Date.now(),
        };

        setMessages((prev) => {
          // Remove streaming placeholder if it exists
          const filtered = prev.filter((msg) => msg.id !== 'streaming');
          const updated = [...filtered, finalMessage];
          storageManager.current.saveChatMessages(updated);
          return updated;
        });

        options.onMessage?.(finalMessage);

        // Reset streaming buffer
        streamingMessageRef.current = '';

        // Clear typing indicator
        setIsTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
      }
      // Handle errors
      else if (message.type === 'error') {
        const errorMessage = message.details ? `${message.message}: ${message.details}` : message.message;
        onErrorRef.current?.(new Error(errorMessage));

        // Also show as system message in chat
        const chatMessage: SupportChatMessage = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'system',
          content: `Error: ${errorMessage}`,
          timestamp: Date.now(),
        };

        setMessages((prev) => {
          const updated = [...prev, chatMessage];
          storageManager.current.saveChatMessages(updated);
          return updated;
        });
      }
    });

    const unsubscribeOpen = wsManager.on('open', () => {
      const state = wsManager.getConnectionState();
      setConnectionState(state);
      onConnectionChangeRef.current?.(state);
    });

    const unsubscribeClose = wsManager.on('close', () => {
      const state = wsManager.getConnectionState();
      setConnectionState(state);
      onConnectionChangeRef.current?.(state);
    });

    const unsubscribeError = wsManager.on('error', () => {
      const state = wsManager.getConnectionState();
      setConnectionState(state);
      onConnectionChangeRef.current?.(state);
    });

    // Connect to WebSocket
    wsManager.connect();

    // Poll connection state
    const pollInterval = setInterval(() => {
      const state = wsManager.getConnectionState();
      setConnectionState(state);
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(pollInterval);
      unsubscribeMessage();
      unsubscribeOpen();
      unsubscribeClose();
      unsubscribeError();

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      wsManager.disconnect();
    };
  }, []); // Empty deps - only run once on mount/unmount

  const sendMessage = useCallback(
    (content: string, attachments?: ChatAttachment[]) => {
      const wsManager = wsManagerRef.current;

      // OPTIMISTIC UPDATE: Create and show user message immediately
      const userMessage: SupportChatMessage = {
        id: `${Date.now()}-${Math.random()}`,
        type: 'user',
        content,
        timestamp: Date.now(),
        attachments,
      };

      // Add to messages immediately (optimistic update)
      setMessages((prev) => {
        const updated = [...prev, userMessage];
        storageManager.current.saveChatMessages(updated);
        return updated;
      });

      // Send through WebSocket (backend will echo back for confirmation)
      // Note: Current backend doesn't support attachments in chat messages
      // Attachments would need to be uploaded first and URLs sent in message
      wsManager.sendTextMessage(content);

      // Update session
      const session = storageManager.current.getChatSession();
      if (session) {
        storageManager.current.saveChatSession({
          ...session,
          updatedAt: Date.now(),
        });
      }
    },
    []
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    storageManager.current.clearChatHistory();
    setSessionId(null);
  }, []);

  const isConnected = connectionState === 'connected';

  return {
    messages,
    sendMessage,
    connectionState,
    isConnected,
    isTyping,
    clearHistory,
    sessionId,
  };
}
