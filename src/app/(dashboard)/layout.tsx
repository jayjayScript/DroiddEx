import BottomNav from "@/components/Nav/BottomNav";
import "./globals.css";
import { Roboto, Manrope } from "next/font/google";
import React from "react";
import SideNav from "@/components/Nav/Sidenav";
import Footer from "@/components/Footer";
import WithAuth from "./WithAuth";
import ClientI18nProvider from "@/components/ClientI18nProvider";
import { UserProvider } from "@/store/userContext";
import Script from 'next/script'

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
              <div className="">
                <Script
                  id="smartsupp-chat"
                  strategy="afterInteractive"
                  className=""
                  dangerouslySetInnerHTML={{
                    __html: `
              var _smartsupp = _smartsupp || {};
              _smartsupp.key = '56113d834ee77079ce13cf26d4ec4a4e5eac89da';
              _smartsupp.offsetX = 20; // Distance from right edge
              _smartsupp.offsetY = 80; // Distance from bottom edge
              _smartsupp.alignX = 'right'; // 'left' or 'right'
              _smartsupp.alignY = 'bottom'; // 'top' or 'bottom'
              window.smartsupp||(function(d) {
                var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
                s=d.getElementsByTagName('script')[0];c=d.createElement('script');
                c.type='text/javascript';c.charset='utf-8';c.async=true;
                c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
              })(document);
            `
                  }}
                />

                <noscript>
                  Powered by <a href="https://www.smartsupp.com" target="_blank">Smartsupp</a>
                </noscript>
              </div>
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
