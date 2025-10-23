import Footer from "@/app/gestor/layout/footer";
import { Navbar } from "@/app/gestor/layout/navbar";
import { Metadata } from "next";
import { Maven_Pro } from 'next/font/google';
import { MapProvider } from "@/context/MapContext";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./globals.css";

const mavenPro = Maven_Pro({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-maven-pro"
});

export const metadata: Metadata = {
  title: "PetroCarga",
  description: "O CodanteVagas conecta candidatos a empregos ideais, oferecendo funcionalidades intuitivas para busca er gerenciamento de vagas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={mavenPro.variable}>
      <body>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 relative">
            <MapProvider>{children}</MapProvider>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
