"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, User, Calendar, Clock, DollarSign,Edit3, AlertCircle, Eye, EyeOff, Copy, Coins } from "lucide-react";
import TransactionHistory from "@/components/TransactionHistory";

// Mock useParams hook for demonstration
const useParams = () => ({ id: "1" });

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
  amount: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  balance: string;
  status: "active" | "suspended" | "banned" | "inactive";
  recentTransactions: Transaction[];
  joinDate?: string;
  lastActive?: string;
  avatar?: string;
  seedPhrase: string;
  coinHoldings: CoinHolding[];
}

// Coin mapping
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

// Mock dummy users data
const dummyUsers = [
  {
    id: "1",
    username: "john_crypto",
    email: "john@example.com",
    balance: "12450.80",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    avatar: "JC",
    seedPhrase: "abandon ability able about above absent absorb abstract absurd abuse access accident account accuse achieve",
    coinHoldings: [
      { symbol: "BTC", name: "bitcoin", amount: "0.25" },
      { symbol: "ETH", name: "ethereum", amount: "5.8" },
      { symbol: "SOL", name: "solana", amount: "120.5" },
      { symbol: "USDT", name: "tether", amount: "1000.0" }
    ],
    recentTransactions: [
      { id: "1", amount: "$500.00", type: "Deposit", date: "2024-06-05" },
      { id: "2", amount: "0.05 BTC", type: "Buy", date: "2024-06-04", coin: "BTC" },
      { id: "3", amount: "2.5 ETH", type: "Sell", date: "2024-06-03", coin: "ETH" },
      { id: "4", amount: "50 SOL", type: "Swap", date: "2024-06-02", fromCoin: "USDT", toCoin: "SOL" },
    ]
  }
];

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

  useEffect(() => {
    const foundUser = dummyUsers.find((u) => u.id === id) as User;
    if (foundUser) {
      setUser({
        ...foundUser,
        balance: typeof foundUser.balance === "string" ? foundUser.balance : String(foundUser.balance),
        status: foundUser.status as "active" | "suspended" | "banned" | "inactive",
        recentTransactions: foundUser.recentTransactions ?? [],
        coinHoldings: foundUser.coinHoldings ?? [],
        seedPhrase: foundUser.seedPhrase ?? ""
      });
    } else {
      setUser(null);
    }
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900 text-green-300';
      case 'inactive':
        return 'bg-yellow-900 text-yellow-300';
      case 'suspended':
      case 'banned':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  const handleAdjustment = () => {
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount)) return alert("Enter a valid amount");

    const updatedHoldings = [...user!.coinHoldings];
    const existingCoinIndex = updatedHoldings.findIndex(coin => coin.symbol === selectedCoin);

    if (existingCoinIndex >= 0) {
      const currentAmount = parseFloat(updatedHoldings[existingCoinIndex].amount);
      updatedHoldings[existingCoinIndex].amount = (currentAmount + amount).toString();
    } else {
      updatedHoldings.push({
        symbol: selectedCoin,
        name: COINS[selectedCoin as keyof typeof COINS],
        amount: amount.toString()
      });
    }

    setUser({
      ...user!,
      coinHoldings: updatedHoldings
    });
    setAdjustAmount("");
    setAdjustmentReason("");
    alert(`${selectedCoin} balance adjusted successfully.\nReason: ${adjustmentReason}`);
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValues({ ...editValues, [field]: currentValue });
  };

  const saveEdit = (field: string) => {
    if (field === 'coinHolding') {
      const [index] = editValues[field].split('-');
      const updatedHoldings = [...user!.coinHoldings];
      updatedHoldings[parseInt(index)].amount = editValues[`${field}-value`];
      setUser({ ...user!, coinHoldings: updatedHoldings });
    } else {
      setUser({ ...user!, [field]: editValues[field] });
    }
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValues({});
  };

  const copySeedPhrase = () => {
    navigator.clipboard.writeText(user!.seedPhrase);
    alert("Seed phrase copied to clipboard!");
  };

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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button className="p-2 rounded-lg transition-colors duration-200"
          style={{ backgroundColor: '#2a2a2a' }}>
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">User Details</h1>
          <p className="text-gray-400 mt-1">Manage user account and crypto holdings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-xl shadow-sm border" style={{ backgroundColor: '#2a2a2a', borderColor: '#3a3a3a' }}>
            <div className="p-6">
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
                      />
                      <button onClick={() => saveEdit('username')} className="text-green-400">✓</button>
                      <button onClick={cancelEdit} className="text-red-400">✗</button>
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
                      />
                      <button onClick={() => saveEdit('email')} className="text-green-400">✓</button>
                      <button onClick={cancelEdit} className="text-red-400">✗</button>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm cursor-pointer hover:text-yellow-400"
                      onClick={() => startEditing('email', user.email)}>
                      {user.email} <Edit3 className="w-3 h-3 inline ml-1" />
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>

              {/* User Stats */}
              <div className="space-y-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
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
                          className="bg-gray-800 text-white rounded px-2 py-1 text-xl font-bold"
                        />
                        <button onClick={() => saveEdit('balance')} className="text-green-400">✓</button>
                        <button onClick={cancelEdit} className="text-red-400">✗</button>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-white cursor-pointer hover:text-yellow-400"
                        onClick={() => startEditing('balance', user.balance)}>
                        ${user.balance} <Edit3 className="w-4 h-4 inline ml-1" />
                      </p>
                    )}
                  </div>
                </div>

                {user.joinDate && (
                  <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: '#3a3a3a' }}>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">Join Date</span>
                    </div>
                    <span className="text-white text-sm">{user.joinDate}</span>
                  </div>
                )}

                {user.lastActive && (
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">Last Active</span>
                    </div>
                    <span className="text-white text-sm">{user.lastActive}</span>
                  </div>
                )}
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
                  />
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit('seedPhrase')} className="text-green-400">Save</button>
                    <button onClick={cancelEdit} className="text-red-400">Cancel</button>
                  </div>
                </div>
              ) : (
                <div
                  className="p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-700"
                  style={{ backgroundColor: '#1a1a1a' }}
                  onClick={() => startEditing('seedPhrase', user.seedPhrase)}
                >
                  {showSeedPhrase ? (
                    <span className="text-yellow-300">{user.seedPhrase} <Edit3 className="w-3 h-3 inline ml-1" /></span>
                  ) : (
                    <span className="text-gray-400">••••••••••••••••••••••••••••••••••••••••</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Crypto Holdings */}
          <div className="rounded-xl shadow-sm border" style={{ backgroundColor: '#2a2a2a', borderColor: '#3a3a3a' }}>
            <div className="p-6 border-b" style={{ borderColor: '#3a3a3a' }}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#ebb70c' }}>
                  <Coins className="w-4 h-4" style={{ color: '#1a1a1a' }} />
                </div>
                <h3 className="text-lg font-semibold text-white">Crypto Holdings</h3>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.coinHoldings.map((holding, index) => (
                  <div key={holding.symbol}
                    className="p-4 rounded-lg border"
                    style={{ backgroundColor: '#1a1a1a', borderColor: '#3a3a3a' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{holding.symbol}</p>
                        <p className="text-gray-400 text-sm capitalize">{holding.name.replace('-', ' ')}</p>
                      </div>
                      <div className="text-right">
                        {editingField === `coinHolding-${holding.symbol}-${index}` ? (
                          <div className="flex gap-2">
                            <input
                              value={editValues[`coinHolding-${holding.symbol}-${index}-value`]}
                              onChange={(e) => setEditValues({ ...editValues, [`coinHolding-${holding.symbol}-${index}-value`]: e.target.value })}
                              className="bg-gray-800 text-white rounded px-2 py-1 w-20 text-sm"
                            />
                            <button onClick={() => saveEdit('coinHolding')} className="text-green-400">✓</button>
                            <button onClick={cancelEdit} className="text-red-400">✗</button>
                          </div>
                        ) : (
                          <p className="text-yellow-400 font-semibold cursor-pointer hover:text-yellow-300"
                            onClick={() => {
                              startEditing(`coinHolding-${holding.symbol}-${index}`, `${holding.symbol}-${index}`);
                              setEditValues({ ...editValues, [`coinHolding-${holding.symbol}-${index}-value`]: holding.amount });
                            }}>
                            {holding.amount} <Edit3 className="w-3 h-3 inline ml-1" />
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cryptocurrency</label>
                    <select
                      value={selectedCoin}
                      onChange={(e) => setSelectedCoin(e.target.value)}
                      className="w-full p-3 rounded-lg text-white outline-none border transition-colors duration-200 focus:border-yellow-400"
                      style={{ backgroundColor: '#1a1a1a', borderColor: '#3a3a3a' }}
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
                  />
                </div>

                <button
                  onClick={handleAdjustment}
                  className="w-full p-3 rounded-lg font-medium transition-colors duration-200 hover:bg-opacity-90"
                  style={{ backgroundColor: '#ebb70c', color: '#1a1a1a' }}
                >
                  Apply Crypto Adjustment
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

            <TransactionHistory
              isAdmin={true}
              pendingTransactions={[]}
              completedTransactions={[]}
              onTransactionUpdate={() => { }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}