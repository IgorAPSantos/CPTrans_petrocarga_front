import type { Metadata, Viewport } from 'next';
import { Maven_Pro } from 'next/font/google';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationWrapper } from '@/components/notification/notificationWrapper';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/next';

const mavenPro = Maven_Pro({
  weight: 'variable',
  subsets: ['latin'],
  variable: '--font-maven-pro',
});

export const metadata: Metadata = {
  title: 'PetroCarga',
  description:
    'O Petrocarga trás aos motoristas uma plataforma eficiente para gerenciamento de cargas e rotas',

  appleWebApp: {
    capable: true,
    title: 'Petrocarga',
    statusBarStyle: 'default',
  },

  icons: {
    apple: '/web-app-manifest-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#3a2bc2',
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
          <NotificationWrapper>{children}</NotificationWrapper>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
