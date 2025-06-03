import BottomNav from "@/components/Nav/BottomNav";
import "./globals.css";
import { Inter } from "next/font/google";
import React from "react";
import SideNav from "@/components/Nav/Sidenav";
import Footer from "@/components/Footer";
import WithAuth from "./WithAuth";
import ClientI18nProvider from "@/components/ClientI18nProvider";

const inter = Inter({ subsets: ["latin"], weight: "400" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.className} text-white antialiased md:flex`}>
      <SideNav />
      <main className="flex-1 ml-0 md:ml-[220px]">
        <WithAuth>
          <ClientI18nProvider>
            {children}
          </ClientI18nProvider>
        </WithAuth>
        <Footer />
      </main>
      <BottomNav />
    </div>
  );
}
