"use client"
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import CopyTradeCard, { CopyTradeType } from './components/CopyTradeCard';
import FundWalletModal from './components/FundWalletModal';
import ConfirmPaymentModal from './components/ConfirmPaymentModal';
import WithdrawWalletModal from './components/WithdrawWalletModal';
// import { useUserContext } from '@/store/userContext';

// Helper to generate mock trade history
// const generateMockHistory = (winProb: number, pnlRange: number): TradeDetail[] => {
//   return Array.from({ length: 10 }).map(() => {
//     const isWin = Math.random() < winProb;
//     const magnitude = (Math.random() * pnlRange) + 0.5; 
//     const pnl = isWin ? magnitude : -magnitude;
//     return { isWin, pnl };
//   });
// };

const INITIAL_AVAILABLE_TRADES: CopyTradeType[] = [
  {
    id: 't1',
    traderName: 'CryptoWhale_99',
    countryCode: 'us',
    coinSymbol: 'BTC',
    coinIcon: 'cryptocurrency-color:btc',
    leverage: 50,
    price: 500,
    last10Trades: [
      { isWin: true, pnl: 12.5 }, { isWin: true, pnl: 8.2 }, { isWin: true, pnl: 15.0 },
      { isWin: false, pnl: -5.4 }, { isWin: true, pnl: 6.7 }, { isWin: true, pnl: 14.1 },
      { isWin: false, pnl: -3.2 }, { isWin: true, pnl: 9.8 }, { isWin: true, pnl: 11.0 }, { isWin: true, pnl: 7.5 }
    ]
  },
  {
    id: 't2',
    traderName: 'Alpha_Trader',
    countryCode: 'gb',
    coinSymbol: 'ETH',
    coinIcon: 'cryptocurrency-color:eth',
    leverage: 25,
    price: 300,
    last10Trades: [
      { isWin: true, pnl: 8.5 }, { isWin: false, pnl: -12.2 }, { isWin: true, pnl: 19.0 },
      { isWin: true, pnl: 5.4 }, { isWin: false, pnl: -8.7 }, { isWin: true, pnl: 11.1 },
      { isWin: true, pnl: 4.2 }, { isWin: true, pnl: 9.8 }, { isWin: false, pnl: -11.0 }, { isWin: true, pnl: 17.5 }
    ]
  },
  {
    id: 't3',
    traderName: 'SolanaKing',
    countryCode: 'ng',
    coinSymbol: 'SOL',
    coinIcon: 'cryptocurrency-color:sol',
    leverage: 10,
    price: 150,
    last10Trades: [
      { isWin: false, pnl: -6.5 }, { isWin: true, pnl: 8.2 }, { isWin: true, pnl: 5.0 },
      { isWin: true, pnl: 9.4 }, { isWin: true, pnl: 6.7 }, { isWin: false, pnl: -4.1 },
      { isWin: true, pnl: 3.2 }, { isWin: true, pnl: 9.8 }, { isWin: true, pnl: 1.0 }, { isWin: false, pnl: -7.5 }
    ]
  },
  {
    id: 't4',
    traderName: 'DogeMaster',
    countryCode: 'kr',
    coinSymbol: 'DOGE',
    coinIcon: 'cryptocurrency-color:doge',
    leverage: 5,
    price: 50,
    last10Trades: [
      { isWin: true, pnl: 22.5 }, { isWin: false, pnl: -18.2 }, { isWin: false, pnl: -15.0 },
      { isWin: true, pnl: 25.4 }, { isWin: false, pnl: -26.7 }, { isWin: true, pnl: 14.1 },
      { isWin: true, pnl: 13.2 }, { isWin: false, pnl: -19.8 }, { isWin: true, pnl: 11.0 }, { isWin: true, pnl: 27.5 }
    ]
  }
];

const CopyTradingPage = () => {
  // const { user } = useUserContext();
  
  // Isolated Wallet States
  const [copyWalletBalance, setCopyWalletBalance] = useState<number>(0);
  const [mainWalletBalance, setMainWalletBalance] = useState<number>(15000); // Mock WEB4 Balance
  
  // Trade States
  const [availableTrades, setAvailableTrades] = useState<CopyTradeType[]>(INITIAL_AVAILABLE_TRADES);
  const [copiedTrades, setCopiedTrades] = useState<CopyTradeType[]>([]);

  // Sync deployed traders from Admin (localStorage)
  useEffect(() => {
    const savedTraders = localStorage.getItem('admin_copy_traders');
    if (savedTraders) {
      try {
        setAvailableTrades(JSON.parse(savedTraders));
      } catch (e) {
        console.error('Failed to parse deployed traders', e);
      }
    }
  }, []);
  
  // Modal State
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [pendingTrade, setPendingTrade] = useState<CopyTradeType | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<CopyTradeType | null>(null);

  // Live Update Simulation - Removed as requested, admin will handle updates manually
  // In a real app, this would be handled via a WebSocket or periodic API polling


  const handleDeposit = (amount: number) => {
    const newTotalBalance = copyWalletBalance + amount;
    
    // Deduct from Main Wallet
    setMainWalletBalance(prev => prev - amount);

    if (pendingTrade && newTotalBalance >= pendingTrade.price) {
      // Execute copy
      const activeTrade = {
        ...pendingTrade,
        id: `${pendingTrade.id}-active-${Math.random().toString(36).substr(2, 9)}`,
        isActive: true,
        pnl: 0,
      };
      setCopiedTrades(prev => [activeTrade, ...prev]);
      setCopyWalletBalance(newTotalBalance - pendingTrade.price);
      setPendingTrade(null);
    } else {
      setCopyWalletBalance(newTotalBalance);
    }
    
    setIsFundModalOpen(false);
  };

  const handleWithdraw = (amount: number) => {
    setCopyWalletBalance(prev => prev - amount);
    setMainWalletBalance(prev => prev + amount);
    setIsWithdrawModalOpen(false);
  };

  const handleCopyTrade = (trade: CopyTradeType) => {
    setSelectedTrade(trade);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedTrade) return;

    if (copyWalletBalance < selectedTrade.price) {
      setPendingTrade(selectedTrade);
      setIsConfirmModalOpen(false);
      setIsFundModalOpen(true);
      return;
    }

    setCopyWalletBalance(prev => prev - selectedTrade.price);

    const activeTrade = {
      ...selectedTrade,
      id: `${selectedTrade.id}-active-${Math.random().toString(36).substr(2, 9)}`,
      isActive: true,
      pnl: 0,
    };

    setCopiedTrades(prev => [activeTrade, ...prev]);
    setIsConfirmModalOpen(false);
    setSelectedTrade(null);
  };

  const handleLiquidate = (trade: CopyTradeType) => {
    const finalAmount = trade.price + (trade.pnl || 0);
    setCopyWalletBalance(prev => prev + finalAmount);

    setCopiedTrades(prev => prev.filter(t => t.id !== trade.id));
    // Traders now stay in availableTrades, so no need to add back
  };


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
