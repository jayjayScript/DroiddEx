"use client"
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import api from '@/lib/axios';
import { useUserContext } from '@/store/userContext';

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number, source: 'external' | 'main_wallet') => void;
  mainWalletBalance: number;
  onBalanceRefresh?: (newBalance: number) => void;
}

const FundWalletModal = ({ isOpen, onClose, onDeposit, mainWalletBalance, onBalanceRefresh }: FundWalletModalProps) => {
  const [amount, setAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState(mainWalletBalance);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserContext();

  // Refresh balance when modal opens
  useEffect(() => {
    if (isOpen) {
      refreshBalance();
    }
  }, [isOpen]);

  const extractUSDTBalance = (wallet: any): number => {
    if (!wallet) return 0;
    
    try {
      const usdtData = wallet.USDT;
      
      if (!usdtData) {
        console.warn('No USDT data found in wallet');
        return 0;
      }

      // If USDT is an array of wallet entries
      if (Array.isArray(usdtData)) {
        const balance = usdtData.reduce((acc: number, entry: any) => {
          const entryBalance = entry?.balance || 0;
          return acc + (typeof entryBalance === 'number' ? entryBalance : parseFloat(entryBalance) || 0);
        }, 0);
        return balance;
      }

      // If USDT is a single object with balance property
      if (typeof usdtData === 'object' && 'balance' in usdtData) {
        const balance = usdtData.balance;
        return typeof balance === 'number' ? balance : parseFloat(balance) || 0;
      }

      // If USDT is just a number
      if (typeof usdtData === 'number') {
        return usdtData;
      }

      console.warn('Unexpected USDT data structure:', usdtData);
      return 0;
    } catch (err) {
      console.error('Error extracting USDT balance:', err);
      return 0;
    }
  };

  const refreshBalance = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      console.log('🔄 Refreshing wallet balance...');
      
      // First, try to get balance from user context (fastest)
      if (user?.wallet) {
        console.log('📱 Attempting to extract balance from user context');
        const contextBalance = extractUSDTBalance(user.wallet);
        if (contextBalance > 0) {
          console.log('✅ Found balance in user context:', contextBalance);
          setCurrentBalance(contextBalance);
          onBalanceRefresh?.(contextBalance);
          setError(null);
          setIsRefreshing(false);
          return;
        }
      }

      // If context balance is 0 or missing, fetch from API
      console.log('🌐 Fetching profile from API...');
      const profileRes = await api.get('/profile');
      
      console.log('API Response received:', profileRes.data);
      
      if (profileRes?.data) {
        const wallet = profileRes.data.wallet;
        
        if (!wallet) {
          console.warn('❌ No wallet data in profile response');
          setError('Wallet data not found');
          setCurrentBalance(0);
          setIsRefreshing(false);
          return;
        }

        console.log('💰 Full wallet structure:', wallet);

        // Extract USDT balance with proper error handling
        const usdtBalance = extractUSDTBalance(wallet);
        
        console.log('💵 Extracted USDT balance:', usdtBalance);
        
        if (usdtBalance > 0) {
          setCurrentBalance(usdtBalance);
          onBalanceRefresh?.(usdtBalance);
          setError(null);
          console.log('✅ Balance updated successfully');
        } else {
          setCurrentBalance(0);
          setError('No USDT balance available - wallet appears empty');
          console.warn('⚠️ USDT balance is 0 or invalid');
        }
      } else {
        console.warn('❌ No data in profile response');
        setError('Unable to fetch balance data from server');
        setCurrentBalance(0);
      }
    } catch (error: any) {
      console.error('❌ Failed to refresh balance:', error);
      console.error('Error details:', error?.response?.data || error?.message);
      setError(`Failed to load balance: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
      setCurrentBalance(0);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isOpen) return null;

  const handleDeposit = () => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      if (numAmount > currentBalance) {
        setError('Amount exceeds available balance');
        return;
      }
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
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1">
                <p className={`font-bold text-xs ${currentBalance > 0 ? 'text-[#ebb70c]' : 'text-red-400'}`}>
                  Available: ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {error && (
                  <p className="text-red-400 text-xs mt-1">⚠️ {error}</p>
                )}
              </div>
              <button
                onClick={refreshBalance}
                disabled={isRefreshing}
                className="text-[#ebb70c] hover:text-[#d4a40b] text-xs disabled:opacity-50 transition-colors flex-shrink-0"
                title="Refresh balance"
              >
                <Icon icon="ph:arrows-clockwise" className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
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
                className="w-full pl-8 pr-4 py-3 bg-[#000] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ebb70c] transition-colors text-[15px]"
              />
            </div>
          </div>

          <button
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance || currentBalance === 0 || isRefreshing}
            className="w-full bg-[#ebb70c] hover:bg-[#d4a50b] disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-all duration-200 mt-2 text-[14px]"
          >
            {isRefreshing ? 'Loading...' : 'Transfer Funds'}
          </button>

          {currentBalance === 0 && !error && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-yellow-500 text-xs text-center">
                💡 Your main wallet balance is currently $0. Add funds to continue.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FundWalletModal;
