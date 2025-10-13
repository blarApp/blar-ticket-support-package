import type { TourTarget } from './types';

export interface ElementMatch {
  element: HTMLElement;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Finds an element using a tiered approach:
 * 1. data-tour-id (highest priority - optional)
 * 2. CSS selector with text validation
 * 3. Smart text-only search with context
 * 4. Aria-label search
 * 5. CSS selector with index
 */
export function findTourElement(target: TourTarget): ElementMatch | null {
  // Strategy 1: Try data-tour-id first (most reliable, but optional)
  if (target.tourId) {
    const element = document.querySelector(`[data-tour-id="${target.tourId}"]`) as HTMLElement;
    if (element) {
      // Validate with text if provided
      if (target.text && !elementMatchesText(element, target.text)) {
        console.warn(`Element with tour-id "${target.tourId}" found but text doesn't match`);
      }
      return { element, confidence: 'high' };
    }
  }

  // Strategy 2: Try CSS selector with text validation
  if (target.selector) {
    const elements = Array.from(document.querySelectorAll(target.selector)) as HTMLElement[];

    if (elements.length === 0) {
      // If selector fails but we have text, try smart text search
      if (target.text) {
        return findByTextContent(target.text, target.context);
      }
      return null;
    }

    // If text is provided, find matching element
    if (target.text) {
      const matchingElement = elements.find(el => elementMatchesText(el, target.text!));
      if (matchingElement) {
        return { element: matchingElement, confidence: 'medium' };
      }
      // If no exact match with selector + text, fall back to text search with context
      return findByTextContent(target.text, target.context);
    }

    // If index is provided, use it
    if (target.index !== undefined) {
      const element = elements[target.index];
      if (element) {
        return { element, confidence: 'medium' };
      }
    }

    // Default to first element
    if (elements.length === 1) {
      const element = elements[0];
      if (element) {
        return { element, confidence: 'medium' };
      }
    }

    // Multiple elements without clear identifier
    if (elements.length > 0) {
      const element = elements[0];
      if (element) {
        console.warn(`Multiple elements found for selector "${target.selector}", using first one`);
        return { element, confidence: 'low' };
      }
    }
  }

  // Strategy 3: If only text is provided, use smart text search
  if (target.text) {
    return findByTextContent(target.text, target.context);
  }

  return null;
}

/**
 * Smart text-based element finder that searches through common interactive elements
 * @param text The text to search for
 * @param context Optional context text to help narrow down the match (e.g., parent element text)
 */
function findByTextContent(text: string, context?: string): ElementMatch | null {
  const normalizedText = text.trim().toLowerCase();
  const normalizedContext = context?.trim().toLowerCase();

  // Search in priority order: buttons, links, headings, then all elements
  const selectors = [
    'button',
    'a',
    'h1, h2, h3, h4, h5, h6',
    '[role="button"]',
    'input[type="submit"]',
    'input[type="button"]',
    'label',
    'span',
    'div',
  ];

  for (const selector of selectors) {
    const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];

    // Try exact match first
    let match = elements.find(el => {
      const elementText = getElementText(el).toLowerCase();
      const isTextMatch = elementText === normalizedText;

      // If context is provided, check if the element or its ancestors contain the context
      if (isTextMatch && normalizedContext) {
        return hasContextMatch(el, normalizedContext);
      }

      return isTextMatch;
    });

    if (match) {
      // Prefer interactive elements, but return non-interactive ones if found
      if (isInteractiveElement(match)) {
        return { element: match, confidence: normalizedContext ? 'high' : 'medium' };
      }
      // For non-interactive elements (like headings), still return them but continue searching
      // in case we find an interactive element with the same text later
      if (selector === 'h1, h2, h3, h4, h5, h6') {
        return { element: match, confidence: normalizedContext ? 'high' : 'medium' };
      }
    }

    // Try contains match
    match = elements.find(el => {
      const elementText = getElementText(el).toLowerCase();
      const directText = getDirectTextContent(el).toLowerCase();
      const isTextMatch = elementText.includes(normalizedText) && directText.includes(normalizedText);

      // If context is provided, check if the element or its ancestors contain the context
      if (isTextMatch && normalizedContext) {
        return hasContextMatch(el, normalizedContext);
      }

      return isTextMatch;
    });

    if (match) {
      if (isInteractiveElement(match)) {
        return { element: match, confidence: normalizedContext ? 'medium' : 'low' };
      }
      // For headings with contains match, still return them
      if (selector === 'h1, h2, h3, h4, h5, h6') {
        return { element: match, confidence: normalizedContext ? 'medium' : 'low' };
      }
    }
  }

  return null;
}

/**
 * Checks if an element or its ancestors contain the context text
 */
function hasContextMatch(element: HTMLElement, contextText: string): boolean {
  let current: HTMLElement | null = element.parentElement;
  let depth = 0;
  const maxDepth = 5; // Don't search too far up the tree

  while (current && depth < maxDepth) {
    const currentText = current.textContent?.toLowerCase() || '';
    if (currentText.includes(contextText)) {
      return true;
    }
    current = current.parentElement;
    depth++;
  }

  return false;
}

/**
 * Gets the direct text content of an element (not including children)
 */
function getDirectTextContent(element: HTMLElement): string {
  const clone = element.cloneNode(true) as HTMLElement;
  const children = clone.children;
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    if (child) {
      clone.removeChild(child);
    }
  }
  return clone.textContent?.trim() || '';
}

/**
 * Gets the full text content of an element
 */
function getElementText(element: HTMLElement): string {
  // Check aria-label first
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check title
  const title = element.getAttribute('title');
  if (title) return title;

  // Get text content
  return element.textContent?.trim() || '';
}

/**
 * Checks if an element is typically interactive
 */
function isInteractiveElement(element: HTMLElement): boolean {
  const tag = element.tagName.toLowerCase();
  const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];

  if (interactiveTags.includes(tag)) return true;

  // Check for click handlers or role
  if (element.onclick || element.getAttribute('role') === 'button') return true;

  // Check if it's clickable via cursor style
  const style = window.getComputedStyle(element);
  if (style.cursor === 'pointer') return true;

  return false;
}

function elementMatchesText(element: HTMLElement, text: string): boolean {
  const elementText = element.textContent?.trim().toLowerCase() || '';
  const targetText = text.trim().toLowerCase();

  // Exact match or contains
  return elementText === targetText || elementText.includes(targetText);
}

export function getElementPosition(element: HTMLElement): DOMRect {
  return element.getBoundingClientRect();
}

/**
 * Scrolls element into view with smooth behavior
 */
export function scrollToElement(element: HTMLElement): void {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center',
  });
}

/**
 * Helper function to add tour-id to an element
 * Usage: <button {...withTour('my-button-id')}>Click me</button>
 */
export function withTour(tourId: string): { 'data-tour-id': string } {
  return { 'data-tour-id': tourId };
}
