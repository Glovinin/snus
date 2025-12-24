import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { ChatBot } from "@/components/support/ChatBot";
import { AgeVerification } from "@/components/ui/AgeVerification";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { DevelopmentGate } from "@/components/ui/DevelopmentGate";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SnusIdea | Premium Snus Experience",
  description: "Ultra-modern e-commerce platform for premium snus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-background text-foreground`} suppressHydrationWarning>
        <AuthProvider>
          <DevelopmentGate>
            <SiteHeader />
            {children}
            <Toaster position="top-right" />
            <ChatBot />
            <AgeVerification />
          </DevelopmentGate>
        </AuthProvider>
      </body>
    </html>
  );
}
