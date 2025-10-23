import  Footer  from "../../components/motorista/layout/footer";
import { Navbar } from "../../components/motorista/layout/navbar";
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
    description: "O Petrocarga trás aos motoristas uma plataforma eficiente para gerenciamento de cargas e rotas",
    };

    export default function MotoristaLayout({
    children,
    }: Readonly<{
    children: React.ReactNode;
    }>) {
    return (
        <html lang="pt-br" className={mavenPro.variable}>
        <body>
            <div className="flex min-h-screen flex-col motorista-layout">
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
