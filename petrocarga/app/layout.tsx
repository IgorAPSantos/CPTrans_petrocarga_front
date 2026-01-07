import type { Metadata } from 'next';
import { Maven_Pro } from 'next/font/google';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationWrapper } from '@/components/notification/notificationWrapper';
import { Toaster } from 'react-hot-toast';
import VLibrasWidget from '@/components/VLibras/VLibras';

const mavenPro = Maven_Pro({
  weight: 'variable',
  subsets: ['latin'],
  variable: '--font-maven-pro',
});

export const metadata: Metadata = {
  title: 'PetroCarga',
  description:
    'O Petrocarga trás aos motoristas uma plataforma eficiente para gerenciamento de cargas e rotas',

  themeColor: '#3a2bc2',

  appleWebApp: {
    capable: true,
    title: 'Petrocarga',
    statusBarStyle: 'default',
  },

  icons: {
    apple: '/web-app-manifest-192x192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={mavenPro.variable}>
      <body>
        <Toaster position="top-center" />
        <AuthProvider>
          <NotificationWrapper>
            {children} <VLibrasWidget />
          </NotificationWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
