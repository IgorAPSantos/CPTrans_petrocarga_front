'use client';

import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { getMessagingInstance } from '@/lib/firebase';
import { clientApi } from '@/lib/clientApi';

export function usePushSetup() {
  useEffect(() => {
    async function initPush() {
      // 1️⃣ Permissão

      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        console.warn('⚠️ [Push] Permissão NÃO concedida. Abortando.');
        return;
      }

      // 2️⃣ Messaging

      const messaging = await getMessagingInstance();

      if (!messaging) {
        console.error('❌ [Push] Messaging não disponível.');
        return;
      }

      // 3️⃣ Token

      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      if (!token) {
        console.error('❌ [Push] Token FCM não retornado.');
        return;
      }

      // 4️⃣ Backend

      await clientApi('/petrocarga/notificacoes/pushToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, plataforma: 'WEB' }),
      });
    }

    initPush().catch((err) => {
      console.error('💥 [Push] Erro inesperado no setup:', err);
    });
  }, []);
}
