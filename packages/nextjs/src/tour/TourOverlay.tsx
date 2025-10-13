'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { TourStep } from './types';
import { scrollToElement, getElementPosition } from './elementFinder';
import { waitForElement, waitForPageReady } from './elementWaiter';
import { Button } from '../ui/components/button';
import { Card } from '../ui/components/card';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '../ui/lib/utils';

export interface TourOverlayProps {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

interface HighlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TooltipPosition {
  top: number;
  left: number;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export function TourOverlay({
  step,
  stepIndex,
  totalSteps,
  onNext,
  onPrev,
  onClose,
}: TourOverlayProps) {
  const [highlightPos, setHighlightPos] = useState<HighlightPosition | null>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const findAndHighlightElement = async () => {
      setIsLoading(true);
      setHighlightPos(null);
      setTooltipPos(null);

      // Wait for page to be ready first
      await waitForPageReady();

      // Wait for element to appear (with retry logic)
      const result = await waitForElement(step.target, {
        timeout: 30000, // Wait up to 30 seconds for element (allows time for user to navigate)
        retryInterval: 100,
        waitForNavigation: true,
      });

      if (cancelled) return;

      if (!result) {
        console.error('Tour element not found after waiting:', step.target);
        setIsLoading(false);
        return;
      }

      const { element } = result;

      // Scroll element into view
      scrollToElement(element);

      // Wait for scroll to complete
      setTimeout(() => {
        if (cancelled) return;

        const rect = getElementPosition(element);

        setHighlightPos({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });

        // Calculate tooltip position
        calculateTooltipPosition(rect, step.position || 'bottom');
        setIsLoading(false);
      }, 300);
    };

    findAndHighlightElement();

    return () => {
      cancelled = true;
    };
  }, [step]);

  const calculateTooltipPosition = (rect: DOMRect, preferredPosition: string) => {
    const tooltipWidth = 320;
    const tooltipHeight = 280; // Increased to account for actual height
    const padding = 16;
    const arrowSize = 12;

    let top = 0;
    let left = 0;
    let position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Helper function to check if tooltip would overlap with highlighted element
    const wouldOverlap = (t: number, l: number) => {
      const tooltipRect = {
        top: t,
        left: l,
        right: l + tooltipWidth,
        bottom: t + tooltipHeight,
      };
      const highlightRect = {
        top: rect.top - 8,
        left: rect.left - 8,
        right: rect.right + 8,
        bottom: rect.bottom + 8,
      };
      return !(
        tooltipRect.right < highlightRect.left ||
        tooltipRect.left > highlightRect.right ||
        tooltipRect.bottom < highlightRect.top ||
        tooltipRect.top > highlightRect.bottom
      );
    };

    // Try preferred position first
    switch (preferredPosition) {
      case 'top':
        top = rect.top - tooltipHeight - arrowSize - padding;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        position = 'top';
        break;
      case 'bottom':
        top = rect.bottom + arrowSize + padding;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        position = 'bottom';
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - arrowSize - padding;
        position = 'left';
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + arrowSize + padding;
        position = 'right';
        break;
      default:
        top = rect.bottom + arrowSize + padding;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        position = 'bottom';
    }

    // Keep tooltip within viewport bounds
    if (left + tooltipWidth > viewportWidth - padding) {
      left = viewportWidth - tooltipWidth - padding;
    }
    if (left < padding) {
      left = padding;
    }

    // If tooltip would go off screen or overlap, try alternative positions
    if (top + tooltipHeight > viewportHeight - padding || top < padding || wouldOverlap(top, left)) {
      // Try positions in order of preference
      const alternatives: Array<{ pos: 'top' | 'bottom' | 'left' | 'right'; t: number; l: number }> = [
        {
          pos: 'top',
          t: rect.top - tooltipHeight - arrowSize - padding,
          l: rect.left + rect.width / 2 - tooltipWidth / 2,
        },
        {
          pos: 'bottom',
          t: rect.bottom + arrowSize + padding,
          l: rect.left + rect.width / 2 - tooltipWidth / 2,
        },
        {
          pos: 'left',
          t: rect.top + rect.height / 2 - tooltipHeight / 2,
          l: rect.left - tooltipWidth - arrowSize - padding,
        },
        {
          pos: 'right',
          t: rect.top + rect.height / 2 - tooltipHeight / 2,
          l: rect.right + arrowSize + padding,
        },
      ];

      for (const alt of alternatives) {
        let altLeft = alt.l;
        // Adjust horizontal position to stay in viewport
        if (altLeft + tooltipWidth > viewportWidth - padding) {
          altLeft = viewportWidth - tooltipWidth - padding;
        }
        if (altLeft < padding) {
          altLeft = padding;
        }

        if (
          alt.t >= padding &&
          alt.t + tooltipHeight <= viewportHeight - padding &&
          !wouldOverlap(alt.t, altLeft)
        ) {
          top = alt.t;
          left = altLeft;
          position = alt.pos;
          break;
        }
      }
    }

    setTooltipPos({ top, left, position });
  };

