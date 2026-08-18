const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/api/v1/ws';

export interface RealtimeEvent {
  event_version: string;
  event_id: string;
  event_type: string;
  repository_id: string;
  repository_version_id: string;
  timestamp: string;
  payload: any;
}

export class RealtimeClient {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Array<(payload: any) => void>> = new Map();

  constructor(private repositoryId: string, private versionId: string) {}

  connect() {
    if (this.ws) return;
    if (!this.repositoryId || this.repositoryId === 'undefined' || !this.versionId || this.versionId === 'undefined') {
      return;
    }

    const url = `${WS_BASE_URL}/repositories/${this.repositoryId}/versions/${this.versionId}`;
    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            type: 'AUTH',
            token: 'demo',
            repository_id: this.repositoryId,
            version_id: this.versionId
          }));
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data: RealtimeEvent = JSON.parse(event.data);
          const callbacks = this.listeners.get(data.event_type) || [];
          callbacks.forEach(cb => cb(data.payload));
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      };
      
      this.ws.onclose = () => {
        // Silently close
      };

      this.ws.onerror = () => {
        // Silently handle error
      };
    } catch (e) {
      console.warn('WebSocket connection not supported in this environment', e);
    }
  }

  on(eventType: string, callback: (payload: any) => void) {
    const callbacks = this.listeners.get(eventType) || [];
    callbacks.push(callback);
    this.listeners.set(eventType, callbacks);
  }

  disconnect() {
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }
    this.listeners.clear();
  }
}
