"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, User, DollarSign, Edit3, AlertCircle, Eye, EyeOff, Copy } from "lucide-react";
import TransactionHistory from "../../history/TransactionHistory";
import { useParams, useRouter } from "next/navigation";
import type { user } from "@/lib/admin";
import Link from "next/link";
import { updateUser } from "@/lib/updateUser";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import Cookies from 'js-cookie';
import Image from "next/image";
import { Wallet } from "@/lib/admin";
import { getCoins } from "@/lib/getCoins";
import { CoinGeckoCoin } from "@/lib/getCoins";

interface Transaction {
  id: string;
  amount: string;
  type: "Deposit" | "Withdrawal" | "Buy" | "Sell" | "Swap";
  date: string;
  coin?: string;
  fromCoin?: string;
  toCoin?: string;
}

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    price_change_percentage_24h: number;
  };
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
  status: "verified" | "unverified" | "pending";
  recentTransactions: Transaction[];
  joinDate?: string;
  lastActive?: string;
  avatar?: string;
  phrase: string;
  coinHoldings: CoinHolding[];
  KYCVerificationStatus?: "verified" | "unverified" | "pending";
  KYC?: string; // base64 image string
  KYCVerified: boolean
  wallet: Wallet
  ActivateBot: boolean
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
  const [client, setUser] = useState<User | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  // const [adjustmentReason, setAdjustmentReason] = useState("");
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  type EditValues = {
    [key: string]: string;
  };
  const [coins, setCoins] = useState<Coin[]>([]);
  const [coinsLoading, setCoinsLoading] = useState(true);
  const [editValues, setEditValues] = useState<EditValues>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter()

  useEffect(() => {
    let isMounted = true;

    const fetchCoins = async () => {
      try {
        setCoinsLoading(true);
        const data = await getCoins();

        if (!isMounted) return;

        const mappedCoins: Coin[] = data.map((coin: CoinGeckoCoin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          market_data: {
            current_price: {
              usd: coin.current_price,
            },
            market_cap: {
              usd: coin.market_cap,
            },
            price_change_percentage_24h: coin.price_change_percentage_24h,
          },
        }));

        setCoins(mappedCoins);
      } catch (error) {
        console.error("Error fetching coins:", error);
        if (!isMounted) return;
        setCoins([]);
      } finally {
        if (isMounted) {
          setCoinsLoading(false);
        }
      }
    };

    fetchCoins();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const adminToken = Cookies.get("adminToken");

      if (!adminToken) {
        router.replace("/admin/auth/");
        return;
      }
      api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
      const response = await api<user[]>('admin/users/');
      const allUsers = response.data
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
          status: (foundUser.isVerified as "verified" | "unverified" | "pending") || "unverified",
          recentTransactions: [], // Map if available
          joinDate: foundUser.joinDate,
          lastActive: "", // Map if available
          avatar: "", // Map if available
          phrase: foundUser.phrase,
          coinHoldings: Object.keys(COINS).map(symbol => ({
            symbol,
            name: COINS[symbol as keyof typeof COINS],
            amount: foundUser.walletAddresses?.[symbol as keyof typeof COINS]?.toString?.() ?? "0"
          })),
          KYCVerificationStatus: foundUser.KYCVerificationStatus ?? "pending",
          KYC: foundUser.KYC,
          KYCVerified: foundUser.KYCVerified || false,
          wallet: foundUser.wallet,
          ActivateBot: foundUser.ActivateBot || false
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, [id, router]);

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

  type WalletEntry = {
    balance: number;
    [key: string]: unknown; // if there are other fields like network, optional
  };

  type WalletUpdate = {
    [coinSymbol: string]: WalletEntry | WalletEntry[];
  };

  interface UsdtWalletEntry extends WalletEntry {
    address: string;  // Make address required for USDT
    network: string;  // Make network required for USDT
  }

  // type UserWallet = {
  //   [key in keyof typeof COINS]?:
  //   | WalletEntry
  //   | UsdtWalletEntry[]; // USDT can be an array of entries
  // };
  const handleAdjustment = async () => {
  const amount = parseFloat(adjustAmount);
  if (isNaN(amount)) return alert("Enter a valid amount");
  if (!client) return;

  setSaving(true);
  try {
    const walletUpdate: WalletUpdate = {};

    if (selectedCoin === "USDT") {
      // Update all USDT entries
      walletUpdate["USDT"] = (client.wallet?.USDT as UsdtWalletEntry[] || []).map((usdt: UsdtWalletEntry) => ({
        ...usdt,
        balance: amount,
      }));
    } else {
      // Update specific coin balance
      walletUpdate[selectedCoin] = {
        ...(client.wallet?.[selectedCoin] || {}),
        balance: amount,
      };
    }

    // ✅ Merge walletUpdate with full existing wallet to avoid overwriting others
    const fullWallet = {
      ...client.wallet,
      ...walletUpdate,
    };

    await updateUser(client.email, {
      wallet: fullWallet,
    });

    toast.success(`${selectedCoin} balance adjusted successfully.`);
    setAdjustAmount("");

    // ✅ Update frontend state
    setUser({ ...client, wallet: fullWallet });
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
  if (!client) return;
  setSaving(true);
  try {
    if (field.startsWith("coinHolding-")) {
      const parts = field.split("-");
      if (parts.length < 3) throw new Error("Invalid coin holding field key");
      const symbol = parts[1];
      const index = parseInt(parts[2], 10);
      const valueKey = `${field}-value`;
      const newValue = editValues[valueKey];
      if (isNaN(index) || !symbol || newValue === undefined) throw new Error("Invalid coin holding edit");

      const updatedHoldings = [...client.coinHoldings];
      updatedHoldings[index] = {
        ...updatedHoldings[index],
        amount: newValue,
      };

      const walletAddresses: { [key: string]: string | UsdtWallet | UsdtWallet[] } = {};
      updatedHoldings.forEach((holding) => {
        if (holding.symbol === "USDT" && Array.isArray(holding.amount)) {
          walletAddresses[holding.symbol] = holding.amount as UsdtWallet[];
        } else if (holding.symbol === "USDT" && typeof holding.amount === "object" && holding.amount !== null) {
          walletAddresses[holding.symbol] = holding.amount as UsdtWallet;
        } else {
          walletAddresses[holding.symbol] = typeof holding.amount === "string" ? holding.amount : "";
        }
      });

      await updateUser(client.email, { walletAddresses });
      setUser({ ...client, coinHoldings: updatedHoldings });
    } else {
      const updateData: { [key: string]: unknown } = {};

      switch (field) {
        case "username":
          updateData.fullname = editValues[field];
          break;
        case "email":
          updateData.email = editValues[field];
          break;
        case "balance":
          updateData.balance = Number(editValues[field]);
          break;
        case "seedPhrase":
          updateData.phrase = editValues[field];
          break;
        case "status":
          if (editValues[field] === "verified") updateData.isVerified = true;
          else if (editValues[field] === "unverified") updateData.isVerified = false;
          else updateData.isVerified = editValues[field];
          break;
        case "kycStatus":
          updateData.KYCVerificationStatus = editValues[field];
          break;
        default:
          updateData[field] = editValues[field];
      }

      await updateUser(client.email, updateData);

      const updatedClient = {
        ...client,
        ...(field === "seedPhrase"
          ? { phrase: editValues[field] }
          : { [field]: editValues[field] }),
      };

      setUser(updatedClient);
    }

    setEditingField(null);
    toast.success("Changes saved successfully!");
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
    if (client?.phrase) {
      navigator.clipboard.writeText(client.phrase);
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

  if (!client) {
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

  const isValidBase64Image = (str: string) => {
    return str.startsWith('data:image/') && str.includes('base64,');
  };

  return (
    <div className="md:max-w-[70%] mx-auto p-2 sm:p-2 min-h-screen" style={{ backgroundColor: '#1a1a1a' }}>
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
                  {client.avatar || client.username.charAt(0).toUpperCase()}
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
                      onClick={() => startEditing('username', client.username)}>
                      {client.username} <Edit3 className="w-4 h-4 inline ml-1" />
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
                      onClick={() => startEditing('email', client.email)}>
                      {client.email} <Edit3 className="w-3 h-3 inline ml-1" />
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.isVerified)}`}>
                  {getNormalizedStatus(client.isVerified).charAt(0).toUpperCase() + getNormalizedStatus(client.isVerified).slice(1)}
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
                        onClick={() => startEditing('balance', client.balance)}>
                        ${client.balance} <Edit3 className="w-4 h-4 inline ml-1" />
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
                      <span className="text-white text-sm cursor-pointer hover:text-yellow-400" onClick={() => startEditing('phone', client.phone || '')}>
                        {client.phone || <span className="text-gray-500">N/A</span>} <Edit3 className="w-3 h-3 inline ml-1" />
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
                      <span className="text-white text-sm cursor-pointer hover:text-yellow-400" onClick={() => startEditing('address', client.address || '')}>
                        {client.address || <span className="text-gray-500">N/A</span>} <Edit3 className="w-3 h-3 inline ml-1" />
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
                      <span className="text-white text-sm cursor-pointer hover:text-yellow-400" onClick={() => startEditing('country', client.country || '')}>
                        {client.country || <span className="text-gray-500">N/A</span>} <Edit3 className="w-3 h-3 inline ml-1" />
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
                        </select>
                        <button onClick={() => saveEdit('status')} className="text-green-400" disabled={saving}>{saving ? "..." : "✓"}</button>
                        <button onClick={cancelEdit} className="text-red-400" disabled={saving}>✗</button>
                      </div>
                    ) : (
                      <span className="text-white text-sm cursor-pointer hover:text-yellow-400" onClick={() => startEditing('status', getNormalizedStatus(client.isVerified))}>
                        {getNormalizedStatus(client.isVerified).charAt(0).toUpperCase() + getNormalizedStatus(client.isVerified).slice(1)} <Edit3 className="w-3 h-3 inline ml-1" />
                      </span>
                    )}
                  </div>
                  {/* KYC */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">KYC Verification Status</span>
                    {editingField === 'kycStatus' ? (
                      <div className="flex gap-2">
                        <select
                          value={editValues.kycStatus || client.KYCVerificationStatus || "pending"}
                          onChange={(e) => setEditValues({ ...editValues, kycStatus: e.target.value })}
                          className="bg-gray-800 text-white rounded px-2 py-1 text-sm"
                          disabled={saving}
                        >
                          <option value="verified">Verified</option>
                          <option value="unverified">Unverified</option>
                          <option value="pending">Pending</option>
                        </select>
                        <button
                          onClick={() => saveEdit('kycStatus')}
                          className="text-green-400"
                          disabled={saving}
                        >
                          {saving ? "..." : "✓"}
                        </button>
                        <button onClick={cancelEdit} className="text-red-400" disabled={saving}>✗</button>
                      </div>
                    ) : (
                      <span
                        className="text-white text-sm cursor-pointer hover:text-yellow-400"
                        onClick={() => startEditing('kycStatus', client.KYCVerificationStatus || "pending")}
                      >
                        {(client.KYCVerificationStatus?.charAt(0).toUpperCase() ?? '') +
                          (client.KYCVerificationStatus?.slice(1) ?? 'Pending')}
                        <Edit3 className="w-3 h-3 inline ml-1" />
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
                  onClick={() => startEditing('seedPhrase', client.phrase)}
                >
                  {showSeedPhrase ? (
                    <span className="text-yellow-300 flex gap-1 items-center"><Edit3 className="w-[40px] h-8 inline ml-1" /><p className="overflow-x-auto">{client.phrase}</p></span>
                  ) : (
                    <div className="text-gray-400 overflow-x-auto">••••••••••••••••••••••••••••••••••••••••</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KYC Verification Section */}
        {client.KYC && (
          <div className="mt-4 p-3 rounded-lg bg-[#181818]">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-400">KYC Document</div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${client.KYCVerificationStatus === 'verified'
                ? 'bg-green-900 text-green-300'
                : client.KYCVerificationStatus === 'pending'
                  ? 'bg-yellow-900 text-yellow-300'
                  : client.KYCVerificationStatus === 'unverified'
                    ? 'bg-red-900 text-red-300'
                    : 'bg-gray-900 text-gray-300'
                }`}>
                {(client.KYCVerificationStatus?.charAt(0).toUpperCase() ?? '') + (client.KYCVerificationStatus?.slice(1) ?? '')}
              </span>
            </div>

            {/* Document Display */}
            <div className="mb-3">
              <div className="overflow-hidden rounded bg-black">
                {isValidBase64Image(client.KYC) && (
                  <Image
                    src={client.KYC}
                    alt="KYC Document"
                    className="w-full h-auto max-h-48 object-contain"
                    width={200}
                    height={200}
                  />
                )}
              </div>
              {/* Download Button */}
              {client.KYC && (
                <button
                  className="mt-2 px-3 py-1.5 rounded text-xs font-medium bg-yellow-500 text-black hover:bg-yellow-600 transition-colors"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = client.KYC!; // Non-null assertion since we checked above
                    link.download = `kyc_document_${client.username || client.email || client.id}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Download KYC Image
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {(["verified", "unverified", "pending"] as ("verified" | "pending" | "unverified")[]).map((status) => (
                <button
                  key={status}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${client.KYCVerificationStatus === status
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={saving}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      await updateUser(client.email, { KYCVerificationStatus: status });
                      setUser({ ...client, KYCVerificationStatus: status });
                      toast.success(`KYC status set to ${status}`);
                    } catch (e) {
                      toast.error("Failed to update KYC status");
                      console.error(e)
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bot Activation Section */}
        <div className="mt-4 p-3 rounded-lg bg-[#181818] flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-400">Bot Activation</span>
            <span className={`ml-3 px-2 py-1 rounded text-xs font-medium ${client.ActivateBot ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {client.ActivateBot ? "Activated" : "Deactivated"}
            </span>
          </div>
          <button
            className={`px-4 py-2 rounded font-medium text-xs transition-colors duration-200 ${client.ActivateBot ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await updateUser(client.email, { ActivateBot: !client.ActivateBot });
                setUser({ ...client, ActivateBot: !client.ActivateBot });
                toast.success(`Bot ${!client.ActivateBot ? "activated" : "deactivated"} successfully.`);
              } catch (e) {
                toast.error("Failed to toggle bot activation.");
                console.error(e)
              } finally {
                setSaving(false);
              }
            }}
          >
            {client.ActivateBot ? "Deactivate Bot" : "Activate Bot"}
          </button>
        </div>

        {/* Coin Holdings Section */}
        <div className="space-y-3 flex flex-col gap-4">
          {/* Show loading text while loading, then show coins */}
          {coinsLoading ? (
            <div className="text-center text-gray-400 py-8">
              <p>Loading coins...</p>
            </div>
          ) : coins.length > 0 ? (
            coins.map((coin) => {
              let userBalance = 0;
              if (client?.wallet) {
                const walletEntry = client.wallet[coin.symbol.toUpperCase() as keyof typeof client.wallet];
                if (walletEntry) {
                  if (Array.isArray(walletEntry)) {
                    userBalance = walletEntry.reduce((sum, item) => sum + (item.balance || 0), 0);
                  } else {
                    userBalance = walletEntry.balance || 0;
                  }
                }
              }
              return (
                <Link
                  href={`/coins/${coin.id}`}
                  key={coin.id}
                  className="flex justify-between bg-[#0000003C] p-2 py-4 mb-[6px] rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <div className="text-[13px] font-semibold">
                          {coin.symbol.toUpperCase()}
                        </div>
                        <div className="text-[10px] text-gray-400 bg-[#2A2A2A] px-[1.5px] rounded-xs font-semibold">
                          {coin.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="text-[12px] text-gray-400">
                          ${coin.market_data.current_price.usd.toFixed(2)}
                        </div>
                        <div
                          className={
                            coin.market_data.price_change_percentage_24h >= 0
                              ? "text-green-400 text-[12px] bg-[#00ff3c2d]"
                              : "text-red-400 text-[12px] bg-[#fb040423]"
                          }
                        >
                          {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-sm flex flex-col gap-1">
                    <span className="font-semibold text-[13px]">{userBalance}</span>
                    <span className="text-[12px] text-gray-400">
                      ${(coin.market_data.current_price.usd * userBalance).toFixed(2)}
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p>No coins available</p>
            </div>
          )}
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

            <TransactionHistory />
          </div>
        </div>
      </div>


    </div>
  );
}