  if (!mounted) return null;

  const content = (
    <>
      {/* Overlay with cutout for the highlighted element using 4 divs */}
      {highlightPos && (
        <>
          {/* Top overlay */}
          <div
            className="fixed z-[9998] bg-black/50 pointer-events-auto"
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: `${highlightPos.top - 8}px`,
            }}
          />
          {/* Bottom overlay */}
          <div
            className="fixed z-[9998] bg-black/50 pointer-events-auto"
            style={{
              top: `${highlightPos.top + highlightPos.height + 8}px`,
              left: 0,
              width: '100%',
              height: `calc(100vh - ${highlightPos.top + highlightPos.height + 8}px)`,
            }}
          />
          {/* Left overlay */}
          <div
            className="fixed z-[9998] bg-black/50 pointer-events-auto"
            style={{
              top: `${highlightPos.top - 8}px`,
              left: 0,
              width: `${highlightPos.left - 8}px`,
              height: `${highlightPos.height + 16}px`,
            }}
          />
          {/* Right overlay */}
          <div
            className="fixed z-[9998] bg-black/50 pointer-events-auto"
            style={{
              top: `${highlightPos.top - 8}px`,
              left: `${highlightPos.left + highlightPos.width + 8}px`,
              width: `calc(100vw - ${highlightPos.left + highlightPos.width + 8}px)`,
              height: `${highlightPos.height + 16}px`,
            }}
          />
        </>
      )}

      {/* Highlight border */}
      {highlightPos && (
        <>
          <div
            className="fixed z-[9999] pointer-events-none rounded-md border-4 border-blue-500 shadow-xl transition-all duration-300"
            style={{
              top: `${highlightPos.top - 4}px`,
              left: `${highlightPos.left - 4}px`,
              width: `${highlightPos.width + 8}px`,
              height: `${highlightPos.height + 8}px`,
            }}
          />

          {/* Pulsing animation */}
          <div
            className="fixed z-[9999] pointer-events-none rounded-md ring-4 ring-blue-400 animate-pulse transition-all duration-300"
            style={{
              top: `${highlightPos.top - 8}px`,
              left: `${highlightPos.left - 8}px`,
              width: `${highlightPos.width + 16}px`,
              height: `${highlightPos.height + 16}px`,
            }}
          />
        </>
      )}

      {/* Tooltip */}
      {(tooltipPos || isLoading) && (
        <Card
          ref={tooltipRef}
          className={cn(
            "fixed z-[10000] w-80 p-4 shadow-2xl transition-all duration-300 pointer-events-auto",
            "bg-white dark:bg-gray-900 border-2",
            !tooltipPos && isLoading && "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          )}
          style={tooltipPos ? {
            top: `${tooltipPos.top}px`,
            left: `${tooltipPos.left}px`,
          } : undefined}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            aria-label="Close tour"
          >
            <X className="h-4 w-4" />
          </button>

          {isLoading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mb-3" />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Finding element...
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Step {stepIndex + 1} of {totalSteps}
              </div>
            </div>
          ) : (
            <>
              {/* Step indicator */}
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
                Step {stepIndex + 1} of {totalSteps}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold mb-2 pr-6">{step.title}</h3>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {step.description}
              </p>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrev}
                  disabled={stepIndex === 0}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {stepIndex < totalSteps - 1 ? (
                  <Button size="sm" onClick={onNext} className="gap-1">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button size="sm" onClick={onClose}>
                    Finish
                  </Button>
                )}
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );

  return createPortal(content, document.body);
}
