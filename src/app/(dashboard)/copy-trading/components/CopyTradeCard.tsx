import React from 'react';
import { Icon } from '@iconify/react';

export interface TradeDetail {
  isWin: boolean;
  pnl: number;
}

export interface CopyTradeType {
  id: string;
  traderName: string;
  countryCode: string;
  coinSymbol: string;
  coinIcon: string;
  leverage: number;
  price: number;
  last10Trades: TradeDetail[];
  pnl?: number;
  isActive?: boolean;
}

interface CopyTradeCardProps {
  trade: CopyTradeType;
  onAction: (trade: CopyTradeType) => void;
  actionLoading?: boolean;
}

const getCoinColor = (symbol: string) => {
  switch (symbol.toUpperCase()) {
    case 'BTC': return 'bg-[#F7931A]';
    case 'ETH': return 'bg-[#627EEA]';
    case 'SOL': return 'bg-[#14F195]';
    case 'DOGE': return 'bg-[#C2A633]';
    default: return 'bg-[#ebb70c]';
  }
};

const CopyTradeCard = ({ trade, onAction, actionLoading }: CopyTradeCardProps) => {
  // Calculate win rate
  const wins = trade.last10Trades.filter(t => t.isWin).length;
  const total = trade.last10Trades.length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
  
  // Find max absolute pnl for scaling the mini-bars
  // const maxAbsPnl = Math.max(...trade.last10Trades.map(t => Math.abs(t.pnl)), 1);

  return (
    <div className={`border rounded-2xl p-6 bg-[#111111] transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
      trade.isActive 
        ? 'border-[#00ff55]/30 shadow-[0_0_20px_rgba(0,255,85,0.05)]' 
        : 'border-[#222] hover:border-[#333]'
    }`}>
      
      {/* Active Pulse Indicator */}
      {trade.isActive && (
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-2 bg-[#00ff55]/10 px-2.5 py-1 rounded-full border border-[#00ff55]/20">
            <div className="relative flex h-2 w-2">
              <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff55] opacity-75"></div>
              <div className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff55]"></div>
            </div>
            <span className="text-[#00ff55] text-[10px] font-bold uppercase tracking-wider">Live</span>
          </div>
        </div>
      )}

      <div>
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6">
          <div className="relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center overflow-hidden border border-[#222]">
              <Icon icon={`circle-flags:${trade.countryCode.toLowerCase()}`} className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            {/* Verification Indicator */}
            <div className="absolute -top-1.5 -right-1.5 bg-[#ebb70c] rounded-full p-0.5 border-2 border-[#111] shadow-lg">
              <Icon icon="material-symbols:check-small-rounded" className="text-[#111] w-3 h-3 font-bold" />
            </div>
          </div>
          <div>
            <div className="text-white font-bold text-base sm:text-lg flex items-center gap-1.5 sm:gap-2">
              {trade.traderName}
              <Icon icon="mdi:check-decagram" className="text-[#ebb70c] w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
              <span className="text-gray-300 text-[11px] sm:text-xs font-bold">Leverage</span>
              <span className="text-[#ebb70c] text-[11px] sm:text-xs font-bold">{trade.leverage}x</span>
            </div>
          </div>
        </div>

        {/* Coin & Win Rate */}
        <div className="flex justify-between items-center mb-6">
          <div className="border border-[#333] rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getCoinColor(trade.coinSymbol)}`} />
            <span className="text-white text-[11px] sm:text-xs font-bold">{trade.coinSymbol}/USDT</span>
          </div>
          <div className={`${winRate >= 50 ? 'text-[#00ff55]' : 'text-red-500'} text-xs sm:text-[13px] font-bold`}>
            {winRate}% win rate
          </div>
        </div>

        {/* Last 10 Trades - Hidden when active */}
        {!trade.isActive && (
          <div className="mb-8">
            <div className="text-[#555] text-[10px] sm:text-[11px] font-bold tracking-wider mb-3 uppercase tracking-[0.1em]">Last 10 Trades</div>
            <div className="flex flex-wrap gap-1.5 w-full">
              {trade.last10Trades.map((t, index) => (
                <div 
                  key={index} 
                  className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    t.isWin 
                      ? 'bg-[#00ff55]/10 text-[#00ff55] border border-[#00ff55]/20' 
                      : 'bg-[#ff3b3b]/10 text-[#ff3b3b] border border-[#ff3b3b]/20'
                  }`}
                >
                  {t.pnl > 0 ? '+' : ''}{t.pnl.toFixed(1)}%
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0 ${trade.isActive ? 'mt-4' : ''}`}>
        {trade.isActive && trade.pnl !== undefined ? (
          <div>
            <div className="text-[#555] text-[10px] sm:text-[11px] font-bold tracking-wider mb-0.5 sm:mb-1 uppercase">Live Profit</div>
            <div className={`font-bold text-lg sm:text-xl ${trade.pnl >= 0 ? 'text-[#00ff55]' : 'text-[#ff3b3b]'}`}>
              {trade.pnl >= 0 ? '+' : '-'}${Math.abs(trade.pnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-[#555] text-[10px] sm:text-[11px] font-bold tracking-wider mb-0.5 sm:mb-1 uppercase">Copy Price</div>
            <div className="text-white font-bold text-lg sm:text-xl">${trade.price.toLocaleString()}</div>
          </div>
        )}
        
        <button
          onClick={() => onAction(trade)}
          disabled={actionLoading}
          className={`w-full sm:w-auto border transition-colors rounded-xl px-6 py-2 sm:py-2.5 font-bold text-[13px] sm:text-[14px] flex justify-center items-center ${
            trade.isActive 
              ? 'border-[#ff3b3b]/30 text-[#ff3b3b] bg-[#ff3b3b]/10 hover:bg-[#ff3b3b]/20'
              : 'border-[#333] hover:bg-[#222] text-white'
          } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {actionLoading ? (
            <Icon icon="eos-icons:loading" className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
          ) : trade.isActive ? (
            'Liquidate'
          ) : (
            'Copy trade'
          )}
        </button>
      </div>

    </div>
  );
};

export default CopyTradeCard;
