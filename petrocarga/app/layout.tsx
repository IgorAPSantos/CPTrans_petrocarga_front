import { Maven_Pro } from 'next/font/google';
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./globals.css";

const mavenPro = Maven_Pro({
    weight: "variable",
    subsets: ["latin"],
    variable: "--font-maven-pro"
});

export const metadata = {
    title: "PetroCarga",
    description: "O Petrocarga trás aos motoristas uma plataforma eficiente para gerenciamento de cargas e rotas",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-br" className={mavenPro.variable}>
            <body>
                {children}
            </body>
        </html>
    );
}