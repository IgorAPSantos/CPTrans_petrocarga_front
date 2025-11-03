import Footer from "@/components/gestor/layout/footer";
import { Metadata } from "next";
import { Maven_Pro } from "next/font/google";
import { MapProvider } from "@/context/MapContext";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const mavenPro = Maven_Pro({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-maven-pro",
});

export const metadata: Metadata = {
  title: "PetroCarga",
  description:
    "O Petrocarga trás aos motoristas uma plataforma eficiente para gerenciamento de cargas e rotas.",
};

export default function GestorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`flex min-h-screen flex-col ${mavenPro.variable}`}>
      <main className="flex-1 relative">
        <MapProvider>{children}</MapProvider>
      </main>
      <Footer />
    </div>
  );
}
