import { useEffect, useRef, useCallback } from 'react';

export function useWebSocket(onMessage) {
  const ws = useRef(null);
  const reconnect = useRef(null);

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket('ws://localhost:5000');
      ws.current.onopen    = () => console.log('🔴 Live sync connected');
      ws.current.onmessage = (e) => { try { onMessage(JSON.parse(e.data)); } catch {} };
      ws.current.onclose   = () => { reconnect.current = setTimeout(connect, 3000); };
      ws.current.onerror   = () => ws.current?.close();
    } catch {}
  }, [onMessage]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnect.current);
      ws.current?.close();
    };
  }, [connect]);
}
