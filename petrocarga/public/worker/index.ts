/// <reference lib="webworker" />

export {};

// 1. Definindo interfaces para o Firebase (para evitar o 'any')
interface FirebaseNotification {
  title?: string;
  body?: string;
}

interface MessagePayload {
  notification?: FirebaseNotification;
  data?: Record<string, string>;
}

// Interface mínima para o objeto global do Firebase compat
interface FirebaseNamespace {
  initializeApp: (options: Record<string, string>) => void;
  messaging: () => {
    onBackgroundMessage: (callback: (payload: MessagePayload) => void) => void;
  };
}

// 2. Declarações com tipos específicos
declare const firebase: FirebaseNamespace;
declare const self: ServiceWorkerGlobalScope;

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

// 3. Inicialização
firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
});

const messaging = firebase.messaging();

// 4. Handler com tipo MessagePayload definido acima
messaging.onBackgroundMessage((payload: MessagePayload) => {
  console.log("[SW] Mensagem recebida:", payload);

  const title = payload.notification?.title || "Nova atualização PetroCarga";
  const options: NotificationOptions = {
    body: payload.notification?.body,
    icon: "/icons/icon-192x192.png",
    data: payload.data, // Payload.data agora é Record<string, string>
  };

  self.registration.showNotification(title, options);
});
