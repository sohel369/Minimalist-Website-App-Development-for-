import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TawkToChat } from "@/components/TawkToChat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ServiceApp - Premium Home Services",
  description: "Manage your home service requests with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased font-sans bg-gray-50 text-slate-900`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <TawkToChat />
      </body>
    </html>
  );
}
