import Link from 'next/link';
import { ClientIssueReporterButton, ClientDiagnosticBanner } from '@/components/ClientComponents';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <ClientDiagnosticBanner position="top" autoHide autoHideDelay={15000} />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Blario Next.js Demo
        </h1>

        <div className="prose dark:prose-invert mb-8">
          <p>
            This is a demo application to test the @blario/nextjs package components.
          </p>
          <p>
            Try the different features and components available in the SDK:
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-12">
          <Link
            href="/test-modal"
            className="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Test Modal</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Test the issue reporter modal with different configurations
            </p>
          </Link>

          <Link
            href="/test-hook"
            className="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Test Hook</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Test programmatic issue reporting using the useBlario hook
            </p>
          </Link>

          <Link
            href="/test-error"
            className="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Test Error Boundary</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Test error boundary integration and error reporting
            </p>
          </Link>

          <Link
            href="/test-styles"
            className="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Test Styles</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Test different button styles and positions
            </p>
          </Link>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Quick Test:</h3>
          <p className="mb-4">
            Click the floating button in the bottom-right corner to open the issue reporter modal.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Note: The demo is configured with a test project ID. In production, you would use your actual Blario project ID.
          </p>
        </div>
      </div>

      <ClientIssueReporterButton />
    </main>
  );
}