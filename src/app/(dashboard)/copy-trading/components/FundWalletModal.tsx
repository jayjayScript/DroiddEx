"use client"
import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number, source: 'external' | 'main_wallet') => void;
  mainWalletBalance: number;
}

const FundWalletModal = ({ isOpen, onClose, onDeposit, mainWalletBalance }: FundWalletModalProps) => {
  const [amount, setAmount] = useState('');
  
  if (!isOpen) return null;

  const handleDeposit = () => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      onDeposit(numAmount, 'main_wallet');
      setAmount('');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-[#111111] border border-[#3A3A3A] rounded-2xl p-6 z-[9999] shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[16px] font-bold text-white flex items-center gap-2">
            <Icon icon="ph:arrows-left-right-fill" className="text-[#ebb70c]" /> Fund Copy Wallet
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <Icon icon="ph:x-bold" className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#222]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">From</span>
              <span className="text-white font-bold text-sm">WEB4 Wallet</span>
            </div>
            <p className="text-[#ebb70c] text-right font-bold text-xs">
              Available: ${mainWalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Amount to Transfer</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400 font-bold text-[15px]">$</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 bg-[#000] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ebb70c] transition-colors text-[15px] font-bold"
              />
            </div>
          </div>

          <button
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > mainWalletBalance}
            className="w-full bg-[#ebb70c] hover:bg-[#d4a50b] disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-all duration-200 mt-2 text-[14px] shadow-[0_4px_15px_rgba(235,183,12,0.15)] active:scale-95"
          >
            Transfer Funds
          </button>
        </div>
      </div>
    </>
  );
};

export default FundWalletModal;
