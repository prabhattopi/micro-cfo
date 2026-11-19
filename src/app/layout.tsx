import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "MicroCFO — AI Copilot & Risk Simulator for Student Side-Hustles",
  description:
    "Turn university side-gigs into sustainable micro-businesses with real unit economics, hidden cost detection, break-even simulation, and Gemini AI stress-testing.",
  applicationName: "MicroCFO",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MicroCFO",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white font-sans">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
