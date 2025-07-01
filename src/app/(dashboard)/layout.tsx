import BottomNav from "@/components/Nav/BottomNav";
import "./globals.css";
import { Roboto, Manrope } from "next/font/google";
import React from "react";
import SideNav from "@/components/Nav/Sidenav";
import Footer from "@/components/Footer";
import WithAuth from "./WithAuth";
import ClientI18nProvider from "@/components/ClientI18nProvider";
import { UserProvider } from "@/store/userContext";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });
const manrope = Manrope({ subsets: ["latin"], weight: ["200", "300", "400"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${roboto.className} ${manrope.className} text-white antialiased md:flex`}>
      <SideNav />
      <main className="flex-1 ml-0 md:ml-[220px]">
        <UserProvider>
          <WithAuth>
            <ClientI18nProvider>
              {children}
            </ClientI18nProvider>
          </WithAuth>
        </UserProvider>
        <Footer />
      </main>
      <BottomNav />
    </div>
  );
}
