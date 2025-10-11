'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import type { Tour, TourState, TourStep } from './types';
import { TourOverlay } from './TourOverlay';

export interface TourContextValue {
  state: TourState;
  startTour: (tour: Tour) => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  currentStep: TourStep | null;
}

const TourContext = createContext<TourContextValue | null>(null);

export interface TourProviderProps {
  children: ReactNode;
}

export function TourProvider({ children }: TourProviderProps) {
  const [state, setState] = useState<TourState>({
    activeTour: null,
    currentStepIndex: 0,
    isActive: false,
  });

  const startTour = useCallback((tour: Tour) => {
    setState({
      activeTour: tour,
      currentStepIndex: 0,
      isActive: true,
    });
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      if (!prev.activeTour) return prev;
      const nextIndex = prev.currentStepIndex + 1;

      if (nextIndex >= prev.activeTour.steps.length) {
        // Tour completed
        return {
          activeTour: null,
          currentStepIndex: 0,
          isActive: false,
        };
      }

      return {
        ...prev,
        currentStepIndex: nextIndex,
      };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => {
      if (!prev.activeTour || prev.currentStepIndex === 0) return prev;

      return {
        ...prev,
        currentStepIndex: prev.currentStepIndex - 1,
      };
    });
  }, []);

  const endTour = useCallback(() => {
    setState({
      activeTour: null,
      currentStepIndex: 0,
      isActive: false,
    });
  }, []);

  const currentStep = state.activeTour?.steps[state.currentStepIndex] || null;

  // Handle escape key to end tour
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isActive) {
        endTour();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [state.isActive, endTour]);

  const value: TourContextValue = {
    state,
    startTour,
    nextStep,
    prevStep,
    endTour,
    currentStep,
  };

  return (
    <TourContext.Provider value={value}>
      {children}
      {state.isActive && currentStep && (
        <TourOverlay
          step={currentStep}
          stepIndex={state.currentStepIndex}
          totalSteps={state.activeTour?.steps.length || 0}
          onNext={nextStep}
          onPrev={prevStep}
          onClose={endTour}
        />
      )}
    </TourContext.Provider>
  );
}

export function useTour(): TourContextValue {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
