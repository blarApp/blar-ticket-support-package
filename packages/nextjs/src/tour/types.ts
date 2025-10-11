export interface TourTarget {
  tourId?: string;
  selector?: string;
  text?: string;
  index?: number;
}

export type TourStepPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface TourStep {
  target: TourTarget;
  title: string;
  description: string;
  position?: TourStepPosition;
}

export interface Tour {
  id: string;
  steps: TourStep[];
}

export interface TourState {
  activeTour: Tour | null;
  currentStepIndex: number;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  tour?: Tour;
  timestamp: number;
}

export interface ChatAssistantResponse {
  message: string;
  tour?: Tour;
}
