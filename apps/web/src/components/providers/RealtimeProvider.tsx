'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';

type SyncStatus = 'CONNECTING' | 'AUTHENTICATING' | 'CONNECTED' | 'SYNCING' | 'READY' | 'DEGRADED' | 'DISCONNECTED' | 'FAILED';

interface RealtimeContextType {
  status: SyncStatus;
  events: any[];
  requestContext: (file_path: string, line?: number, symbol_id?: string, level?: string) => string;
  requestAI: (query: string, context: any) => string;
}

const RealtimeContext = createContext<RealtimeContextType>({
  status: 'DISCONNECTED',
  events: [],
  requestContext: () => '',
  requestAI: () => '',
});

export function useRealtime() {
  return useContext(RealtimeContext);
}

interface RealtimeProviderProps {
  repositoryId: string;
  versionId: string;
  children: React.ReactNode;
}

export function RealtimeProvider({ repositoryId, versionId, children }: RealtimeProviderProps) {
  const [status, setStatus] = useState<SyncStatus>('DISCONNECTED');
  const [events, setEvents] = useState<any[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const backoff = useRef(1000);
  const isConnecting = useRef(false);

  const connect = useCallback(() => {
    if (ws.current || isConnecting.current) return;
    if (!repositoryId || repositoryId === 'undefined' || !versionId || versionId === 'undefined') {
      return;
    }

    isConnecting.current = true;
    setStatus('CONNECTING');

    const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'localhost:8000' : (typeof window !== 'undefined' ? window.location.host : 'localhost:8000');
    const url = `${protocol}//${host}/api/v1/ws/repositories/${repositoryId}/versions/${versionId}`;

    try {
      const socket = new WebSocket(url);
      ws.current = socket;

      socket.onopen = () => {
        isConnecting.current = false;
        setStatus('AUTHENTICATING');
        
        socket.send(JSON.stringify({
          type: 'AUTH',
          token: 'demo',
          repository_id: repositoryId,
          version_id: versionId
        }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'AUTH_SUCCESS') {
            setStatus('CONNECTED');
            backoff.current = 1000;
          } else if (data.type === 'AUTH_FAILED') {
            setStatus('FAILED');
            socket.close();
          } else if (data.event_type === 'VERSION_READY') {
            setStatus('READY');
            setEvents(prev => [...prev, data]);
          } else {
            setEvents(prev => [...prev, data]);
          }
        } catch (e) {
          console.error('Failed to parse WS message', e);
        }
      };

      socket.onclose = () => {
        ws.current = null;
        isConnecting.current = false;
        setStatus('DISCONNECTED');
        
        if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = setTimeout(() => {
          connect();
        }, backoff.current);
        backoff.current = Math.min(backoff.current * 2, 30000);
      };

      socket.onerror = () => {
        setStatus('DEGRADED');
      };

    } catch (err) {
      isConnecting.current = false;
      setStatus('DISCONNECTED');
    }
  }, [repositoryId, versionId]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (ws.current) {
        try {
          ws.current.close();
        } catch {}
        ws.current = null;
      }
    };
  }, [connect]);

  const requestContext = useCallback((file_path: string, line?: number, symbol_id?: string, level: string = 'LIGHT') => {
    const requestId = crypto.randomUUID();
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'CONTEXT_CHANGED',
        request_id: requestId,
        payload: { file_path, line, symbol_id, level }
      }));
    }
    return requestId;
  }, []);

  const requestAI = useCallback((query: string, context: any) => {
    const requestId = crypto.randomUUID();
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'REQUEST_AI',
        request_id: requestId,
        payload: { query, context }
      }));
    }
    return requestId;
  }, []);

  return (
    <RealtimeContext.Provider value={{ status, events, requestContext, requestAI }}>
      {children}
    </RealtimeContext.Provider>
  );
}
