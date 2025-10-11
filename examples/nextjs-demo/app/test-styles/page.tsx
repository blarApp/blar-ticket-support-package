'use client';

import { IssueReporterButton, DiagnosticBanner } from '@blario/nextjs';
import { MessageCircle } from 'lucide-react';

export default function TestStyles() {
  return (
    <main className="min-h-screen p-8">
      <DiagnosticBanner position="top" />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Styles & Positions</h1>

        <div className="space-y-8">

          <section>
            <h2 className="text-xl font-semibold mb-4">Inline Button Styles</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Default Style</h3>
                <IssueReporterButton variant="inline">
                  Default Button
                </IssueReporterButton>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Seamless Integration Examples</h3>
                <div className="space-y-4">
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-300 mb-3">Perfectly seamless dark sidebar (unstyled={true} + custom emoji icon):</p>
                    <nav className="space-y-1">
                      <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition">
                        <span className="w-5 text-center">⚙️</span> Settings
                      </a>
                      <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition">
                        <span className="w-5 text-center">📋</span> Plan
                      </a>
                      <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition">
                        <span className="w-5 text-center">📚</span> Documentation
                      </a>
                      <IssueReporterButton
                        variant="inline"
                        unstyled
                        className="flex w-full items-center gap-2 px-2 py-1.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition cursor-pointer"
                        icon={<span className="w-5 text-center">🐛</span>}
                      >
                        Report Issue
                      </IssueReporterButton>
                      <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition">
                        <span className="w-5 text-center">🚪</span> Log Out
                      </a>
                    </nav>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <p className="text-gray-600 mb-3">Light menu example (ghost variant):</p>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">Home</button>
                      <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">About</button>
                      <IssueReporterButton
                        variant="inline"
                        hideIcon
                        unstyled
                        buttonVariant="ghost"
                        className="px-4 py-2 hover:bg-gray-100 rounded transition text-gray-700"
                      >
                        Feedback
                      </IssueReporterButton>
                      <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">Contact</button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-900 mb-3">Inline text link (text only, no icon):</p>
                    <p className="text-sm text-blue-700 mb-2">
                      Need help? Check our documentation or
                      <IssueReporterButton
                        variant="inline"
                        unstyled
                        hideIcon
                        className="text-blue-600 hover:text-blue-800 underline mx-1 cursor-pointer"
                      >
                        report an issue
                      </IssueReporterButton>
                      and we'll get back to you.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-lg">
                    <p className="text-white mb-3">Modern gradient style with custom icon:</p>
                    <div className="flex gap-3">
                      <IssueReporterButton
                        variant="inline"
                        unstyled
                        className="bg-white/20 backdrop-blur hover:bg-white/30 text-white px-4 py-2 rounded-full transition flex items-center gap-2 cursor-pointer"
                        icon={<MessageCircle className="w-4 h-4" />}
                      >
                        Send Feedback
                      </IssueReporterButton>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Button Variants</h3>
                <div className="space-x-2">
                  <IssueReporterButton
                    variant="inline"
                    buttonVariant="default"
                  >
                    Default
                  </IssueReporterButton>

                  <IssueReporterButton
                    variant="inline"
                    buttonVariant="secondary"
                  >
                    Secondary
                  </IssueReporterButton>

                  <IssueReporterButton
                    variant="inline"
                    buttonVariant="outline"
                  >
                    Outline
                  </IssueReporterButton>

                  <IssueReporterButton
                    variant="inline"
                    buttonVariant="ghost"
                  >
                    Ghost
                  </IssueReporterButton>

                  <IssueReporterButton
                    variant="inline"
                    buttonVariant="destructive"
                  >
                    Destructive
                  </IssueReporterButton>

                  <IssueReporterButton
                    variant="inline"
                    buttonVariant="link"
                  >
                    Link Style
                  </IssueReporterButton>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Custom Styles</h3>
                <div className="space-x-2">
                  <IssueReporterButton
                    variant="inline"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg text-lg"
                  >
                    Large Purple
                  </IssueReporterButton>

                  <IssueReporterButton
                    variant="inline"
                    className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-full"
                  >
                    Gradient
                  </IssueReporterButton>

                  <IssueReporterButton
                    variant="inline"
                    className="border-2 border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
                  >
                    Outlined
                  </IssueReporterButton>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Different Sizes</h3>
                <div className="space-x-2">
                  <IssueReporterButton
                    variant="inline"
                    className="text-xs px-2 py-1"
                  >
                    Extra Small
                  </IssueReporterButton>

                  <IssueReporterButton
                    variant="inline"
                    className="text-sm px-3 py-1.5"
                  >
                    Small
                  </IssueReporterButton>

                  <IssueReporterButton
                    variant="inline"
                    className="text-base px-4 py-2"
                  >
                    Medium
                  </IssueReporterButton>

                  <IssueReporterButton
                    variant="inline"
                    className="text-lg px-6 py-3"
                  >
                    Large
                  </IssueReporterButton>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Diagnostic Banner Positions</h2>
            <div className="space-y-4">
              <button
                onClick={() => {
                  // This would normally trigger after submitting an issue
                  console.log('Banner would appear after issue submission');
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Test Banner (Submit an issue to see it)
              </button>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Banner Features:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Position: top or bottom</li>
                  <li>Auto-hide after configurable delay</li>
                  <li>Shows diagnostic status (pending, ready, error)</li>
                  <li>Displays AI-generated diagnostics</li>
                  <li>Dismissible with X button</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Theme Customization</h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
              <p className="mb-2">
                The theme can be customized via the BlarioProvider:
              </p>
              <pre className="text-sm bg-white dark:bg-gray-800 p-4 rounded overflow-x-auto">
{`<BlarioProvider
  theme={{
    position: 'bottom-right',
    accent: '#6366f1',
    className: 'custom-class'
  }}
>`}
              </pre>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}