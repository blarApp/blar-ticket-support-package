'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { useBlario } from '../hooks/useBlario';
import { cn } from './lib/utils';

export interface DiagnosticBannerProps {
  position?: 'top' | 'bottom';
  autoHide?: boolean;
  autoHideDelay?: number;
  className?: string;
  onDismiss?: () => void;
}

export function DiagnosticBanner({
  position = 'top',
  autoHide = false,
  autoHideDelay = 10000,
  className,
  onDismiss,
}: DiagnosticBannerProps) {
  const { lastDiagnostic, clearDiagnostic } = useBlario();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (lastDiagnostic) {
      setIsVisible(true);

      if (autoHide && lastDiagnostic.status === 'ready') {
        const timer = setTimeout(() => {
          handleDismiss();
        }, autoHideDelay);

        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
    return undefined;
  }, [lastDiagnostic, autoHide, autoHideDelay]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      clearDiagnostic();
      onDismiss?.();
    }, 300);
  };

  if (!lastDiagnostic || !isVisible) return null;

  const getIcon = () => {
    switch (lastDiagnostic.status) {
      case 'ready':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 animate-pulse" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getStatusColor = () => {
    switch (lastDiagnostic.status) {
      case 'ready':
        return 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'pending':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
    }
  };

  const positionClasses = position === 'top' ? 'top-4' : 'bottom-4';

  return (
    <div
      className={cn(
        'fixed left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full px-4 transition-all duration-300',
        positionClasses,
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div
        className={cn(
          'rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm',
          getStatusColor()
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

          <div className="flex-1 space-y-1">
            {lastDiagnostic.status === 'pending' && (
              <p className="font-semibold">Analyzing your issue...</p>
            )}

            {lastDiagnostic.status === 'ready' && lastDiagnostic.diagnostic && (
              <>
                <p className="font-semibold">
                  {lastDiagnostic.diagnostic.headline}
                </p>

                {lastDiagnostic.diagnostic.probableCause && (
                  <p className="text-sm opacity-90">
                    <span className="font-medium">Probable cause:</span>{' '}
                    {lastDiagnostic.diagnostic.probableCause}
                  </p>
                )}

                {lastDiagnostic.diagnostic.suggestedFix && (
                  <p className="text-sm opacity-90">
                    <span className="font-medium">Suggested fix:</span>{' '}
                    {lastDiagnostic.diagnostic.suggestedFix}
                  </p>
                )}

                {lastDiagnostic.diagnostic.relatedIssues &&
                 lastDiagnostic.diagnostic.relatedIssues.length > 0 && (
                  <div className="text-sm opacity-90 mt-2">
                    <span className="font-medium">Related issues:</span>
                    <ul className="list-disc list-inside mt-1">
                      {lastDiagnostic.diagnostic.relatedIssues.map(issue => (
                        <li key={issue.id}>{issue.title}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {lastDiagnostic.status === 'error' && (
              <p className="font-semibold">
                {lastDiagnostic.error ?? 'Failed to generate diagnostic. Please try again.'}
              </p>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Dismiss diagnostic"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}