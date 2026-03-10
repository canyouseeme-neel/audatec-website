import "@livekit/components-styles/components/participant";
import "@/styles/globals.css";

import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";

import { LenisProvider } from "@/components/providers/lenis-provider";
import { AppShell } from "@/components/site/app-shell";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Audatec | AI Relationship Intelligence",
    template: "%s | Audatec",
  },
  description:
    "Audatec helps teams run AI relationship workflows across lead generation, sales, support, and collections with audit-ready visibility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} min-h-screen bg-[var(--page-base)] text-[var(--text-primary)] antialiased`}
      >
        <LenisProvider>
          <AppShell>{children}</AppShell>
        </LenisProvider>
      </body>
    </html>
  );
}
