'use client';

import { useState } from 'react';
import { IssueReporterButton } from '@blario/nextjs';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';

interface DraftMessage {
  role: string;
  content: string;
  timestamp?: number;
}

const SAMPLE_CHAT: DraftMessage[] = [
  { role: 'user', content: "The submit button on checkout isn't doing anything", timestamp: Date.now() - 30000 },
  { role: 'assistant', content: 'Do you see any error message or console output?', timestamp: Date.now() - 20000 },
  { role: 'user', content: 'No errors. I click submit and the form stays put.', timestamp: Date.now() - 10000 },
  { role: 'assistant', content: 'Can you check the browser console for any warnings?', timestamp: Date.now() - 5000 },
  { role: 'user', content: 'Just checked - no warnings either. The button just does nothing.', timestamp: Date.now() - 1000 },
];

export default function TestTriage() {
  const [chatMessages] = useState<DraftMessage[]>(SAMPLE_CHAT);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Test AI Triage Prefill</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Compare opening the issue reporter with chat history (AI prefill) vs. without chat history (manual form). See how the AI triage endpoint analyzes conversations to suggest issue details.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          {/* Left section: With chat messages */}
          <div className="rounded-lg border p-6 space-y-4 bg-white dark:bg-gray-950/60">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Option 1: With Chat History</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                When you have a conversation with the user, pass it to <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">openReporter()</code>. The SDK sends it to <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">POST /api/support/triage</code> and uses AI to prefill the issue form.
              </p>
            </div>

            {/* Display chat messages */}
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md border max-h-80 overflow-y-auto">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Conversation:</p>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="text-xs opacity-70 mb-1">
                      {msg.role === 'user' ? 'User' : 'Assistant'}
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <IssueReporterButton
              chatHistory={chatMessages}
              variant="inline"
              buttonVariant="default"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Open reporter with chat
            </IssueReporterButton>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              {chatMessages.length} messages will be sent to AI triage
            </div>
          </div>

          {/* Right section: Without chat messages */}
          <div className="rounded-lg border p-6 space-y-4 bg-white dark:bg-gray-950/60">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Option 2: Without Chat History</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                When you don&apos;t have a chat conversation, simply open the reporter without messages. The form will be shown empty and the user fills it manually.
              </p>
            </div>

            {/* Empty state indicator */}
            <div className="space-y-3 p-8 bg-gray-50 dark:bg-gray-900/50 rounded-md border flex flex-col items-center justify-center min-h-80">
              <svg
                className="w-16 h-16 text-gray-300 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                No messages
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center max-w-xs">
                The issue reporter opens directly without AI prefill
              </p>
            </div>

            <IssueReporterButton
              variant="inline"
              buttonVariant="outline"
              className="w-full"
            >
              Open reporter without chat
            </IssueReporterButton>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              Form opens empty, no AI triage
            </div>
          </div>
        </section>

        <section className="rounded-lg border p-6 bg-white dark:bg-gray-950/60 space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">How it works</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Option 1 (With Chat):</strong> The SDK sends the conversation to <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5">/api/support/triage</code>, AI analyzes it and prefills the issue form with suggested title, description, category, and severity.
            </li>
            <li>
              <strong>Option 2 (Without Chat):</strong> The reporter modal opens with an empty form. No API call is made to the triage endpoint.
            </li>
            <li>
              Open the browser network tab to see the triage request when using Option 1.
            </li>
            <li>
              After the modal opens (either option), you can edit any field before submitting the issue.
            </li>
          </ul>
        </section>

        {/* NESTED DIALOG TEST - EXACT PRODUCTION REPLICA */}
        <section className="rounded-lg border p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-red-900 dark:text-red-100">
              🔥 EXACT PRODUCTION REPLICA - Nested Dialogs Focus Trap
            </h2>
            <p className="text-sm text-red-800 dark:text-red-200">
              This matches your EXACT production setup: IssueReporterButton (Dialog #2) inside a Chat Dialog (Dialog #1).
              The outer dialog&apos;s focus trap prevents clicking inputs in the nested dialog.
            </p>
          </div>

          <button
            onClick={() => setSheetOpen(true)}
            className="w-full bg-red-600 text-white hover:bg-red-700 px-4 py-3 rounded-lg font-medium"
          >
            🚨 Open Chat Dialog (Outer Dialog - Focus Trap #1)
          </button>

          {/* OUTER DIALOG - Chat Dialog (Focus Trap #1) */}
          <Dialog.Root open={sheetOpen} onOpenChange={setSheetOpen} modal={false}>
            <Dialog.Portal>
              {/* Outer Dialog Overlay */}
              <Dialog.Overlay
                className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                style={{ zIndex: 40 }}
              />

              {/* Outer Dialog Content - Chat Dialog */}
              <Dialog.Content
                className="fixed inset-y-0 right-0 h-full w-3/4 border-0 bg-white p-0 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
                style={{ zIndex: 40 }}
                onInteractOutside={(e) => {
                  const target = e.target as HTMLElement;
                  // Only allow interactions with [data-call-bubble="true"] elements
                  // This blocks clicks to nested dialog inputs!
                  if (!target.closest('[data-call-bubble="true"]')) {
                    e.preventDefault();
                  }
                }}
                onPointerDownOutside={(e) => {
                  const target = e.target as HTMLElement;
                  // Only allow pointer events for [data-call-bubble="true"] elements
                  // This blocks clicks to nested dialog inputs!
                  if (!target.closest('[data-call-bubble="true"]')) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="flex h-full overflow-y-hidden bg-white rounded-lg">
                  <div className="flex-1 flex flex-col p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Chat Dialog (Outer Dialog)</h2>
                      <button
                        onClick={() => setSheetOpen(false)}
                        className="rounded-lg p-2 hover:bg-gray-200"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-900">
                        <strong>This is Dialog #1 (Outer Dialog)</strong> - It creates Focus Trap #1
                      </p>
                    </div>

                    {/* ChatSidePanel structure with Tabs */}
                    <div className="flex-1 flex gap-4 overflow-hidden">
                      <Tabs.Root defaultValue="tab1" orientation="vertical" className="flex gap-4 flex-1">
                        <Tabs.List className="flex flex-col gap-2 border-r border-gray-200 pr-4">
                          <Tabs.Trigger
                            value="tab1"
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-lg"
                          >
                            📋 Ticket
                          </Tabs.Trigger>
                          <Tabs.Trigger
                            value="tab2"
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-lg"
                          >
                            👤 Contact
                          </Tabs.Trigger>

                          {/* IssueReporterButton - Opens Dialog #2 (NESTED DIALOG) */}
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <IssueReporterButton
                              chatHistory={chatMessages}
                              variant="inline"
                              unstyled
                              hideText={true}
                              className="w-10 h-10 p-0 rounded-lg text-red-600 hover:bg-red-100 flex items-center justify-center border-2 border-red-600"
                              icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                              }
                            />
                          </div>
                        </Tabs.List>

                        <div className="flex-1 overflow-auto">
                          <Tabs.Content value="tab1" className="p-4 bg-gray-50 rounded-md">
                            <h3 className="font-semibold mb-2">Ticket Info</h3>
                            <p className="text-sm text-gray-600">Ticket details go here...</p>
                          </Tabs.Content>

                          <Tabs.Content value="tab2" className="p-4 bg-gray-50 rounded-md">
                            <h3 className="font-semibold mb-2">Contact Info</h3>
                            <p className="text-sm text-gray-600">Contact details go here...</p>
                          </Tabs.Content>
                        </div>
                      </Tabs.Root>
                    </div>

                    <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded text-sm">
                      <strong className="text-red-900">Test Instructions:</strong>
                      <ol className="list-decimal list-inside mt-2 space-y-1 text-red-800">
                        <li>Click the RED warning icon button in the left sidebar (opens Dialog #2 inside Dialog #1)</li>
                        <li>Wait for AI to prefill the form</li>
                        <li><strong>Try to CLICK on the input fields</strong> - they won&apos;t focus! (Focus Trap Conflict)</li>
                        <li>Open DevTools console and run: <code className="bg-red-200 px-1 rounded">document.querySelector(&apos;[role="dialog"] input[name="summary"]&apos;).focus()</code></li>
                        <li>After programmatic focus, you CAN type - proving it&apos;s a focus trap issue, not a z-index issue!</li>
                        <li>Notice buttons still work - they use mousedown events, not click events</li>
                      </ol>
                      <p className="mt-2 text-xs">
                        <strong>Root Cause:</strong> Dialog #1 (outer) intercepts click events before they reach Dialog #2 (inner) inputs.
                      </p>
                    </div>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </section>
      </div>
    </main>
  );
}