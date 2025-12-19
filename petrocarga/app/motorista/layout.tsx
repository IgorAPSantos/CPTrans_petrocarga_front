import Footer from "../../components/motorista/layout/footer";
import { Navbar } from "../../components/motorista/layout/navbar";
import { Metadata } from "next";
import { PushProvider } from "@/context/PushProvider/PushProvider";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

export const metadata: Metadata = {
  title: "PetroCarga",
  description:
    "O Petrocarga trás aos motoristas uma plataforma eficiente para gerenciamento de cargas e rotas",
};

export default function MotoristaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col motorista-layout">
      <PushProvider>
        <Navbar />
        <main className="flex-1 relative">{children}</main>
        <Footer />
      </PushProvider>
    </div>
  );
}
