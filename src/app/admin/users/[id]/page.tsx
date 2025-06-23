"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, User, DollarSign, Edit3, AlertCircle, Eye, EyeOff, Copy } from "lucide-react";
import TransactionHistory from "@/components/history/TransactionHistory";
import { useParams } from "next/navigation";
import { getAllUsers } from "@/lib/admin";
import type { user as BackendUser } from "@/lib/admin";
import Link from "next/link";
import { updateUser } from "@/lib/updateUser";
import toast from "react-hot-toast";

interface Transaction {
  id: string;
  amount: string;
  type: "Deposit" | "Withdrawal" | "Buy" | "Sell" | "Swap";
  date: string;
  coin?: string;
  fromCoin?: string;
  toCoin?: string;
}

interface CoinHolding {
  symbol: string;
  name: string;
  amount: string | UsdtWallet | UsdtWallet[];
}

interface User {
  id: string;
  username: string;
  email: string;
  phone: string,
  address: string,
  country: string,
  isVerified: string,
  balance: string;
  status: "verified" | "unverified" | "suspended";
  recentTransactions: Transaction[];
  joinDate?: string;
  lastActive?: string;
  avatar?: string;
  phrase: string;
  coinHoldings: CoinHolding[];
}

// Define USDT wallet type
interface UsdtWallet {
  address: string;
  name: string;
  amount: string;
}

