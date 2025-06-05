'use client';
import React from 'react';

export default function Modal({
  isOpen,
  onCloseAction,
  children,
}: {
  isOpen: boolean;
  onCloseAction: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#00000082] flex items-center justify-center">
      <div className="bg-[#1A1A1A] text-white font-medium rounded-lg shadow-xl p-4 max-w-md w-[87%] relative">
        <button
          onClick={onCloseAction}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
