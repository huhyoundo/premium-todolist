import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google"; // Corrected import
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-space-mono"
});

export const metadata: Metadata = {
  title: "Time-Travel Todo",
  description: "A minimalist, interactive todo list.",
};

import { AuthProvider } from "@/components/Auth/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
