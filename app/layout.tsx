import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "CitiEye — Citizen Lifecycle Management Platform",
  description:
    "CitiEye connects Nigerian citizens with welfare programmes, field officers, and government services — helping build a better Nigeria, one profile at a time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans text-stone-900 selection:bg-amber-400 selection:text-stone-900 flex flex-col relative">
        <Navbar />
        <main className="flex-1 w-full overflow-clip">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
