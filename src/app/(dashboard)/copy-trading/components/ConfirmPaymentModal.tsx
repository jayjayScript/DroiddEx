import React from 'react';
import { Icon } from '@iconify/react';
import { CopyTradeType } from './CopyTradeCard';

interface ConfirmPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  trade: CopyTradeType | null;
  walletBalance: number;
}

const ConfirmPaymentModal = ({ isOpen, onClose, onConfirm, trade, walletBalance }: ConfirmPaymentModalProps) => {
  if (!isOpen || !trade) return null;

  const profitCommission = Number(trade.trade_percentage ?? trade.price ?? 0);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-sm bg-[#111] border border-[#222] rounded-2xl p-6 z-[9999] shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Confirm Trade</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <Icon icon="ph:x-bold" className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#222]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Trader</span>
              <span className="text-white font-bold">{trade.traderName}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Symbol</span>
              <span className="text-white font-bold">{trade.coinSymbol}/USDT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Profit Commission</span>
              <span className="text-[#ebb70c] font-bold">{profitCommission.toLocaleString()}%</span>
            </div>
          </div>

          <div className="flex justify-between items-center px-1">
            <span className="text-gray-400 text-sm font-medium">Copy Wallet Balance</span>
            <span className="text-white font-bold">
              ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="bg-[#ebb70c]/10 border border-[#ebb70c]/20 rounded-lg p-3 flex items-start gap-3">
            <Icon icon="ph:info-fill" className="text-[#ebb70c] w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-[#ebb70c] text-xs leading-relaxed">
              No funds are deducted when you copy a trade. The <strong>{profitCommission}% profit commission</strong> is only applied to your earnings when the trade is settled.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-[#1a1a1a] hover:bg-[#222] text-white font-bold py-3 rounded-xl border border-[#333] transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-[#ebb70c] hover:bg-[#d4a40b] text-black font-bold py-3 rounded-xl transition-all text-sm shadow-[0_4px_15px_rgba(235,183,12,0.15)]"
            >
              Copy Trade
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmPaymentModal;
