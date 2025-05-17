import React from "react";
import { navLinks } from "../constants";
import { Icon } from "@iconify/react";
import Link from "next/link";

const BottomNav = () => {
  return (
    <div>
      <nav className="fixed bottom-0 md:hidden left-0 right-0 bg-[#1A1A1A] p-2 py-6  flex justify-around text-xs text-white border-t border-gray-800">
        {navLinks.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <Link href={item.url} className="flex flex-col items-center hover:text-[#ebb70c] transition duration-300 ease-in-out">
              <Icon icon={item.icon} width="24" height="24" />
              <p>{item.name}</p>
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
