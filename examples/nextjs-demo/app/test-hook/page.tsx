'use client';

import { useState } from 'react';
import { useBlario, DiagnosticBanner } from '@blario/nextjs';

export default function TestHook() {
  const { openReporter, reportIssue, lastDiagnostic, isSubmitting } = useBlario();
  const [customError, setCustomError] = useState('');

  const handleProgrammaticReport = async () => {
    try {
      const result = await reportIssue({
        summary: 'Programmatically reported issue',
        steps: 'This issue was reported using the useBlario hook',
        severity: 'medium',
        category: 'test',
      });

      if (result) {
        console.log('Issue reported successfully:', result);
      }
    } catch (error) {
      console.error('Failed to report issue:', error);
    }
  };

  const handleErrorReport = async () => {
    try {
      // Simulate an error
      throw new Error(customError || 'This is a simulated error for testing');
    } catch (error: any) {
      await reportIssue({
        summary: `Error: ${error.message}`,
        steps: error.stack || 'No stack trace available',
        severity: 'high',
        category: 'error',
        actual: error.message,
      });
    }
  };

  const simulateConsoleErrors = () => {
    console.error('This is a test error message');
    console.warn('This is a test warning');
    console.log('Normal log message');
    console.error(new Error('Test error with stack trace'));
  };

  return (
    <main className="min-h-screen p-8">
      <DiagnosticBanner />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test useBlario Hook</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Hook Methods</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">openReporter()</h3>
                <p className="text-gray-600 mb-2">
                  Open the reporter modal programmatically
                </p>
                <button
                  onClick={() => openReporter({ category: 'feature-request' })}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Open Reporter with Category
                </button>
              </div>

              <div>
                <h3 className="font-semibold mb-2">reportIssue()</h3>
                <p className="text-gray-600 mb-2">
                  Submit an issue without opening the modal
                </p>
                <button
                  onClick={handleProgrammaticReport}
                  disabled={isSubmitting}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Report Issue Programmatically'}
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Error Reporting</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">
                  Custom error message:
                  <input
                    type="text"
                    value={customError}
                    onChange={(e) => setCustomError(e.target.value)}
                    placeholder="Enter error message"
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                  />
                </label>
                <button
                  onClick={handleErrorReport}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Report Custom Error
                </button>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Generate Console Logs</h3>
                <p className="text-gray-600 mb-2">
                  Generate some console logs that will be captured
                </p>
                <button
                  onClick={simulateConsoleErrors}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Generate Console Errors
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Hook State</h2>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <dl className="space-y-2">
                <div>
                  <dt className="font-semibold">isSubmitting:</dt>
                  <dd>{isSubmitting ? 'Yes' : 'No'}</dd>
                </div>
                <div>
                  <dt className="font-semibold">lastDiagnostic:</dt>
                  <dd>
                    {lastDiagnostic ? (
                      <pre className="text-sm bg-white dark:bg-gray-800 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(lastDiagnostic, null, 2)}
                      </pre>
                    ) : (
                      'None'
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}