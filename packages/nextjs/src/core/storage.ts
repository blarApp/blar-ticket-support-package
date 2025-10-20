import type { DiagnosticResponse, ChatSession, SupportChatMessage } from './schemas';

const STORAGE_PREFIX = 'blario_';
const DIAGNOSTICS_KEY = `${STORAGE_PREFIX}diagnostics`;
const CHAT_SESSION_KEY = `${STORAGE_PREFIX}chat_session`;
const CHAT_MESSAGES_KEY = `${STORAGE_PREFIX}chat_messages`;
const MAX_STORED_DIAGNOSTICS = 10;
const MAX_STORED_CHAT_MESSAGES = 100;

export interface StoredDiagnostic extends DiagnosticResponse {
  timestamp: number;
  viewed: boolean;
}

class StorageManager {
  private isAvailable: boolean = false;

  constructor() {
    this.isAvailable = this.checkStorageAvailability();
  }

  private checkStorageAvailability(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const testKey = `${STORAGE_PREFIX}test`;
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      console.warn('localStorage is not available');
      return false;
    }
  }

  saveDiagnostic(diagnostic: DiagnosticResponse): void {
    if (!this.isAvailable) return;

    try {
      const stored: StoredDiagnostic = {
        ...diagnostic,
        timestamp: Date.now(),
        viewed: false,
      };

      const diagnostics = this.getAllDiagnostics();
      diagnostics.unshift(stored);

      if (diagnostics.length > MAX_STORED_DIAGNOSTICS) {
        diagnostics.splice(MAX_STORED_DIAGNOSTICS);
      }

      localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify(diagnostics));
    } catch (error) {
      console.error('Failed to save diagnostic:', error);
    }
  }

  getAllDiagnostics(): StoredDiagnostic[] {
    if (!this.isAvailable) return [];

    try {
      const data = localStorage.getItem(DIAGNOSTICS_KEY);
      if (!data) return [];

      const diagnostics = JSON.parse(data);
      return Array.isArray(diagnostics) ? diagnostics : [];
    } catch (error) {
      console.error('Failed to retrieve diagnostics:', error);
      return [];
    }
  }

  getLatestDiagnostic(): StoredDiagnostic | null {
    const diagnostics = this.getAllDiagnostics();
    return diagnostics[0] ?? null;
  }

  getUnviewedDiagnostics(): StoredDiagnostic[] {
    return this.getAllDiagnostics().filter(d => !d.viewed);
  }

  markDiagnosticAsViewed(issueId: string): void {
    if (!this.isAvailable) return;

    try {
      const diagnostics = this.getAllDiagnostics();
      const updated = diagnostics.map(d =>
        d.issueId === issueId ? { ...d, viewed: true } : d
      );

      localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to mark diagnostic as viewed:', error);
    }
  }

  clearDiagnostics(): void {
    if (!this.isAvailable) return;

    try {
      localStorage.removeItem(DIAGNOSTICS_KEY);
    } catch (error) {
      console.error('Failed to clear diagnostics:', error);
    }
  }

  saveItem(key: string, value: any): void {
    if (!this.isAvailable) return;

    try {
      const storageKey = `${STORAGE_PREFIX}${key}`;
      const data = JSON.stringify(value);
      localStorage.setItem(storageKey, data);
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.isAvailable) return null;

    try {
      const storageKey = `${STORAGE_PREFIX}${key}`;
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to retrieve ${key}:`, error);
      return null;
    }
  }

  removeItem(key: string): void {
    if (!this.isAvailable) return;

    try {
      const storageKey = `${STORAGE_PREFIX}${key}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  }

  clearAll(): void {
    if (!this.isAvailable) return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear all storage:', error);
    }
  }

  // Chat-related storage methods

  saveChatSession(session: ChatSession): void {
    if (!this.isAvailable) return;

    try {
      localStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save chat session:', error);
    }
  }

  getChatSession(): ChatSession | null {
    if (!this.isAvailable) return null;

    try {
      const data = localStorage.getItem(CHAT_SESSION_KEY);
      if (!data) return null;

      return JSON.parse(data) as ChatSession;
    } catch (error) {
      console.error('Failed to retrieve chat session:', error);
      return null;
    }
  }

  saveChatMessages(messages: SupportChatMessage[]): void {
    if (!this.isAvailable) return;

    try {
      // Keep only the most recent messages
      const messagesToStore = messages.slice(-MAX_STORED_CHAT_MESSAGES);
      localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messagesToStore));
    } catch (error) {
      console.error('Failed to save chat messages:', error);
    }
  }

  getChatMessages(): SupportChatMessage[] {
    if (!this.isAvailable) return [];

    try {
      const data = localStorage.getItem(CHAT_MESSAGES_KEY);
      if (!data) return [];

      const messages = JSON.parse(data);
      return Array.isArray(messages) ? messages : [];
    } catch (error) {
      console.error('Failed to retrieve chat messages:', error);
      return [];
    }
  }

  addChatMessage(message: SupportChatMessage): void {
    if (!this.isAvailable) return;

    try {
      const messages = this.getChatMessages();
      messages.push(message);

      // Keep only the most recent messages
      const messagesToStore = messages.slice(-MAX_STORED_CHAT_MESSAGES);
      localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messagesToStore));
    } catch (error) {
      console.error('Failed to add chat message:', error);
    }
  }

  clearChatHistory(): void {
    if (!this.isAvailable) return;

    try {
      localStorage.removeItem(CHAT_SESSION_KEY);
      localStorage.removeItem(CHAT_MESSAGES_KEY);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  }
}

let storageManagerInstance: StorageManager | null = null;

export function getStorageManager(): StorageManager {
  if (!storageManagerInstance) {
    storageManagerInstance = new StorageManager();
  }
  return storageManagerInstance;
}

export function resetStorageManager(): void {
  if (storageManagerInstance) {
    storageManagerInstance.clearAll();
    storageManagerInstance = null;
  }
}