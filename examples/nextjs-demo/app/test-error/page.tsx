'use client';

import { withBlarioErrorBoundary } from '@blario/nextjs';
import { useState } from 'react';

function BuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('This is an intentional error for testing the error boundary!');
  }

  return (
    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
      <p>Component is working normally!</p>
    </div>
  );
}

const SafeBuggyComponent = withBlarioErrorBoundary(BuggyComponent, {
  showReportButton: true,
  onError: (error, errorInfo) => {
    console.log('Error caught by Blario:', error);
    console.log('Error info:', errorInfo);
  },
});

export default function TestError() {
  const [throwError, setThrowError] = useState(false);
  const [throwUnhandledError, setThrowUnhandledError] = useState(false);

  const handleUnhandledError = () => {
    // This will trigger the global error handler
    setTimeout(() => {
      throw new Error('Unhandled async error for testing!');
    }, 0);
  };

  const handlePromiseRejection = () => {
    // This will trigger an unhandled promise rejection
    Promise.reject(new Error('Unhandled promise rejection for testing!'));
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Error Boundary</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Error Boundary Component</h2>
            <p className="text-gray-600 mb-4">
              Click the button to trigger an error that will be caught by the error boundary.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setThrowError(!throwError)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                {throwError ? 'Reset Component' : 'Trigger Error in Component'}
              </button>

              <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Protected Component:</h3>
                <SafeBuggyComponent shouldThrow={throwError} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Global Error Handling</h2>
            <p className="text-gray-600 mb-4">
              These errors won't be caught by the component error boundary but should be logged.
            </p>

            <div className="space-x-4">
              <button
                onClick={handleUnhandledError}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
              >
                Trigger Unhandled Error
              </button>

              <button
                onClick={handlePromiseRejection}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
              >
                Trigger Promise Rejection
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Error Boundary Features</h2>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <ul className="list-disc list-inside space-y-2">
                <li>Catches React component errors</li>
                <li>Shows fallback UI with error message</li>
                <li>Provides "Report This Issue" button</li>
                <li>Allows recovery with "Try Again" button</li>
                <li>Pre-fills issue form with error details</li>
                <li>Includes stack trace in development mode</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Testing Tips</h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <ol className="list-decimal list-inside space-y-2">
                <li>Click "Trigger Error in Component" to see the error boundary in action</li>
                <li>Click "Report This Issue" in the error fallback to report the error</li>
                <li>Click "Try Again" to reset the component</li>
                <li>Check the browser console for error logs</li>
                <li>Try the unhandled errors to see console logging</li>
              </ol>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}