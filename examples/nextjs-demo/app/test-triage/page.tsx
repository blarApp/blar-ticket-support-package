'use client';

import { useState } from 'react';
import { IssueReporterButton } from '@blario/nextjs';

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
      </div>
    </main>
  );
}
