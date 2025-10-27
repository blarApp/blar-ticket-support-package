'use client';

import { IssueReporterButton, DiagnosticBanner } from '@blario/nextjs';

export default function TestModal() {
  return (
    <main className="min-h-screen p-8">
      <DiagnosticBanner />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Issue Reporter Modal</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Floating Button (Default)</h2>
            <p className="mb-4 text-gray-600">
              The default floating button appears in the bottom-right corner.
            </p>
            <IssueReporterButton />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Inline Button</h2>
            <p className="mb-4 text-gray-600">
              You can also use an inline button within your content.
            </p>
            <IssueReporterButton variant="inline">
              Report an Issue
            </IssueReporterButton>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Button with Category</h2>
            <p className="mb-4 text-gray-600">
              Pre-fill the category when opening the modal.
            </p>
            <IssueReporterButton
              variant="inline"
              category="ui-bug"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Report UI Bug
            </IssueReporterButton>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Button with Pre-filled Data</h2>
            <p className="mb-4 text-gray-600">
              Pre-fill form data when opening the modal.
            </p>
            <IssueReporterButton
              variant="inline"
              category="performance"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Report Performance Issue
            </IssueReporterButton>
          </section>

          <section className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Modal Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Form validation (summary is required)</li>
              <li>File attachments (up to 3 images)</li>
              <li>Severity selection</li>
              <li>Auto-capture of browser context</li>
              <li>Console log capture (if errors occurred)</li>
              <li>Network request sampling (configurable)</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}