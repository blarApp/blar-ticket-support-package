'use client';

import React, { useState } from 'react';
import { IssueReporterButton, IssueReporterForm, useBlario } from '@blario/nextjs';
import type { ChatHistoryMessage } from '@blario/core';

const SAMPLE_CHAT: ChatHistoryMessage[] = [
  { role: 'user', content: "The submit button on checkout isn't doing anything" },
  { role: 'assistant', content: 'Do you see any error message or console output?' },
  { role: 'user', content: 'No errors. I click submit and the form stays put.' },
  { role: 'assistant', content: 'Can you check the browser console for any warnings?' },
  { role: 'user', content: 'Just checked - no warnings either. The button just does nothing.' },
];

export default function TestForm() {
  const [showDirectForm, setShowDirectForm] = useState(false);
  const [showStandaloneForm, setShowStandaloneForm] = useState(false);
  const { generatePrefillFromMessages } = useBlario();

  const handleShowStandaloneForm = () => {
    setShowStandaloneForm(true);
    generatePrefillFromMessages(SAMPLE_CHAT);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Issue Reporter Form Examples</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Examples of using the IssueReporterModal and IssueReporterForm components, including standalone mode with AI triage.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border p-6 space-y-4 bg-white dark:bg-gray-950/60">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Option 1: Using the Modal</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">IssueReporterButton</code> opens the form in a modal dialog. Perfect for triggering issue reports from anywhere in your app.
              </p>
            </div>

            <div className="space-y-3 p-8 bg-gray-50 dark:bg-gray-900/50 rounded-md border flex flex-col items-center justify-center min-h-60">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Click the button below to open the modal
              </p>
            </div>

            <IssueReporterButton
              variant="inline"
              buttonVariant="default"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Open Issue Reporter Modal
            </IssueReporterButton>

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
              <p className="font-semibold">Usage:</p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
{`import { IssueReporterButton } from '@blario/nextjs';

<IssueReporterButton>
  Report Issue
</IssueReporterButton>`}
              </pre>
            </div>
          </div>

          <div className="rounded-lg border p-6 space-y-4 bg-white dark:bg-gray-950/60">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Option 2: Direct Form Usage</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">IssueReporterForm</code> directly for inline forms or custom layouts. Great for dedicated issue reporting pages.
              </p>
            </div>

            <div className="space-y-3 p-8 bg-gray-50 dark:bg-gray-900/50 rounded-md border flex flex-col items-center justify-center min-h-60">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Click the button below to show the form inline
              </p>
            </div>

            <button
              onClick={() => setShowDirectForm(!showDirectForm)}
              className="w-full bg-green-600 text-white hover:bg-green-700 px-4 py-3 rounded-lg font-medium"
            >
              {showDirectForm ? '✕ Hide Form' : '✨ Show Direct Form'}
            </button>

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
              <p className="font-semibold">Usage:</p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
{`import { IssueReporterForm } from '@blario/nextjs';

<IssueReporterForm
  showCancelButton={false}
  onSuccess={(issueId) => {
    console.log('Issue created:', issueId);
  }}
  onError={(error) => {
    console.error('Error:', error);
  }}
/>`}
              </pre>
            </div>
          </div>

          <div className="rounded-lg border p-6 space-y-4 bg-white dark:bg-gray-950/60">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Option 3: Standalone with AI Triage</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">IssueReporterForm</code> with <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">standalone</code> prop and AI prefill from chat history.
              </p>
            </div>

            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md border flex flex-col min-h-60">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Sample Chat:</p>
              {SAMPLE_CHAT.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-2 py-1 text-xs ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleShowStandaloneForm}
              className="w-full bg-purple-600 text-white hover:bg-purple-700 px-4 py-3 rounded-lg font-medium"
            >
              {showStandaloneForm ? '✨ Form Shown Below' : '✨ Show Form with AI Prefill'}
            </button>

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
              <p className="font-semibold">Usage:</p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
{`import { IssueReporterForm, useBlario } from '@blario/nextjs';

const { generatePrefillFromMessages } = useBlario();

// Trigger AI triage
generatePrefillFromMessages(chatMessages);

// Form will auto-populate
<IssueReporterForm
  standalone={true}
  onSuccess={(id) => console.log(id)}
/>`}
              </pre>
            </div>
          </div>
        </section>

        {showDirectForm && (
          <section className="rounded-lg border p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-green-900 dark:text-green-100">
                Direct Form Example - Resizable Container
              </h2>
              <p className="text-sm text-green-800 dark:text-green-200">
                This form is embedded directly in the page without a modal wrapper. Drag the right edge to resize and see how the form adapts!
              </p>
            </div>

            <ResizableContainer>
              <div className="rounded-lg border bg-white dark:bg-gray-950 overflow-hidden h-full flex flex-col">
                <div className="p-4 bg-green-100 border-b border-green-300 text-sm">
                  <strong className="text-green-900">Features:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-green-800 text-xs">
                    <li>CSS Grid auto-fit - columns adapt automatically</li>
                    <li>Minimum column width: 240px</li>
                    <li>Single column below 500px</li>
                    <li>Text scales down for smaller containers</li>
                    <li>No cancel button (showCancelButton=false)</li>
                    <li>Drag the right edge to resize →</li>
                  </ul>
                </div>

                <div className="flex-1 overflow-auto">
                  <IssueReporterForm
                    showCancelButton={false}
                    onSuccess={(issueId) => {
                      alert(`Issue created successfully! ID: ${issueId}`);
                      setShowDirectForm(false);
                    }}
                    onError={(error) => {
                      alert(`Error creating issue: ${error.message}`);
                    }}
                  />
                </div>
              </div>
            </ResizableContainer>
          </section>
        )}

        {showStandaloneForm && (
          <section className="rounded-lg border p-6 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100">
                Standalone Form with AI Triage
              </h2>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                This form is embedded directly and prefilled with AI-generated content from the chat history above. The <code className="rounded bg-purple-100 dark:bg-purple-800 px-1 py-0.5 text-xs">standalone</code> prop allows the form to work independently of the modal system.
              </p>
            </div>

            <div className="rounded-lg border bg-white dark:bg-gray-950 overflow-hidden max-w-2xl mx-auto">
              <div className="p-4 bg-purple-100 border-b border-purple-300 text-sm">
                <strong className="text-purple-900">Features:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-purple-800 text-xs">
                  <li>Standalone mode: works without modal</li>
                  <li>AI prefill from chat history</li>
                  <li>Auto-populates summary, steps, severity, etc.</li>
                  <li>Can be edited before submission</li>
                  <li>Auto-scrollable with max-height</li>
                </ul>
              </div>

              <div className="h-[600px]">
                <IssueReporterForm
                  standalone={true}
                  showCancelButton={false}
                  onSuccess={(issueId) => {
                    alert(`Issue created successfully! ID: ${issueId}`);
                    setShowStandaloneForm(false);
                  }}
                  onError={(error) => {
                    alert(`Error creating issue: ${error.message}`);
                  }}
                />
              </div>
            </div>
          </section>
        )}

        <section className="rounded-lg border p-6 bg-white dark:bg-gray-950/60 space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Key Differences</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">IssueReporterButton + Modal</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Opens in a dialog overlay</li>
                <li>Includes cancel button</li>
                <li>Closes automatically on success</li>
                <li>Can be triggered from anywhere</li>
                <li>Good for contextual issue reporting</li>
                <li>Supports chatHistory prop for AI prefill</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">IssueReporterForm (Direct)</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Embedded in page layout</li>
                <li>Optional cancel button</li>
                <li>Custom success handling</li>
                <li>Part of page flow</li>
                <li>Good for dedicated reporting pages</li>
                <li>Requires modal to be open (default)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">IssueReporterForm (Standalone)</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Works without modal system</li>
                <li>Supports AI prefill via generatePrefillFromMessages()</li>
                <li>Full control over layout</li>
                <li>Perfect for chat-to-ticket flows</li>
                <li>Set standalone=true prop</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ResizableContainer({ children }: { children: React.ReactNode }) {
  const [width, setWidth] = useState(800);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;

    if (newWidth >= 300 && newWidth <= 1200) {
      setWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      const handleMove = (e: MouseEvent) => handleMouseMove(e);
      const handleUp = () => handleMouseUp();

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };
    }
  }, [isDragging, width]);

  return (
    <div className="flex items-start gap-4">
      <div
        ref={containerRef}
        className="relative"
        style={{ width: `${width}px`, height: '600px' }}
      >
        {children}

        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-blue-500 transition-colors ${
            isDragging ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-12 flex items-center justify-center">
            <div className="w-1 h-8 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Container Width
        </p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {width}px
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
          {width < 500 ? 'Single column' : width < 480 ? 'Auto-fit (1 col)' : 'Auto-fit (2 cols)'}
        </p>
        <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1">
          {width < 500 ? 'All inputs stacked' : 'Grid auto-fits columns (min 240px)'}
        </p>
      </div>
    </div>
  );
}
