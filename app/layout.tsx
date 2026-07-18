import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "CitiEye Community Governance — Citizen Lifecycle Management Platform",
  description:
    "CitiEye Community Governance connects Nigerian citizens with welfare programmes, field officers, and government services — helping build a better Nigeria, one profile at a time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans text-stone-900 selection:bg-amber-400 selection:text-stone-900 flex flex-col relative">
        {children}
        <Toaster position="top-right" />
        <SpeedInsights />
      </body>
    </html>
  );
}
