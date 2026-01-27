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

const image = tipoImagem[data.tipo] || '';

messaging.showNotification(data.title || 'PetroCarga', {
  body: data.body || 'Você tem uma nova atualização',
  icon: '/web-app-manifest-192x192.png',
  badge: '/icons/badge.png',
  image,

  vibrate: [100, 50, 100],

  tag: data.id || 'petrocarga',
  renotify: true,

  actions: [
    {
      action: 'abrir',
      title: 'Ver detalhes',
    },
    {
      action: 'fechar',
      title: 'Ignorar',
    },
  ],

  data: {
    url: data.url || '/',
    id: data.id,
    tipo: data.tipo,
  },
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === 'fechar') {
    return;
  }

  let url = data?.url || '/';

  if (!data?.url) {
    switch (data?.tipo) {
      case 'DENUNCIA':
        url = `/motorista/reservas/minhas-denuncias`;
        break;
      case 'MOTORISTA':
        url = `/motoristas/reservas`;
        break;
      case 'VAGA':
        url = `/motorista/reservas`;
        break;
      case 'RESERVA':
        url = `/motorista/reservas`;
        break;
      case 'VEICULO':
        url = `/motorista/veiculos/meus-veiculos`;
        break;
      default:
        url = '/';
    }
  }

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
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
