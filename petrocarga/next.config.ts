import withPWAInit from '@ducanh2912/next-pwa';
import type { NextConfig } from 'next';

const withPWA = withPWAInit({
  dest: 'public',
  customWorkerDest: 'worker',

  disable: process.env.NODE_ENV === 'development',
  dynamicStartUrl: true, // Essencial para lidar com estados de login
  dynamicStartUrlRedirect: '/login',
  reloadOnOnline: true, // Recarrega automaticamente ao recuperar conexão
  cacheStartUrl: true,
  fallbacks: {
    document: '/offline', // Sua página de fallback
  },
  workboxOptions: {
    runtimeCaching: [
      {
        // --- Cache para as PÁGINAS (HTML) ---
        // Isso evita cair na tela offline ao dar F5 em páginas já visitadas
        urlPattern: ({ request }) => request.destination === 'document',
        handler: 'NetworkFirst', // Tenta sempre o mais novo, se falhar usa o cache da página
        options: {
          cacheName: 'pages-cache',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 24 * 60 * 60, // 24 horas
          },
        },
      },
      {
        // Cache para as Reservas do Usuário (API Java)
        urlPattern: ({ url }) =>
          url.pathname.startsWith('/petrocarga/reservas'),
        handler: 'NetworkFirst', // Tenta rede, se falhar, usa cache
        options: {
          cacheName: 'reservas-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 24 horas
          },
          networkTimeoutSeconds: 10, // Se a rede demorar >10s, usa o cache
        },
      },
      {
        // Cache para arquivos estáticos (Assets)
        urlPattern: ({ request }) =>
          request.destination === 'image' || request.destination === 'font',
        handler: 'StaleWhileRevalidate', // Mostra o que tem no cache e atualiza por trás
        options: { cacheName: 'assets-cache' },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);
