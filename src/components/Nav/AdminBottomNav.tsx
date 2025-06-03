'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNavLinks } from '../constants';

const AdminBottomNav = () => {
  const pathname = usePathname();

  if (pathname === '/admin/auth') return null;

  return (
    
    <nav className="fixed bottom-0 md:hidden left-0 right-0 bg-[#1A1A1A] p-2 py-6 flex justify-around text-xs text-white border-t border-gray-800 z-50">
      {adminNavLinks.map((item, index) => {
        const isActive = pathname === item.url;
        return (
          <Link
            key={index}
            href={item.url}
            className={`flex flex-col items-center ${
              isActive ? 'text-[#ebb70c]' : 'hover:text-[#ebb70c]'
            } transition duration-300 ease-in-out`}
          >
            <Icon icon={item.icon} width="24" height="24" />
            <p>{item.name}</p>
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminBottomNav;
