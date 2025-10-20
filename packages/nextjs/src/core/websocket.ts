// Messages received from backend
export type WebSocketMessage =
  | { type: 'info'; message: string }
  | { type: 'user_message'; message: string; user_id?: string }
  | { type: 'agent_typing'; is_typing: boolean }
  | { type: 'agent_message_chunk'; content: Array<{ type: 'text'; text: string; annotations?: unknown[] }> }
  | { type: 'agent_message_complete'; message: string }
  | { type: 'error'; message: string; details?: string };

// Messages sent to backend
export type OutgoingWebSocketMessage =
  | { type: 'chat_message'; message: string; user_id?: string };

export type WebSocketEventType = 'open' | 'close' | 'error' | 'message';

export type WebSocketEventHandler = (event: WebSocketMessage | Event) => void;

export interface WebSocketManagerConfig {
  baseUrl: string; // e.g., "wss://api.blar.io"
  publishableKey: string;
  chatRoomId?: string; // Optional - will generate UUID if not provided
  userId?: string; // Optional user identifier
  maxReconnectAttempts?: number;
  reconnectDelayMs?: number;
  heartbeatIntervalMs?: number;
}

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'failed';

/**
 * WebSocket manager with auto-reconnect functionality
 */
export class WebSocketManager {
  private config: Required<Omit<WebSocketManagerConfig, 'chatRoomId' | 'userId'>> & { chatRoomId: string; userId?: string };
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private eventHandlers: Map<WebSocketEventType, Set<WebSocketEventHandler>> = new Map();
  private messageQueue: OutgoingWebSocketMessage[] = [];
  private connectionState: ConnectionState = 'disconnected';

  constructor(config: WebSocketManagerConfig) {
    // Generate UUID for chat room if not provided
    const chatRoomId = config.chatRoomId || this.generateUUID();

    this.config = {
      maxReconnectAttempts: 5,
      reconnectDelayMs: 1000,
      heartbeatIntervalMs: 30000,
      baseUrl: config.baseUrl,
      publishableKey: config.publishableKey,
      chatRoomId,
      userId: config.userId,
    };

    // Initialize event handler sets
    this.eventHandlers.set('open', new Set());
    this.eventHandlers.set('close', new Set());
    this.eventHandlers.set('error', new Set());
    this.eventHandlers.set('message', new Set());
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.warn('WebSocket is already connected');
      return;
    }

    this.connectionState = this.reconnectAttempts > 0 ? 'reconnecting' : 'connecting';
    this.notifyStateChange();

    // Build WebSocket URL: ws://domain/ws/support/chat/<chat_room_id>/?publishable_key=<key>
    const baseUrl = this.config.baseUrl.replace(/^http/, 'ws'); // Convert http(s) to ws(s)
    const wsUrl = `${baseUrl}/ws/support/chat/${this.config.chatRoomId}/?publishable_key=${this.config.publishableKey}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.clearReconnectTimeout();

    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }

    this.connectionState = 'disconnected';
    this.notifyStateChange();
  }

  /**
   * Send a message through WebSocket
   */
  sendMessage(message: OutgoingWebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message if not connected
      this.messageQueue.push(message);
      console.warn('WebSocket not connected, message queued');
    }
  }

  /**
   * Send text message
   */
  sendTextMessage(content: string): void {
    const message: OutgoingWebSocketMessage = {
      type: 'chat_message',
      message: content,
    };

    if (this.config.userId) {
      message.user_id = this.config.userId;
    }

    this.sendMessage(message);
  }

  /**
   * Subscribe to WebSocket events
   */
  on(event: WebSocketEventType, handler: WebSocketEventHandler): () => void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.add(handler);
    }

    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Get chat room ID
   */
  getChatRoomId(): string {
    return this.config.chatRoomId;
  }

  private handleOpen(event: Event): void {
    console.log('WebSocket connected');
    this.connectionState = 'connected';
    this.reconnectAttempts = 0;
    this.notifyStateChange();

    // Flush queued messages
    this.flushMessageQueue();

    // Notify handlers
    const handlers = this.eventHandlers.get('open');
    if (handlers) {
      handlers.forEach(handler => handler(event));
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log('WebSocket closed:', event.code, event.reason);

    // Notify handlers
    const handlers = this.eventHandlers.get('close');
    if (handlers) {
      handlers.forEach(handler => handler(event));
    }

    // Attempt to reconnect unless it was a clean close
    if (!event.wasClean) {
      this.scheduleReconnect();
    } else {
      this.connectionState = 'disconnected';
      this.notifyStateChange();
    }
  }

  private handleError(event: Event): void {
    console.error('WebSocket error:', event);

    // Notify handlers
    const handlers = this.eventHandlers.get('error');
    if (handlers) {
      handlers.forEach(handler => handler(event));
    }
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data) as WebSocketMessage;

      // Notify handlers
      const handlers = this.eventHandlers.get('message');
      if (handlers) {
        handlers.forEach(handler => handler(message));
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      this.connectionState = 'failed';
      this.notifyStateChange();
      return;
    }

    this.clearReconnectTimeout();

    const delay = this.config.reconnectDelayMs * Math.pow(2, this.reconnectAttempts);
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.config.maxReconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  private notifyStateChange(): void {
    // This could emit a state change event if needed
    // For now, we rely on polling getConnectionState()
  }
}

// Singleton instance
let wsManagerInstance: WebSocketManager | null = null;

export function getWebSocketManager(config: WebSocketManagerConfig): WebSocketManager {
  if (!wsManagerInstance) {
    wsManagerInstance = new WebSocketManager(config);
  }
  return wsManagerInstance;
}

export function resetWebSocketManager(): void {
  if (wsManagerInstance) {
    wsManagerInstance.disconnect();
    wsManagerInstance = null;
  }
}
