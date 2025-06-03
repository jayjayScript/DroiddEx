"use client"

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  if(pathname === '/admin/auth') return null
  return (
    <footer className="bg-[#1A1A1A] text-gray-400 text-sm px-6 py-10 mb-[4rem] border-t border-gray-800">
      <div className="max-w-[80%] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-center md:text-left">
          &copy; {new Date().getFullYear()} YourApp. All rights reserved.
        </p>

        <div className="flex space-x-6">
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/support" className="hover:text-white transition">Support</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
