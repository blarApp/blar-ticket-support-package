import type { TourTarget } from './types';
import { findTourElement, type ElementMatch } from './elementFinder';

export interface WaitOptions {
  timeout?: number;
  retryInterval?: number;
  waitForNavigation?: boolean;
}

/**
 * Waits for an element to appear in the DOM with smart retry logic.
 * Handles:
 * - Page navigation delays
 * - Dynamic content loading
 * - Modal/dialog rendering
 * - AJAX content
 */
export async function waitForElement(
  target: TourTarget,
  options: WaitOptions = {}
): Promise<ElementMatch | null> {
  const {
    timeout = 10000, // 10 seconds max wait
    retryInterval = 100, // Check every 100ms
    waitForNavigation = true,
  } = options;

  const startTime = Date.now();

  // Try to find element immediately first
  let result = findTourElement(target);
  if (result) {
    return result;
  }

  // If element not found, wait for it to appear
  return new Promise((resolve) => {
    const checkElement = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= timeout) {
        console.warn(`Element not found after ${timeout}ms:`, target);
        resolve(null);
        return;
      }

      // Try to find element
      const result = findTourElement(target);
      if (result) {
        resolve(result);
        return;
      }

      // Retry after interval
      setTimeout(checkElement, retryInterval);
    };

    // Wait a bit for navigation/rendering before first retry
    const initialDelay = waitForNavigation ? 500 : retryInterval;
    setTimeout(checkElement, initialDelay);
  });
}

/**
 * Waits for page to be ready (DOM loaded, no pending navigations)
 */
export async function waitForPageReady(timeout = 5000): Promise<boolean> {
  if (document.readyState === 'complete') {
    return true;
  }

  return new Promise((resolve) => {
    const startTime = Date.now();

    const checkReady = () => {
      if (document.readyState === 'complete') {
        resolve(true);
        return;
      }

      if (Date.now() - startTime >= timeout) {
        resolve(false);
        return;
      }

      setTimeout(checkReady, 100);
    };

    checkReady();
  });
}

/**
 * Waits for URL to change (navigation completed)
 */
export async function waitForNavigation(
  expectedUrl?: string,
  timeout = 5000
): Promise<boolean> {
  const currentUrl = window.location.href;

  return new Promise((resolve) => {
    const startTime = Date.now();

    const checkUrl = () => {
      const newUrl = window.location.href;

      // URL changed
      if (newUrl !== currentUrl) {
        // If expected URL provided, check if it matches
        if (expectedUrl && !newUrl.includes(expectedUrl)) {
          // URL changed but not to expected page, keep waiting
          if (Date.now() - startTime >= timeout) {
            resolve(false);
            return;
          }
          setTimeout(checkUrl, 100);
          return;
        }

        // URL changed to expected page (or no specific page expected)
        resolve(true);
        return;
      }

      // Timeout
      if (Date.now() - startTime >= timeout) {
        resolve(false);
        return;
      }

      setTimeout(checkUrl, 100);
    };

    checkUrl();
  });
}
