'use client';

import { IssueReporterButton, DiagnosticBanner } from '@blario/nextjs';

export default function TestStyles() {
  return (
    <main className="min-h-screen p-8">
      <DiagnosticBanner position="top" />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Styles & Positions</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Button Positions</h2>
            <p className="text-gray-600 mb-4">
              Test different floating button positions. Only one floating button should be visible at a time.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="border p-4 rounded-lg relative h-32">
                <h3 className="font-semibold">Bottom Right (Default)</h3>
                <IssueReporterButton position="bottom-right" />
              </div>

              <div className="border p-4 rounded-lg relative h-32">
                <h3 className="font-semibold">Bottom Left</h3>
                <IssueReporterButton position="bottom-left" />
              </div>

              <div className="border p-4 rounded-lg relative h-32">
                <h3 className="font-semibold">Top Right</h3>
                <IssueReporterButton position="top-right" />
              </div>

              <div className="border p-4 rounded-lg relative h-32">
                <h3 className="font-semibold">Top Left</h3>
                <IssueReporterButton position="top-left" />
              </div>
            </div>
          </section>

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
                <h3 className="font-semibold mb-2">Custom Classes</h3>
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