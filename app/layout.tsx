import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anji Codes - 30 Projects in 30 Days",
  description: "Follow my journey of building 30 projects in 30 days",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preload" as="image" href="/anji-code.jpeg" />
      </head>
      <body
        className={`${spaceGrotesk.variable} bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          {children}
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
