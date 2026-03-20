import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export type Message = { type: 'success' | 'error'; text: string };

export function useTempMessage() {
  const location = useLocation();
  const locationState = location.state as { message?: string } | null;

  const [message, setMessage] = useState<Message | null>(
    locationState?.message ? { type: 'success', text: locationState.message } : null
  );

  useEffect(() => {
    if (locationState?.message) {
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  return { message, setMessage };
}
