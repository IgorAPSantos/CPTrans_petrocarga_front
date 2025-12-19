'use client';

import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { getMessagingInstance } from '@/lib/firebase';
import { clientApi } from '@/lib/clientApi';

export function usePushSetup() {
  useEffect(() => {
    async function initPush() {
      console.log('🚀 [Push] Iniciando setup de push...');

      // 1️⃣ Permissão
      console.log('🔔 [Push] Solicitando permissão...');
      const permission = await Notification.requestPermission();
      console.log('🔔 [Push] Permissão:', permission);

      if (permission !== 'granted') {
        console.warn('⚠️ [Push] Permissão NÃO concedida. Abortando.');
        return;
      }

      // 2️⃣ Messaging
      console.log('📦 [Push] Obtendo instância do messaging...');
      const messaging = await getMessagingInstance();

      if (!messaging) {
        console.error('❌ [Push] Messaging não disponível.');
        return;
      }

      console.log('✅ [Push] Messaging obtido:', messaging);

      // 3️⃣ Token
      console.log('🔑 [Push] Gerando token FCM...');
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      if (!token) {
        console.error('❌ [Push] Token FCM não retornado.');
        return;
      }

      console.log('🔥 [Push] Token FCM gerado:', token);

      // 4️⃣ Backend
      console.log('📡 [Push] Enviando token para o backend...');
      await clientApi('/petrocarga/notificacoes/pushToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, plataforma: 'WEB' }),
      });

      console.log('✅ [Push] Token enviado com sucesso!');
    }

    initPush().catch((err) => {
      console.error('💥 [Push] Erro inesperado no setup:', err);
    });
  }, []);
}
