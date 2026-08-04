import { useEffect } from 'react';

export const useWebSocket = (url: string, onMessage: (data: any) => void) => {
  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success) {
        onMessage(data);
      }
    };

    return () => ws.close();
  }, [url]);
};
