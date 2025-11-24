import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CursorFollower } from "@/components/ui/CursorFollower";

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
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        <CursorFollower />
        {children}
      </body>
    </html>
  );
}
