import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getApiClient, resetApiClient } from '../managers/api';
import { getCaptureManager, resetCaptureManager } from '../managers/capture';

describe('core managers', () => {
  beforeEach(() => {
    resetApiClient();
    resetCaptureManager();
  });

  it('creates a singleton api client', () => {
    const config = { apiBaseUrl: 'https://example.com', publishableKey: 'pk_test' };
    const clientA = getApiClient(config);
    const clientB = getApiClient(config);

    expect(clientA).toBe(clientB);
  });

  it('capture manager tracks routes', () => {
    const manager = getCaptureManager();
    manager.trackRoute('/one');
    manager.trackRoute('/two');

    expect(manager.getRouteHistory()).toEqual(['/one', '/two']);
  });

  it('capture manager redacts sensitive values', () => {
    const manager = getCaptureManager();

    const log = (console.log = vi.fn());
    manager.startCapture();
    console.log('apiKey=secret');
    manager.stopCapture();

    expect(log).toHaveBeenCalledWith('apiKey=secret');
    const captured = manager.getConsoleLogs();
    expect(captured[0].message).toContain('[REDACTED]');
  });
});

