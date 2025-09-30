'use client';

import React, { ComponentType, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/components/button';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  showReportButton?: boolean;
}

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  errorInfo?: ErrorInfo;
  showReportButton?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class BlarioErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: NodeJS.Timeout | null = null;
  private resetKeys: Array<string | number>;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
    this.resetKeys = props.resetKeys || [];
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
    this.setState({ errorInfo });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys, resetOnPropsChange } = this.props;

    if (resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }

    if (resetKeys && resetKeys.length > 0) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== this.resetKeys[index]
      );

      if (hasResetKeyChanged) {
        this.resetKeys = resetKeys;
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = (): void => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { fallback: FallbackComponent, children, showReportButton = true } = this.props;

    if (hasError && error) {
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={error}
            resetErrorBoundary={this.resetErrorBoundary}
            errorInfo={errorInfo || undefined}
            showReportButton={showReportButton}
          />
        );
      }

      return (
        <DefaultErrorFallback
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
          errorInfo={errorInfo || undefined}
          showReportButton={showReportButton}
        />
      );
    }

    return children;
  }
}

function DefaultErrorFallback({
  error,
  resetErrorBoundary,
  showReportButton = true,
}: ErrorFallbackProps): JSX.Element {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-4 text-center">
        <div className="flex justify-center">
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
          </p>
        </div>

        {isDev && error && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
            <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
              {error.message}
            </p>
            {error.stack && (
              <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center mt-6">
          <Button onClick={resetErrorBoundary} variant="outline">
            Try Again
          </Button>

          {showReportButton && (
            <Button
              onClick={() => {
                if (typeof window !== 'undefined' && window.dispatchEvent) {
                  const event = new CustomEvent('blario:open-reporter', {
                    detail: {
                      prefill: {
                        summary: `Error: ${error.message}`,
                        actual: error.stack || error.message,
                        category: 'error',
                        severity: 'high',
                      },
                    },
                  });
                  window.dispatchEvent(event);
                }
              }}
            >
              Report This Issue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function withBlarioErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): ComponentType<P> {
  const WrappedComponent = (props: P) => {
    return (
      <BlarioErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </BlarioErrorBoundary>
    );
  };

  WrappedComponent.displayName = `withBlarioErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WrappedComponent;
}

export { BlarioErrorBoundary };