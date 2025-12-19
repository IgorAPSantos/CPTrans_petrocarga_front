'use client';

import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import toast from 'react-hot-toast';
import { getMessagingInstance } from '@/lib/firebase';

export function useForegroundPush() {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function listen() {
      const messaging = await getMessagingInstance();
      if (!messaging) return;

      unsubscribe = onMessage(messaging, (payload) => {
        const title =
          payload.notification?.title ||
          payload.data?.title ||
          'Nova notificação';
        const body = payload.notification?.body || payload.data?.body || '';

        toast(`${title}${body ? `: ${body}` : ''}`, {
          icon: '🔔',
          duration: 4000,
        });
      });
    }

    listen();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
}
