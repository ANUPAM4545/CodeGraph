import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "../lib/auth/context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "CodeGraph | Developer Intelligence",
    template: "%s | CodeGraph"
  },
  description: "CodeGraph transforms repositories into intelligent architectural maps using knowledge graphs, AI reasoning, and immersive visualization.",
  openGraph: {
    title: "CodeGraph",
    description: "Understand any codebase instantly.",
    url: "https://codegraph.example.com",
    siteName: "CodeGraph",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeGraph",
    description: "Understand any codebase instantly.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
