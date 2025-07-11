import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { UserProvider } from "@/store/user";
import I18nProvider from "@/components/ClientI18nProvider";
import Waker from "@/components/Waker";
import { LoaderProvider } from "@/store/LoaderContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web4Droid",
  description: "Unlock the power of AI in cryptocurrency trading. Web4Droid combines artificial intelligence with multi-coin trading capabilities to deliver consistent results, reduce emotional trading decisions, and maximize profit opportunities in the volatile crypto market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <I18nProvider>
            <Waker>
              <LoaderProvider>{children}</LoaderProvider>
            </Waker>
          </I18nProvider>
          <Toaster position="top-center" />
        </UserProvider>
      </body>
    </html>
  );
}
