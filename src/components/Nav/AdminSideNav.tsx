"use client";

import React from "react";
import Link from "next/link";
import { adminNavLinks } from "../constants";
import { Icon } from "@iconify/react";

const AdminSideNav = () => {
  const handleLogout = () => {
    // Add your logout logic here
    console.log("User logged out");
  };

  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-screen w-[240px] bg-[#12121283] text-white border-r border-gray-800 px-6 py-8 flex-col justify-between shadow-lg z-50">
      {/* Top Section */}
      <div>
        <div className="mb-10">
          <h1 className="text-xl font-bold text-white">YourApp</h1>
          <p className="text-sm text-gray-500">Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-4">
          {adminNavLinks.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-[#1f1f1f] transition-all duration-200"
            >
              <Icon icon={item.icon} width="20" height="20" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-white hover:bg-red-500/10 rounded-md transition-all duration-200"
        >
          <Icon icon="mdi:logout" width="20" height="20" />
          <span>Logout</span>
        </button>

        <div className="text-xs text-gray-500">
          <p>© {new Date().getFullYear()} YourApp</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSideNav;
