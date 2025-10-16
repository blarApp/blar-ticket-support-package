import type { DiagnosticResponse } from '../schemas';

const STORAGE_PREFIX = 'blario_';
const DIAGNOSTICS_KEY = `${STORAGE_PREFIX}diagnostics`;
const MAX_STORED_DIAGNOSTICS = 10;

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


