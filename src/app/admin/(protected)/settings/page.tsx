'use client';

import { useEffect, useState } from 'react';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useAdminContext } from '@/store/adminContext';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
useAdminContext

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('CoinlyEx');
  const [supportEmail, setSupportEmail] = useState('support@coinlyex.com');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [minDeposit, setMinDeposit] = useState(10);
  const [maxWithdrawal, setMaxWithdrawal] = useState(1000);
  const { admin, setAdmin } = useAdminContext()

  const [newPassword, setNewPassword] = useState('');

  // Cryptocurrency wallets state
  type WalletData = { address: string; icon: string };
  type Wallets = Record<string, WalletData>;

  const [wallets, setWallets] = useState<Wallets>({
    BTC: { address: admin.addresses?.BTC || '', icon: 'cryptocurrency-color:btc' },
    ETH: { address: admin.addresses?.ETH || '', icon: 'cryptocurrency-color:eth' },
    SOL: { address: admin.addresses?.SOL || '', icon: 'cryptocurrency-color:sol' },
    BNB: { address: admin.addresses?.BNB || '', icon: 'cryptocurrency-color:bnb' },
    XRP: { address: admin.addresses?.XRP || '', icon: 'cryptocurrency-color:xrp' },
    LTC: { address: admin.addresses?.LTC || '', icon: 'cryptocurrency-color:ltc' },
    XLM: { address: admin.addresses?.XLM || '', icon: 'cryptocurrency-color:xlm' },
    TRX: { address: admin.addresses?.TRX || '', icon: 'cryptocurrency-color:trx' },
    DOGE: { address: admin.addresses?.DOGE || '', icon: 'cryptocurrency-color:doge' },
    POLYGON: { address: admin.addresses?.POLYGON || '', icon: 'cryptocurrency-color:matic' },
    LUNC: { address: admin.addresses?.LUNC || '', icon: 'token-branded:lunc' },
    ADA: { address: admin.addresses?.ADA || '', icon: 'cryptocurrency-color:ada' },
    USDC: { address: admin.addresses?.USDC || '', icon: 'cryptocurrency-color:usdc' },
    SHIBA: { address: admin.addresses?.SHIBA || '', icon: 'token-branded:shib' },
    PEPE: { address: admin.addresses?.PEPE || '', icon: 'token-branded:pepes' }
  });

  const [usdtAddresses, setUsdtAddresses] = useState<USDTAddress[]>(admin.addresses?.USDT ?? [
    { name: "USDT (ERC20)", address: "" },
    { name: "USDT (BEP20)", address: "" },
    { name: "USDT (TRC20)", address: "" }
  ]);

  useEffect(() => {
    setWallets(prev => ({
      ...prev,
      BTC: { ...prev.BTC, address: admin.addresses?.BTC || '' },
      ETH: { ...prev.ETH, address: admin.addresses?.ETH || '' },
      SOL: { ...prev.SOL, address: admin.addresses?.SOL || '' },
      BNB: { ...prev.BNB, address: admin.addresses?.BNB || '' },
      XRP: { ...prev.XRP, address: admin.addresses?.XRP || '' },
      LTC: { ...prev.LTC, address: admin.addresses?.LTC || '' },
      XLM: { ...prev.XLM, address: admin.addresses?.XLM || '' },
      TRX: { ...prev.TRX, address: admin.addresses?.TRX || '' },
      DOGE: { ...prev.DOGE, address: admin.addresses?.DOGE || '' },
      POLYGON: { ...prev.POLYGON, address: admin.addresses?.POLYGON || '' },
      LUNC: { ...prev.LUNC, address: admin.addresses?.LUNC || '' },
      ADA: { ...prev.ADA, address: admin.addresses?.ADA || '' },
      USDC: { ...prev.USDC, address: admin.addresses?.USDC || '' },
      SHIBA: { ...prev.SHIBA, address: admin.addresses?.SHIBA || '' },
      PEPE: { ...prev.PEPE, address: admin.addresses?.PEPE || '' }
    }));
    setUsdtAddresses(admin.addresses?.USDT || [
      { name: "USDT (ERC20)", address: "" },
      { name: "USDT (BEP20)", address: "" },
      { name: "USDT (TRC20)", address: "" }
    ]);
    setMaxWithdrawal(admin.maxWithdrawalAmount ?? 1000)
    setMinDeposit(admin.minDepositAmount ?? 10)
  }, [admin])

  const [editingUsdtIndex, setEditingUsdtIndex] = useState<number | null>(null);
  const [editingUsdtAddress, setEditingUsdtAddress] = useState<string>("");

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

  const handleUsdtEdit = (idx: number) => {
    setEditingUsdtIndex(idx);
    setEditingUsdtAddress(usdtAddresses[idx].address);
  };

  const handleUsdtSave = (idx: number) => {
    setUsdtAddresses(prev =>
      prev.map((item, i) =>
        i === idx ? { ...item, address: editingUsdtAddress } : item
      )
    );
    setEditingUsdtIndex(null);
    setEditingUsdtAddress("");
  };
  const handleUsdtCancel = () => {
    setEditingUsdtIndex(null);
    setEditingUsdtAddress("");
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

  const handleSaveSettings = async () => {
    try {
      // Prepare addresses object for PATCH
      const addresses: WalletAddresses = {
        ...Object.fromEntries(
          Object.entries(wallets).map(([symbol, data]) => [symbol, data.address])
        ),
        USDT: usdtAddresses
      };

      const payload: {
        minDepositAmount?: number;
        maxWithdrawalAmount?: number;
        addresses?: WalletAddresses;
        password?: string;
      } = {};

      if(minDeposit) payload.minDepositAmount = minDeposit;
      if(maxWithdrawal) payload.maxWithdrawalAmount = maxWithdrawal;
      if(addresses) payload.addresses = addresses;

      if (newPassword.trim()) {
        payload.password = newPassword;
      }

      // PATCH request to /admin
      const res = await api.patch<adminType>('/admin', payload);

      // Update admin context
      setAdmin(res.data);
      toast('Settings saved successfully!');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error('Failed to save settings: ' + err.response?.data.message);
      } else {
        toast.error('An error occurred')
      }
    }
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

              <div>
                <label className="block mb-2 text-sm font-medium">Admin Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full p-3 rounded bg-[#1F1F1F] text-white outline-none"
                  autoComplete="new-password"
                />
                <p className="text-xs text-gray-400 mt-1">Leave blank to keep current password.</p>
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
                    onClick={() => { setShowAddCoin(false); setNewCoin({ symbol: '', address: '', icon: '' }); }}
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
                          style={{ color: 'unset' }}
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

              <div className="mt-6">
                <h3 className="text-base font-semibold mb-2">USDT Addresses</h3>
                <div className="grid grid-cols-1 gap-3">
                  {usdtAddresses.map((usdt, idx) => (
                    <div key={usdt.name} className="bg-[#1F1F1F] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                          <Icon icon="cryptocurrency-color:usdt" width="32" height="32" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base">{usdt.name}</div>
                          <div className="text-xs text-gray-400 break-all">cryptocurrency-color:usdt</div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingUsdtIndex === idx ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editingUsdtAddress}
                              onChange={e => setEditingUsdtAddress(e.target.value)}
                              className="flex-1 p-2 rounded bg-[#2A2A2A] text-white outline-none focus:ring-2 focus:ring-[#ebb70c] text-sm"
                              placeholder="Enter wallet address"
                            />
                            <button
                              onClick={() => handleUsdtSave(idx)}
                              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-all text-sm"
                            >
                              <Save size={12} />
                            </button>
                            <button
                              onClick={handleUsdtCancel}
                              className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded transition-all text-sm"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-300 break-all">
                                {usdt.address || 'No address set'}
                              </div>
                            </div>
                            <button
                              onClick={() => handleUsdtEdit(idx)}
                              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-all text-sm"
                            >
                              <Edit2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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