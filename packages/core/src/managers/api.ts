import {
  IssueReportPayloadSchema,
  TriageRequestSchema,
  TriageResponseSchema,
  type ChatHistoryMessage,
  type IssueReportPayload,
  type TriageResponse,
} from '../schemas';

export interface ApiClientConfig {
  apiBaseUrl: string;
  publishableKey: string;
  maxRetries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private config: Required<ApiClientConfig>;
  private abortController?: AbortController;

  constructor(config: ApiClientConfig) {
    this.config = {
      maxRetries: 3,
      retryDelayMs: 1000,
      timeoutMs: 30000,
      headers: {},
      ...config,
    };
  }

  getConfig(): Required<ApiClientConfig> {
    return this.config;
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = 0
  ): Promise<Response> {
    try {
      this.abortController = new AbortController();

      const timeoutId = setTimeout(() => {
        this.abortController?.abort();
      }, this.config.timeoutMs);

      const response = await fetch(url, {
        ...options,
        signal: this.abortController.signal,
        headers: {
          'Content-Type': 'application/json',
          'X-Publishable-Key': this.config.publishableKey,
          ...this.config.headers,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok && retries < this.config.maxRetries) {
        const shouldRetry = response.status >= 500 || response.status === 429;

        if (shouldRetry) {
          const delay = this.config.retryDelayMs * Math.pow(2, retries);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.fetchWithRetry(url, options, retries + 1);
        }
      }

      return response;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout');
        }

        if (retries < this.config.maxRetries) {
          const delay = this.config.retryDelayMs * Math.pow(2, retries);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.fetchWithRetry(url, options, retries + 1);
        }
      }

      throw error;
    }
  }

  async submitIssue(payload: IssueReportPayload): Promise<{ issueId: string }> {
    const validation = IssueReportPayloadSchema.safeParse(payload);
    if (!validation.success) {
      throw new ApiError('Invalid payload', 400, validation.error.errors);
    }

    const url = `${this.config.apiBaseUrl}/api/support/issue`;

    try {
      const response = await this.fetchWithRetry(url, {
        method: 'POST',
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null) as { message?: string } | null;
        throw new ApiError(
          errorData?.message ?? `Failed to submit issue: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      const data = await response.json() as { issueId?: string };

      if (!data.issueId) {
        throw new ApiError('Invalid response: missing issueId');
      }

      return { issueId: data.issueId };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Failed to submit issue'
      );
    }
  }

  async generateIssuePrefill(
    messages: ChatHistoryMessage[]
  ): Promise<TriageResponse> {
    const validation = TriageRequestSchema.safeParse({ messages });
    if (!validation.success) {
      throw new ApiError('Invalid chat history payload', 400, validation.error.errors);
    }

    const url = `${this.config.apiBaseUrl}/api/support/triage`;

    try {
      const response = await this.fetchWithRetry(url, {
        method: 'POST',
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null) as { message?: string } | null;
        throw new ApiError(
          errorData?.message ?? `Failed to generate issue prefill: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      const data = await response.json() as unknown;
      const parsed = TriageResponseSchema.safeParse(data);

      if (!parsed.success) {
        throw new ApiError('Invalid response from triage endpoint', response.status, parsed.error.errors);
      }

      return parsed.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error
          ? error.message
          : 'Failed to generate issue prefill'
      );
    }
  }



  abort(): void {
    this.abortController?.abort();
  }
}

let apiClientInstance: ApiClient | null = null;

export function getApiClient(config: ApiClientConfig): ApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new ApiClient(config);
  }
  return apiClientInstance;
}

export function resetApiClient(): void {
  if (apiClientInstance) {
    apiClientInstance.abort();
    apiClientInstance = null;
  }
}
