'use client';

import { useState } from 'react';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('CoinlyEx');
  const [supportEmail, setSupportEmail] = useState('support@coinlyex.com');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [minDeposit, setMinDeposit] = useState(10);
  const [maxWithdrawal, setMaxWithdrawal] = useState(1000);
  
  // Cryptocurrency wallets state
  type WalletData = { address: string; icon: string };
  type Wallets = Record<string, WalletData>;

  const [wallets, setWallets] = useState<Wallets>({
    BTC: { address: '', icon: 'cryptocurrency-color:btc' },
    ETH: { address: '', icon: 'cryptocurrency-color:eth' },
    SOL: { address: '', icon: 'cryptocurrency-color:sol' },
    BNB: { address: '', icon: 'cryptocurrency-color:bnb' },
    XRP: { address: '', icon: 'cryptocurrency-color:xrp' },
    LTC: { address: '', icon: 'cryptocurrency-color:ltc' },
    XLM: { address: '', icon: 'cryptocurrency-color:xlm' },
    TRX: { address: '', icon: 'cryptocurrency-color:trx' },
    DOGE: { address: '', icon: 'cryptocurrency-color:doge' },
    POLYGON: { address: '', icon: 'cryptocurrency-color:matic' },
    LUNC: { address: '', icon: 'token-branded:lunc' },
    ADA: { address: '', icon: 'cryptocurrency-color:ada' },
    USDT: { address: '', icon: 'cryptocurrency-color:usdt' },
    USDC: { address: '', icon: 'cryptocurrency-color:usdc' },
    SHIBA: { address: '', icon: 'token-branded:shib' },
    PEPE: { address: '', icon: 'token-branded:pepes' }
  });
  
  const [editingWallet, setEditingWallet] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState('');
  const [newCoin, setNewCoin] = useState({ symbol: '', address: '', icon: '' });
  const [showAddCoin, setShowAddCoin] = useState(false);

  const handleWalletEdit = (coin: string) => {
    setEditingWallet(coin);
    setEditingAddress(wallets[coin].address);
  };

  const handleWalletSave = (coin: string) => {
    setWallets(prev => ({
      ...prev,
      [coin]: { ...prev[coin], address: editingAddress }
    }));
    setEditingWallet(null);
    setEditingAddress('');
  };

  const handleWalletCancel = () => {
    setEditingWallet(null);
    setEditingAddress('');
  };

  const handleAddCoin = () => {
    if (newCoin.symbol && newCoin.address) {
      setWallets(prev => ({
        ...prev,
        [newCoin.symbol.toUpperCase()]: {
          address: newCoin.address,
          icon: newCoin.icon || 'cryptocurrency-color:btc'
        }
      }));
      setNewCoin({ symbol: '', address: '', icon: '' });
      setShowAddCoin(false);
  // const handleDeleteCoin = (coin: string) => {
  //   setWallets(prev => {
  //     const updated = { ...prev };
  //     delete updated[coin];
  //     return updated;
  //   });
  // };
      // return updated;
    };
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Admin Settings</h1>

        <div className="space-y-6">
          {/* Platform Settings */}
          <div className="bg-[#2A2A2A] p-4 sm:p-6 rounded-lg space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold">Platform Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Site Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Site Name"
                  className="w-full p-3 rounded bg-[#1F1F1F] text-white outline-none"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="Support Email"
                  className="w-full p-3 rounded bg-[#1F1F1F] text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Transaction Settings */}
          <div className="bg-[#2A2A2A] p-4 sm:p-6 rounded-lg space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold">Transaction Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Minimum Deposit ($)</label>
                <input
                  type="number"
                  value={minDeposit}
                  onChange={(e) => setMinDeposit(Number(e.target.value))}
                  className="w-full p-3 rounded bg-[#1F1F1F] text-white outline-none"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Maximum Withdrawal ($)</label>
                <input
                  type="number"
                  value={maxWithdrawal}
                  onChange={(e) => setMaxWithdrawal(Number(e.target.value))}
                  className="w-full p-3 rounded bg-[#1F1F1F] text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Maintenance Mode */}
          <div className="bg-[#2A2A2A] p-4 sm:p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">Maintenance Mode</h3>
                <p className="text-gray-400 text-sm">Enable to temporarily disable user access</p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ebb70c]"></div>
              </label>
            </div>
          </div>

          {/* Cryptocurrency Wallets */}
          <div className="bg-[#2A2A2A] p-4 sm:p-6 rounded-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg sm:text-xl font-semibold">Cryptocurrency Wallet Addresses</h2>
              <button
                onClick={() => setShowAddCoin(true)}
                className="flex items-center gap-2 bg-[#ebb70c] hover:bg-[#ebb70cb1] text-black px-4 py-2 rounded transition-all font-medium"
              >
                <Plus size={16} />
                Add Coin
              </button>
            </div>

            {/* Add New Coin Form */}
            {showAddCoin && (
              <div className="bg-[#1F1F1F] p-4 rounded-lg space-y-3">
                <h3 className="font-medium">Add New Cryptocurrency</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Symbol (e.g., BTC)"
                    value={newCoin.symbol}
                    onChange={(e) => setNewCoin(prev => ({ ...prev, symbol: e.target.value }))}
                    className="p-2 rounded bg-[#2A2A2A] text-white outline-none focus:ring-2 focus:ring-[#ebb70c]"
                  />
                  <input
                    type="text"
                    placeholder="Wallet Address"
                    value={newCoin.address}
                    onChange={(e) => setNewCoin(prev => ({ ...prev, address: e.target.value }))}
                    className="p-2 rounded bg-[#2A2A2A] text-white outline-none focus:ring-2 focus:ring-[#ebb70c]"
                  />
                  <input
                    type="text"
                    placeholder="Icon (optional)"
                    value={newCoin.icon}
                    onChange={(e) => setNewCoin(prev => ({ ...prev, icon: e.target.value }))}
                    className="p-2 rounded bg-[#2A2A2A] text-white outline-none focus:ring-2 focus:ring-[#ebb70c]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCoin}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-all text-sm"
                  >
                    <Save size={14} />
                    Add
                  </button>
                  <button
                    onClick={() => {setShowAddCoin(false); setNewCoin({ symbol: '', address: '', icon: '' });}}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded transition-all text-sm"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Wallet List */}
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(wallets).map(([coin, data]) => (
                <div key={coin} className="bg-[#1F1F1F] p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <Icon 
                          icon={data.icon}
                          width="32"
                          height="32"
                          style={{color: 'unset'}}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm sm:text-base">{coin}</div>
                        <div className="text-xs text-gray-400 break-all">{data.icon}</div>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {editingWallet === coin ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingAddress}
                            onChange={(e) => setEditingAddress(e.target.value)}
                            className="flex-1 p-2 rounded bg-[#2A2A2A] text-white outline-none focus:ring-2 focus:ring-[#ebb70c] text-sm"
                            placeholder="Enter wallet address"
                          />
                          <button
                            onClick={() => handleWalletSave(coin)}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-all text-sm"
                          >
                            <Save size={12} />
                          </button>
                          <button
                            onClick={handleWalletCancel}
                            className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded transition-all text-sm"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-300 break-all">
                              {data.address || 'No address set'}
                            </div>
                          </div>
                          <button
                            onClick={() => handleWalletEdit(coin)}
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-all text-sm"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            // onClick={() => handleDeleteCoin(coin)}
                            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-all text-sm"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            className="w-full bg-[#ebb70c] hover:bg-[#ebb70cb1] transition text-black font-semibold p-3 rounded-lg cursor-pointer"
          >
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
}