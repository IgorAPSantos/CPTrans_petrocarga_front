importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js',
);

firebase.initializeApp({
  apiKey: 'AIzaSyDi5Wou9dBT4z2z0IKa6Kcnckxp6PVs7c4',
  projectId: 'petrocarga-project',
  messagingSenderId: '476009259514',
  appId: '1:476009259514:web:40ad673374875e8cb14443',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};

  self.registration.showNotification(data.title || 'PetroCarga', {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge.png',
    tag: data.id,
    data: {
      id: data.id,
      tipo: data.tipo,
      lida: data.lida === 'true',
      metadata: data.metadata,
    },
  });
});
