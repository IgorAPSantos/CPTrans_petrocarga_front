import Footer from "../../components/motorista/layout/footer";
import { MapProvider } from "@/context/MapContext";
import { Maven_Pro } from "next/font/google";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const mavenPro = Maven_Pro({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-maven-pro",
});

export default function MotoristaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`flex min-h-screen flex-col motorista-layout ${mavenPro.variable}`}
    >
      <main className="flex-1 relative">
        <MapProvider>{children}</MapProvider>
      </main>
      <Footer />
    </div>
  );
}
