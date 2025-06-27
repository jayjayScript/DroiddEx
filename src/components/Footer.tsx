"use client"

import React from "react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  if(pathname === '/admin/auth') return null
  return (
    <footer className="bg-[#1A1A1A] text-gray-400 text-sm px-6 py-10 mb-[4rem] border-t border-gray-800">
      <div className="max-w-[80%] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-center md:text-left">
          &copy; 2023 Web4. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
