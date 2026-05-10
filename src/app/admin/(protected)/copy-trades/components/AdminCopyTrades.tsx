"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { CopyTradeType, TradeDetail } from '@/app/(dashboard)/copy-trading/components/CopyTradeCard';
import { adminGetAllTrades, adminCreateTrade, adminUpdateTrade, adminDeleteTrade } from '@/lib/adminTrades';

interface FormData {
  traderName: string;
  countryCode: string;
  coinSymbol: string;
  leverage: number;
  price: number;
  last10Trades: TradeDetail[];
}

const defaultForm = (): FormData => ({
  traderName: '',
  countryCode: 'us',
  coinSymbol: 'BTC',
  leverage: 50,
  price: 500,
  last10Trades: Array.from({ length: 10 }).map(() => ({ isWin: true, pnl: 10 })),
});

const AdminCopyTrades = () => {
  const [traders, setTraders] = useState<CopyTradeType[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrader, setEditingTrader] = useState<CopyTradeType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(defaultForm());

  const loadTraders = useCallback(async () => {
    setIsLoading(true);
    const data = await adminGetAllTrades();
    setTraders(data);
    setIsLoading(false);
  }, []);

  useEffect(() => { loadTraders(); }, [loadTraders]);

  const handleOpenCreate = () => {
    setEditingTrader(null);
    setFormData(defaultForm());
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trader: CopyTradeType) => {
    setEditingTrader(trader);
    setFormData({
      traderName: trader.traderName,
      countryCode: trader.countryCode,
      coinSymbol: trader.coinSymbol,
      leverage: trader.leverage,
      price: trader.price,
      last10Trades: [...trader.last10Trades],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this trader?')) return;
    const toastId = toast.loading('Deleting trader...');
    try {
      await adminDeleteTrade(id);
      toast.success('Trader deleted', { id: toastId });
      await loadTraders();
    } catch {
      toast.error('Failed to delete trader', { id: toastId });
    }
  };

  const updateTradeHistory = <K extends keyof TradeDetail>(index: number, field: K, value: TradeDetail[K]) => {
    const newHistory = [...formData.last10Trades];
    newHistory[index] = { ...newHistory[index], [field]: value };
    if (field === 'isWin') {
      const abs = Math.abs(newHistory[index].pnl);
      newHistory[index].pnl = value ? abs : -abs;
    }
    setFormData({ ...formData, last10Trades: newHistory });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(editingTrader ? 'Updating trader...' : 'Creating trader...');

    // Convert TradeDetail[] → number[] for backend
    const last_10_trades = formData.last10Trades.map(t => t.isWin ? Math.abs(t.pnl) : -Math.abs(t.pnl));
    const wins = formData.last10Trades.filter(t => t.isWin).length;
    const winrate = Math.round((wins / 10) * 100);

    const payload = {
      trader_name: formData.traderName,
      country: formData.countryCode,
      symbol: formData.coinSymbol.toUpperCase(),
      leverage: formData.leverage,
      trade_price: formData.price,
      winrate,
      last_10_trades,
    };

    try {
      if (editingTrader) {
        await adminUpdateTrade(editingTrader.id, payload);
        toast.success('Trader updated!', { id: toastId });
      } else {
        await adminCreateTrade(payload);
        toast.success('Trader created!', { id: toastId });
      }
      setIsModalOpen(false);
      await loadTraders();
    } catch {
      toast.error('Action failed. Check your connection.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTraders = traders.filter(t =>
    t.traderName.toLowerCase().includes(search.toLowerCase()) ||
    t.coinSymbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Icon icon="ph:copy-bold" className="text-[#ebb70c]" />
              Copy Trade Management
            </h1>
            <p className="text-gray-400 text-sm mt-1">Full control over trader cards and performance data</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 bg-[#ebb70c] hover:bg-[#d4a40b] text-black font-bold py-2.5 px-6 rounded-xl transition-all active:scale-95 shadow-[0_4px_15px_rgba(235,183,12,0.2)]"
          >
            <Plus size={20} /> Create New Trader
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#111] border border-[#222] p-5 rounded-2xl">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Traders</p>
            <p className="text-2xl font-bold text-white">{traders.length}</p>
          </div>
          <div className="bg-[#111] border border-[#222] p-5 rounded-2xl">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Avg. Leverage</p>
            <p className="text-2xl font-bold text-[#ebb70c]">
              {traders.length > 0 ? Math.round(traders.reduce((a, b) => a + b.leverage, 0) / traders.length) : 0}x
            </p>
          </div>
          <div className="bg-[#111] border border-[#222] p-5 rounded-2xl">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Avg. Price</p>
            <p className="text-2xl font-bold text-[#00ff55]">
              ${traders.length > 0 ? Math.round(traders.reduce((a, b) => a + b.price, 0) / traders.length) : 0}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search by trader name or coin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-[#222] rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#ebb70c] transition-colors"
          />
        </div>

        {/* Table */}
        <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222] bg-[#1a1a1a]">
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trader</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Coin</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Leverage</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Copy Price</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Win Rate</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="p-12 text-center text-gray-500">Loading traders from database...</td></tr>
                ) : filteredTraders.length > 0 ? (
                  filteredTraders.map((trader) => {
                    const wins = trader.last10Trades.filter(t => t.isWin).length;
                    const winRate = trader.last10Trades.length > 0 ? Math.round((wins / trader.last10Trades.length) * 100) : 0;
                    return (
                      <tr key={trader.id} className="border-b border-[#222] hover:bg-[#151515] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-[#222]">
                              <Icon icon={`circle-flags:${trader.countryCode.toLowerCase()}`} className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{trader.traderName}</p>
                              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{trader.countryCode}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-[#222] text-gray-300 px-3 py-1 rounded-full text-[11px] font-bold border border-[#333]">
                            {trader.coinSymbol}/USDT
                          </span>
                        </td>
                        <td className="p-4 font-bold text-[#ebb70c]">{trader.leverage}x</td>
                        <td className="p-4 font-bold text-white">${trader.price.toLocaleString()}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className={`text-xs font-bold ${winRate >= 50 ? 'text-[#00ff55]' : 'text-red-500'}`}>{winRate}%</div>
                            <div className="flex gap-0.5">
                              {trader.last10Trades.map((t, i) => (
                                <div key={i} className={`w-1 h-3 rounded-sm ${t.isWin ? 'bg-[#00ff55]' : 'bg-red-500'}`} />
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleOpenEdit(trader)} className="p-2 hover:bg-[#222] rounded-lg text-gray-400 hover:text-[#ebb70c] transition-colors">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(trader.id)} className="p-2 hover:bg-[#222] rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={6} className="p-12 text-center text-gray-500">No traders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <div className="relative bg-[#111] border border-[#222] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
              <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-[#222] bg-[#1a1a1a]/80 backdrop-blur-md">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Icon icon={editingTrader ? "ph:pencil-bold" : "ph:plus-bold"} className="text-[#ebb70c]" />
                  {editingTrader ? 'Refine Trader Information' : 'Deploy New Trader'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Basic Info */}
                <div className="bg-[#151515] border border-[#222] p-6 rounded-2xl space-y-5">
                  <div className="flex items-center gap-2 text-[#ebb70c]">
                    <Icon icon="ph:identification-card-bold" className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Basic Information</span>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Trader Name</label>
                      <input required type="text" value={formData.traderName}
                        onChange={(e) => setFormData({ ...formData, traderName: e.target.value })}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ebb70c] transition-all"
                        placeholder="e.g. Master_Trader" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Country Code</label>
                      <input required type="text" maxLength={2} value={formData.countryCode}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value.toLowerCase().slice(0, 2) })}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ebb70c] transition-all uppercase"
                        placeholder="US, GB, NG..." />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Coin Symbol</label>
                      <input required type="text" value={formData.coinSymbol}
                        onChange={(e) => setFormData({ ...formData, coinSymbol: e.target.value.toUpperCase() })}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ebb70c] transition-all uppercase"
                        placeholder="BTC" />
                    </div>
                  </div>
                </div>

                {/* Trading Config */}
                <div className="bg-[#151515] border border-[#222] p-6 rounded-2xl space-y-5">
                  <div className="flex items-center gap-2 text-[#ebb70c]">
                    <Icon icon="ph:sliders-horizontal-bold" className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Trading Configuration</span>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Leverage</label>
                      <input required type="number" value={formData.leverage}
                        onChange={(e) => setFormData({ ...formData, leverage: parseInt(e.target.value) })}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ebb70c] transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Copy Price ($)</label>
                      <input required type="number" value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ebb70c] transition-all" />
                    </div>
                  </div>
                </div>

                {/* Performance History */}
                <div className="bg-[#151515] border border-[#222] p-6 rounded-2xl space-y-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#ebb70c]">
                      <Icon icon="ph:chart-line-up-bold" className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-widest">Performance History (Last 10)</span>
                    </div>
                    <span className="bg-[#00ff55]/10 text-[#00ff55] border border-[#00ff55]/20 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                      Win Rate: {Math.round((formData.last10Trades.filter(t => t.isWin).length / 10) * 100)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {formData.last10Trades.map((trade, idx) => (
                      <div key={idx} className="bg-[#0a0a0a] border border-[#2a2a2a] p-3 rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-500 font-bold">#{idx + 1}</span>
                          <button type="button" onClick={() => updateTradeHistory(idx, 'isWin', !trade.isWin)}
                            className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${trade.isWin ? 'bg-[#00ff55]/20 text-[#00ff55]' : 'bg-red-500/20 text-red-500'}`}>
                            <Icon icon={trade.isWin ? "ph:trend-up-bold" : "ph:trend-down-bold"} className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between bg-[#151515] rounded-lg border border-[#222] p-1">
                          <button type="button" onClick={() => updateTradeHistory(idx, 'pnl', Number((Math.max(0, Math.abs(trade.pnl) - 0.5)).toFixed(1)))}
                            className="w-6 h-6 flex items-center justify-center bg-[#222] hover:bg-[#333] rounded text-gray-400 transition-all">
                            <Icon icon="ph:minus-bold" className="w-3 h-3" />
                          </button>
                          <input type="number" step="0.1" inputMode="decimal" value={Math.abs(trade.pnl)}
                            onChange={(e) => { const val = parseFloat(e.target.value); updateTradeHistory(idx, 'pnl', isNaN(val) ? 0 : val); }}
                            className={`w-full bg-transparent text-center text-[11px] font-bold outline-none ${trade.isWin ? 'text-[#00ff55]' : 'text-red-500'} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} />
                          <button type="button" onClick={() => updateTradeHistory(idx, 'pnl', Number((Math.abs(trade.pnl) + 0.5).toFixed(1)))}
                            className="w-6 h-6 flex items-center justify-center bg-[#222] hover:bg-[#333] rounded text-gray-400 transition-all">
                            <Icon icon="ph:plus-bold" className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#ebb70c] to-[#f3cb3d] hover:from-[#d4a40b] hover:to-[#ebb70c] disabled:opacity-50 text-black font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(235,183,12,0.3)] flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                  <Icon icon={editingTrader ? "ph:check-circle-bold" : "ph:rocket-launch-bold"} className="w-5 h-5" />
                  {isSubmitting ? 'Saving...' : editingTrader ? 'Commit Updates' : 'Deploy Trader to Dashboard'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCopyTrades;
