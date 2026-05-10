"use client"
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import CopyTradeCard, { CopyTradeType } from './components/CopyTradeCard';
import FundWalletModal from './components/FundWalletModal';
import ConfirmPaymentModal from './components/ConfirmPaymentModal';
import WithdrawWalletModal from './components/WithdrawWalletModal';
import { getAllTrades, getUserTradingDetails, depositCopyWallet, withdrawCopyWallet, executeCopyTrade, liquidateTrade } from '@/lib/copyTrades';
import api from '@/lib/axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const CopyTradingPage = () => {
  // Isolated Wallet States
  const [copyWalletBalance, setCopyWalletBalance] = useState<number>(0);
  const [mainWalletBalance, setMainWalletBalance] = useState<number>(0);
  
  // Trade States
  const [availableTrades, setAvailableTrades] = useState<CopyTradeType[]>([]);
  const [copiedTrades, setCopiedTrades] = useState<CopyTradeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<CopyTradeType | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<CopyTradeType | null>(null);

  const loadData = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const [allTrades, userDetails, profileRes] = await Promise.all([
        getAllTrades(),
        getUserTradingDetails(),
        api.get('/profile', headers).catch(() => null)
      ]);
      setAvailableTrades(allTrades);
      if (userDetails) {
        setCopyWalletBalance(userDetails.balance);
        setCopiedTrades(userDetails.activeTrades);
      }
      if (profileRes?.data?.wallet?.USDT) {
        const usdtBalance = profileRes.data.wallet.USDT.reduce(
          (acc: number, curr: { balance: number }) => acc + curr.balance, 0
        );
        setMainWalletBalance(usdtBalance);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);



  const handleDeposit = async (amount: number) => {
    const toastId = toast.loading('Depositing to Copy Wallet...');
    try {
      await depositCopyWallet(amount);
      toast.success('Deposit successful!', { id: toastId });
      
      const newTotalBalance = copyWalletBalance + amount;
      setMainWalletBalance(prev => prev - amount);
      setCopyWalletBalance(newTotalBalance);

      if (pendingTrade && newTotalBalance >= pendingTrade.price) {
        await handleConfirmPaymentDirect(pendingTrade);
      }
      setIsFundModalOpen(false);
    } catch (error) {
      const e = error as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Deposit failed', { id: toastId });
    }
  };

  const handleWithdraw = async (amount: number) => {
    const toastId = toast.loading('Withdrawing from Copy Wallet...');
    try {
      await withdrawCopyWallet(amount);
      toast.success('Withdrawal successful!', { id: toastId });
      setCopyWalletBalance(prev => prev - amount);
      setMainWalletBalance(prev => prev + amount);
      setIsWithdrawModalOpen(false);
    } catch (error) {
      const e = error as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Withdrawal failed', { id: toastId });
    }
  };

  const handleCopyTrade = (trade: CopyTradeType) => {
    setSelectedTrade(trade);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmPaymentDirect = async (tradeToCopy: CopyTradeType) => {
    const toastId = toast.loading(`Copying ${tradeToCopy.traderName}...`);
    try {
      await executeCopyTrade(tradeToCopy.id);
      toast.success(`Successfully copied ${tradeToCopy.traderName}!`, { id: toastId });
      setPendingTrade(null);
      await loadData(); // refresh everything
    } catch (error) {
      const e = error as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Failed to copy trade', { id: toastId });
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedTrade) return;

    if (copyWalletBalance < selectedTrade.price) {
      setPendingTrade(selectedTrade);
      setIsConfirmModalOpen(false);
      setIsFundModalOpen(true);
      return;
    }

    setIsConfirmModalOpen(false);
    await handleConfirmPaymentDirect(selectedTrade);
    setSelectedTrade(null);
  };

  const handleLiquidate = async (trade: CopyTradeType) => {
    const toastId = toast.loading(`Liquidating ${trade.traderName}...`);
    try {
      await liquidateTrade(trade.id);
      toast.success('Trade liquidated successfully!', { id: toastId });
      await loadData();
    } catch (error) {
      const e = error as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Failed to liquidate', { id: toastId });
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
        <Icon icon="eos-icons:three-dots-loading" className="w-16 h-16 text-[#ebb70c]" />
        <p className="text-[#666] text-sm mt-4 tracking-widest uppercase font-bold">Loading Traders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 pb-20 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <p className="font-bold text-[#ebb70c] tracking-widest text-[15px]">WEB 4.0</p>
          <Icon icon="ph:user" className="text-gray-400 w-6 h-6" />
        </header>
        
        {/* Copy Wallet Card */}
        <div className="border border-[#222] rounded-2xl p-5 sm:p-6 bg-[#111] mb-8 sm:mb-10 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <span className="text-[#666] text-[12px] font-bold tracking-widest uppercase">
              Copy Trading Wallet
            </span>
            
          </div>
          
          <div className="text-3xl sm:text-[32px] font-bold text-[#888] mb-8">
            ${copyWalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 border-t border-[#222] pt-6">
            <button 
              onClick={() => setIsFundModalOpen(true)}
              className="bg-[#ebb70cc6] hover:bg-[#d4a40b] text-[#111] font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-[13px] shadow-[0_4px_15px_rgba(235,183,12,0.15)] active:scale-95"
            >
              <Icon icon="ph:lightning-fill" className="w-4 h-4" />
              Deposit
            </button>
            <button 
              onClick={() => setIsWithdrawModalOpen(true)}
              className="bg-[#1a1a1a] border border-[#333] hover:border-[#444] text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-[13px] active:scale-95"
            >
              <Icon icon="ph:bank-fill" className="w-4 h-4 text-[#ebb70c]" />
              Withdrawal
            </button>
          </div>
        </div>
        {copiedTrades.length > 0 && (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00ff55]" />
                <h2 className="text-[#777] text-[13px] font-bold tracking-widest uppercase">Active Trades</h2>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#222] flex items-center justify-center text-xs font-bold text-gray-400">
                {copiedTrades.length}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {copiedTrades.map(trade => (
                <CopyTradeCard 
                  key={trade.id} 
                  trade={trade} 
                  onAction={handleLiquidate} 
                />
              ))}
            </div>
          </div>
        )}
        

        {/* Section 2: Top Traders */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#ebb70c]" />
              <h2 className="text-[#777] text-[13px] font-bold tracking-widest uppercase">Top Traders</h2>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#222] flex items-center justify-center text-xs font-bold text-gray-400">
              {availableTrades.length}
            </div>
          </div>
          
          {availableTrades.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableTrades.map(trade => (
                <CopyTradeCard 
                  key={trade.id} 
                  trade={trade} 
                  onAction={handleCopyTrade}
                />
              ))}
            </div>
          ) : (
            <div className="border border-[#222] bg-[#111] rounded-2xl p-10 text-center text-[#555]">
              No more traders available.
            </div>
          )}
        </div>

        {/* Modals */}
        <ConfirmPaymentModal 
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmPayment}
          trade={selectedTrade}
          walletBalance={copyWalletBalance}
        />

        <FundWalletModal 
          isOpen={isFundModalOpen}
          onClose={() => setIsFundModalOpen(false)}
          onDeposit={handleDeposit}
          mainWalletBalance={mainWalletBalance}
        />

        <WithdrawWalletModal 
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          onWithdraw={handleWithdraw}
          copyWalletBalance={copyWalletBalance}
        />

      </div>
      </div>
  );
};

export default CopyTradingPage;