const COINS = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  XRP: "ripple",
  LTC: "litecoin",
  XLM: "stellar",
  TRX: "tron",
  DOGE: "dogecoin",
  POLYGON: "polygon",
  LUNC: "terra-luna",
  ADA: "cardano",
  USDT: "tether",
  USDC: "usd-coin",
  SHIBA: "shiba-inu",
  PEPE: "pepe"
};

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  type EditValues = {
    [key: string]: string;
  };
  const [editValues, setEditValues] = useState<EditValues>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      // Fetch all users and find by _id
      const allUsers: BackendUser[] = await getAllUsers();
      const foundUser = allUsers.find(u => u._id === id);
      if (foundUser) {
        setUser({
          id: foundUser._id,
          username: foundUser.fullname || foundUser.email || "",
          email: foundUser.email,
          phone: foundUser.phone || "",
          address: foundUser.address || "",
          country: foundUser.country || "",
          isVerified: foundUser.isVerified || "",
          balance: typeof foundUser.balance === "string" ? foundUser.balance : String(foundUser.balance ?? "0"),
          status: (foundUser.isVerified as "verified" | "unverified" | "suspended") || "unverified",
          recentTransactions: [], // Map if available
          joinDate: foundUser.joinDate,
          lastActive: "", // Map if available
          avatar: "", // Map if available
          phrase: foundUser.phrase,
          coinHoldings: Object.keys(COINS).map(symbol => ({
            symbol,
            name: COINS[symbol as keyof typeof COINS],
            amount: foundUser.walletAddresses[symbol as keyof typeof foundUser.walletAddresses]?.toString?.() ?? "0"
          }))
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, [id]);

  // Helper to normalize isVerified for display and color
  const getNormalizedStatus = (isVerified: string | boolean | undefined) => {
    if (isVerified === true || isVerified === 'true' || isVerified === 'verified') return 'verified';
    if (isVerified === false || isVerified === 'false' || isVerified === 'unverified') return 'unverified';
    if (isVerified === 'suspended' || isVerified === 'banned') return 'suspended';
    return 'unverified';
  };

  const getStatusColor = (status: string | boolean) => {
    const normalized = getNormalizedStatus(status);
    switch (normalized) {
      case 'verified':
        return 'bg-green-900 text-green-300';
      case 'unverified':
        return 'bg-yellow-900 text-yellow-300';
      case 'suspended':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  const handleAdjustment = async () => {
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount)) return alert("Enter a valid amount");
    if (!user) return;

    setSaving(true);
    try {
      const updatedHoldings = [...user.coinHoldings];
      const existingCoinIndex = updatedHoldings.findIndex(coin => coin.symbol === selectedCoin);

      if (existingCoinIndex >= 0) {
        // Instead of adding, set the amount directly to the new value
        updatedHoldings[existingCoinIndex].amount = amount.toString();
      } else {
        updatedHoldings.push({
          symbol: selectedCoin,
          name: COINS[selectedCoin as keyof typeof COINS],
          amount: amount.toString()
        });
      }

      // Prepare wallet addresses update
      const walletAddresses: { [key: string]: string | UsdtWallet | UsdtWallet[] } = {};
      updatedHoldings.forEach(holding => {
        if (holding.symbol === "USDT" && Array.isArray(holding.amount)) {
          walletAddresses[holding.symbol] = (holding.amount as UsdtWallet[]).map((wallet: UsdtWallet) => ({
            address: wallet.address || "",
            name: wallet.name || "",
            amount: wallet.amount || "0"
          }));
        } else if (holding.symbol === "USDT" && typeof holding.amount === "object" && holding.amount !== null) {
          const amt = holding.amount as UsdtWallet;
          walletAddresses[holding.symbol] = {
            address: amt.address || "",
            name: amt.name || "",
            amount: amt.amount || "0"
          };
        } else {
          walletAddresses[holding.symbol] = typeof holding.amount === 'string' ? holding.amount : '';
        }
      });
      // Update via API
      await updateUser(user.email, {
        walletAddresses,
        adjustmentReason
      });

      setUser({
        ...user,
        coinHoldings: updatedHoldings
      });

      setAdjustAmount("");
      setAdjustmentReason("");
      alert(`${selectedCoin} balance adjusted successfully.\nReason: ${adjustmentReason}`);
    } catch (error) {
      alert("Failed to adjust balance. Please try again.");
      console.error("Error adjusting balance:", error);
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValues({ ...editValues, [field]: currentValue });
  };

  const saveEdit = async (field: string) => {
    if (!user) return;
    setSaving(true);
    try {
      // Handle coin holding edits with dynamic field keys
      if (field.startsWith('coinHolding-')) {
        // field format: coinHolding-SYMBOL-INDEX
        const parts = field.split('-');
        if (parts.length < 3) throw new Error('Invalid coin holding field key');
        const symbol = parts[1];
        const index = parseInt(parts[2], 10);
        const valueKey = `${field}-value`;
        const newValue = editValues[valueKey];
        if (isNaN(index) || !symbol || newValue === undefined) throw new Error('Invalid coin holding edit');
        const updatedHoldings = [...user.coinHoldings];
        updatedHoldings[index] = {
          ...updatedHoldings[index],
          amount: newValue
        };
        // Prepare wallet addresses update
        const walletAddresses: { [key: string]: string | UsdtWallet | UsdtWallet[] } = {};
        updatedHoldings.forEach(holding => {
          if (holding.symbol === "USDT" && Array.isArray(holding.amount)) {
            walletAddresses[holding.symbol] = holding.amount as UsdtWallet[];
          } else if (holding.symbol === "USDT" && typeof holding.amount === "object" && holding.amount !== null) {
            walletAddresses[holding.symbol] = holding.amount as UsdtWallet;
          } else {
            walletAddresses[holding.symbol] = typeof holding.amount === 'string' ? holding.amount : '';
          }
        });
        await updateUser(user.email, { walletAddresses });
        setUser({ ...user, coinHoldings: updatedHoldings });
      } else {
        // Use const and proper type for updateData
        const updateData: { [key: string]: unknown } = {};

        // Map frontend field names to backend field names
        switch (field) {
          case 'username':
            updateData.fullname = editValues[field];
            break;
          case 'email':
            updateData.email = editValues[field];
            break;
          case 'balance':
            updateData.balance = Number(editValues[field]); // Ensure balance is a number
            break;
          case 'seedPhrase':
            updateData.phrase = editValues[field];
            break;
          case 'status':
            // Convert to boolean for backend if needed
            if (editValues[field] === 'verified') updateData.isVerified = true;
            else if (editValues[field] === 'unverified') updateData.isVerified = false;
            else updateData.isVerified = editValues[field];
            break;
          default:
            updateData[field] = editValues[field];
        }

        await updateUser(user.email, updateData);

        // Update local state
        if (field === 'seedPhrase') {
          setUser({ ...user, phrase: editValues[field] });
        } else {
          setUser({ ...user, [field]: editValues[field] });
        }
      }

      setEditingField(null);
      toast.success("Changes saved successfully!");
      window.location.reload()
    } catch (error) {
      toast.error("Failed to save changes. Please try again.");
      console.error("Error saving changes:", error);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValues({});
  };

  const copySeedPhrase = () => {
    if (user?.phrase) {
      navigator.clipboard.writeText(user.phrase);
      alert("Seed phrase copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="text-gray-400 text-lg">Loading user data...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-6 min-h-screen" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="rounded-xl shadow-sm border p-12 text-center" style={{ backgroundColor: '#2a2a2a', borderColor: '#3a3a3a' }}>
          <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
          <p className="text-gray-400">The user you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-2 min-h-screen" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/admin/users" className="p-2 rounded-lg transition-colors duration-200"
          style={{ backgroundColor: '#2a2a2a' }}>
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">User Details</h1>
          <p className="text-gray-400 mt-1">Manage user account and crypto holdings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-xl shadow-sm border" style={{ backgroundColor: '#2a2a2a', borderColor: '#3a3a3a' }}>
            <div className="p-2 md:p-6">
              {/* User Avatar and Basic Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold"
                  style={{ backgroundColor: '#ebb70c', color: '#1a1a1a' }}>
                  {user.avatar || user.username.charAt(0).toUpperCase()}
                </div>
                <div className="mb-1">
                  {editingField === 'username' ? (
                    <div className="flex gap-2">
                      <input
                        value={editValues.username}
                        onChange={(e) => setEditValues({ ...editValues, username: e.target.value })}
                        className="text-center bg-gray-800 text-white rounded px-2 py-1"
                        disabled={saving}
                      />
                      <button
                        onClick={() => saveEdit('username')}
                        className="text-green-400"
                        disabled={saving}
                      >
                        {saving ? "..." : "✓"}
                      </button>
                      <button onClick={cancelEdit} className="text-red-400" disabled={saving}>✗</button>
                    </div>
                  ) : (
                    <h2 className="text-xl font-bold text-white cursor-pointer hover:text-yellow-400"
                      onClick={() => startEditing('username', user.username)}>
                      {user.username} <Edit3 className="w-4 h-4 inline ml-1" />
                    </h2>
                  )}
                </div>
                <div className="mb-3">
                  {editingField === 'email' ? (
                    <div className="flex gap-2">
                      <input
                        value={editValues.email}
                        onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
                        className="text-center bg-gray-800 text-white rounded px-2 py-1 text-sm"
                        disabled={saving}
                      />
                      <button
                        onClick={() => saveEdit('email')}
                        className="text-green-400"
                        disabled={saving}
                      >
                        {saving ? "..." : "✓"}
                      </button>
                      <button onClick={cancelEdit} className="text-red-400" disabled={saving}>✗</button>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm cursor-pointer hover:text-yellow-400"
                      onClick={() => startEditing('email', user.email)}>
                      {user.email} <Edit3 className="w-3 h-3 inline ml-1" />
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isVerified)}`}>
                  {getNormalizedStatus(user.isVerified).charAt(0).toUpperCase() + getNormalizedStatus(user.isVerified).slice(1)}
                </span>
              </div>

              {/* User Stats */}
              <div className="space-y-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5" style={{ color: '#ebb70c' }} />
                      <span className="text-gray-400">Current Balance</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    {editingField === 'balance' ? (
                      <div className="flex gap-2">
                        <input
                          value={editValues.balance}
                          onChange={(e) => setEditValues({ ...editValues, balance: e.target.value })}
                          className="bg-gray-800 text-white rounded px-2 py-1 text-xl font-bold w-[80%]"
                          disabled={saving}
                        />
                        <button
                          onClick={() => saveEdit('balance')}
                          className="text-green-400"
                          disabled={saving}
                        >
                          {saving ? "..." : "✓"}
                        </button>
                        <button onClick={cancelEdit} className="text-red-400" disabled={saving}>✗</button>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-white cursor-pointer hover:text-yellow-400"
                        onClick={() => startEditing('balance', user.balance)}>
                        ${user.balance} <Edit3 className="w-4 h-4 inline ml-1" />
                      </p>
                    )}
                  </div>
                </div>
                {/* --- NEW: User Info Fields --- */}
                <div className="p-2 rounded-lg space-y-3" style={{ backgroundColor: '#1a1a1a' }}>
                  {/* Phone */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Phone</span>
                    {editingField === 'phone' ? (
                      <div className="flex gap-2">
                        <input
                          value={editValues.phone}
                          onChange={(e) => setEditValues({ ...editValues, phone: e.target.value })}
                          className="bg-gray-800 text-white rounded px-2 py-1 text-sm"
                          disabled={saving}
                        />
                        <button onClick={() => saveEdit('phone')} className="text-green-400" disabled={saving}>{saving ? "..." : "✓"}</button>
                        <button onClick={cancelEdit} className="text-red-400" disabled={saving}>✗</button>
                      </div>
                    ) : (
                      <span className="text-white text-sm cursor-pointer hover:text-yellow-400" onClick={() => startEditing('phone', user.phone || '')}>
                        {user.phone || <span className="text-gray-500">N/A</span>} <Edit3 className="w-3 h-3 inline ml-1" />
                      </span>
                    )}
                  </div>
                  {/* Address */}
                  <div className="flex gap-6 items-center justify-between">
                    <span className="text-gray-400 flex-1">Address</span>
                    {editingField === 'address' ? (
                      <div className="flex-1 gap-2">
                        <input
                          value={editValues.address}
                          onChange={(e) => setEditValues({ ...editValues, address: e.target.value })}
                          className="bg-gray-800 text-white rounded px-2 py-1 text-sm"
                          disabled={saving}
                        />
                        <div className="flex gap-6 w-[60%]">
                          <button onClick={() => saveEdit('address')} className="text-green-400" disabled={saving}>{saving ? "..." : "✓"}</button>
                          <button onClick={cancelEdit} className="text-red-400" disabled={saving}>✗</button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-white text-sm cursor-pointer hover:text-yellow-400" onClick={() => startEditing('address', user.address || '')}>
                        {user.address || <span className="text-gray-500">N/A</span>} <Edit3 className="w-3 h-3 inline ml-1" />
                      </span>
                    )}
                  </div>
                  {/* Country */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Country</span>
                    {editingField === 'country' ? (
                      <div className="flex gap-2">
                        <input
                          value={editValues.country}
                          onChange={(e) => setEditValues({ ...editValues, country: e.target.value })}
                          className="bg-gray-800 text-white rounded px-2 py-1 text-sm"
                          disabled={saving}
                        />
                        <button onClick={() => saveEdit('country')} className="text-green-400" disabled={saving}>{saving ? "..." : "✓"}</button>
                        <button onClick={cancelEdit} className="text-red-400" disabled={saving}>✗</button>
                      </div>
                    ) : (
                      <span className="text-white text-sm cursor-pointer hover:text-yellow-400" onClick={() => startEditing('country', user.country || '')}>
                        {user.country || <span className="text-gray-500">N/A</span>} <Edit3 className="w-3 h-3 inline ml-1" />
                      </span>
                    )}
                  </div>
                  {/* isVerified */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Verification Status</span>
                    {editingField === 'status' ? (
                      <div className="flex gap-2">
                        <select
                          value={getNormalizedStatus(editValues.status)}
                          onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}
                          className="bg-gray-800 text-white rounded px-2 py-1 text-sm"
                          disabled={saving}
                        >
                          <option value="verified">Verified</option>
                          <option value="unverified">Unverified</option>
                          <option value="suspended">Suspended</option>
                        </select>
                        <button onClick={() => saveEdit('status')} className="text-green-400" disabled={saving}>{saving ? "..." : "✓"}</button>
                        <button onClick={cancelEdit} className="text-red-400" disabled={saving}>✗</button>
                      </div>
                    ) : (
                      <span className="text-white text-sm cursor-pointer hover:text-yellow-400" onClick={() => startEditing('status', getNormalizedStatus(user.isVerified))}>
                        {getNormalizedStatus(user.isVerified).charAt(0).toUpperCase() + getNormalizedStatus(user.isVerified).slice(1)} <Edit3 className="w-3 h-3 inline ml-1" />
                      </span>
                    )}
                  </div>
                </div>
                {/* --- END NEW --- */}
              </div>
            </div>
          </div>

          {/* Seed Phrase Display */}
          <div className="rounded-xl shadow-sm border mt-6" style={{ backgroundColor: '#2a2a2a', borderColor: '#3a3a3a' }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Seed Phrase</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                    className="p-2 rounded-lg hover:bg-gray-700"
                  >
                    {showSeedPhrase ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                  <button
                    onClick={copySeedPhrase}
                    className="p-2 rounded-lg hover:bg-gray-700"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              {editingField === 'seedPhrase' ? (
                <div className="space-y-2">
                  <textarea
                    value={editValues.seedPhrase}
                    onChange={(e) => setEditValues({ ...editValues, seedPhrase: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm h-20 resize-none"
                    disabled={saving}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit('seedPhrase')}
                      className="text-green-400"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button onClick={cancelEdit} className="text-red-400" disabled={saving}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div
                  className="p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-700"
                  style={{ backgroundColor: '#1a1a1a' }}
                  onClick={() => startEditing('seedPhrase', user.phrase)}
                >
                  {showSeedPhrase ? (
                    <span className="text-yellow-300 flex gap-1 items-center"><Edit3 className="w-[40px] h-8 inline ml-1" /><p className="overflow-x-auto">{user.phrase}</p></span>
                  ) : (
                    <div className="text-gray-400 overflow-x-auto">••••••••••••••••••••••••••••••••••••••••</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

  
        {/* Coin Holdings Section */}
        <div className="rounded-xl shadow-sm border mt-6" style={{ backgroundColor: '#2a2a2a', borderColor: '#3a3a3a' }}>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Coin Holdings</h3>
            <div
              className="space-y-3 overflow-y-auto"
              style={{ maxHeight: "320px" }}
            >
              {user.coinHoldings.map((holding, idx) => (
                <div key={`${holding.symbol}-${idx}`} className="flex items-center justify-between gap-2 bg-[#1a1a1a] rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-yellow-400">{holding.symbol}</span>
                    <span className="text-gray-400 text-xs">{holding.name.replace('-', ' ')}</span>
                  </div>
                  <span className="text-white font-mono overflow-x-auto">{typeof holding.amount === "string" ? holding.amount : ""}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Balance Adjustment Form */}
          <div className="rounded-xl shadow-sm border" style={{ backgroundColor: '#2a2a2a', borderColor: '#3a3a3a' }}>
            <div className="p-6 border-b" style={{ borderColor: '#3a3a3a' }}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#ebb70c' }}>
                  <Edit3 className="w-4 h-4" style={{ color: '#1a1a1a' }} />
                </div>
                <h3 className="text-lg font-semibold text-white">Crypto Balance Adjustment</h3>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                    <input
                      type="number"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full p-3 rounded-lg text-white outline-none border transition-colors duration-200 focus:border-yellow-400"
                      style={{ backgroundColor: '#1a1a1a', borderColor: '#3a3a3a' }}
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cryptocurrency</label>
                    <select
                      value={selectedCoin}
                      onChange={(e) => setSelectedCoin(e.target.value)}
                      className="w-full p-3 rounded-lg text-white outline-none border transition-colors duration-200 focus:border-yellow-400"
                      style={{ backgroundColor: '#1a1a1a', borderColor: '#3a3a3a' }}
                      disabled={saving}
                    >
                      {Object.entries(COINS).map(([symbol, name]) => (
                        <option key={symbol} value={symbol}>{symbol} - {name.replace('-', ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Reason for Adjustment</label>
                  <textarea
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    placeholder="e.g., Bonus, Correction, Refund..."
                    className="w-full p-3 rounded-lg text-white outline-none border transition-colors duration-200 focus:border-yellow-400 resize-none h-20"
                    style={{ backgroundColor: '#1a1a1a', borderColor: '#3a3a3a' }}
                    disabled={saving}
                  />
                </div>

                <button
                  onClick={handleAdjustment}
                  className="w-full p-3 rounded-lg font-medium transition-colors duration-200 hover:bg-opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: '#ebb70c', color: '#1a1a1a' }}
                  disabled={saving}
                >
                  {saving ? "Processing..." : "Apply Crypto Adjustment"}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="rounded-xl shadow-sm border" style={{ backgroundColor: '#2a2a2a', borderColor: '#3a3a3a' }}>
            <div className="p-6 border-b" style={{ borderColor: '#3a3a3a' }}>
              <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
              <p className="text-gray-400 text-sm mt-1">Latest account activity</p>
            </div>

            <TransactionHistory/>
          </div>
        </div>
      </div>
    </div>
  );
}