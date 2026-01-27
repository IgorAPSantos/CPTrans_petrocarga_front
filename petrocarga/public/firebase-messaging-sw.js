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

const tipoImagem = {
  DENUNCIA: '/image-firebase/imag-denuncia.png',
  MOTORISTA: '/image-firebase/imag-motorista.png',
  VAGA: '/image-firebase/imag-vaga.png',
  RESERVA: '/image-firebase/imag-reserva.png',
  VEICULO: '/image-firebase/imag-veiculo.png',
};

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};

  const image = tipoImagem[data.tipo] || '/web-app-manifest-512x512.png';

  self.registration.showNotification(data.title || 'PetroCarga', {
    body: data.body || 'Você tem uma nova atualização',
    icon: '/web-app-manifest-192x192.png',
    badge: '/badge.png',
    image,

    vibrate: [100, 50, 100],

    tag: data.notificacaoId || 'petrocarga',
    renotify: true,

    actions: [
      { action: 'abrir', title: 'Ver detalhes' },
      { action: 'fechar', title: 'Ignorar' },
    ],

    data: {
      id: data.notificacaoId,
      tipo: data.tipo,
    },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'fechar') return;

  const data = event.notification.data;
  let url = '/';

  switch (data?.tipo) {
    case 'DENUNCIA':
      url = '/motorista/reservas/minhas-denuncias';
      break;
    case 'MOTORISTA':
      url = '/motoristas/reservas';
      break;
    case 'VAGA':
    case 'RESERVA':
      url = '/motorista/reservas';
      break;
    case 'VEICULO':
      url = '/motorista/veiculos/meus-veiculos';
      break;
  }

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            return client.focus();
          }
        }
        return clients.openWindow(url);
      }),
  );
});
