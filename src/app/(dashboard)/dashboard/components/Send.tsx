// app/deposit/page.tsx
"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { walletAddresses } from "@/lib/wallet";
import { coinIdMap} from "@/lib/wallet";

// Define proper types
type WalletAddress = {
  address: string;
  name?: string;
};

type CoinData = {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  addresses: WalletAddress[];
};

type CoinDropdownProps = {
  coins: CoinData[];
  selected: CoinData;
  onSelect: (coin: CoinData) => void;
};

// Use Iconify coin set
const iconMap: Record<string, string> = {
  BTC: "cryptocurrency:btc",
  ETH: "cryptocurrency:eth",
  SOL: "cryptocurrency:sol",
  BNB: "cryptocurrency:bnb",
  XRP: "cryptocurrency:xrp",
  LTC: "cryptocurrency:ltc",
  XLM: "cryptocurrency:xlm",
  TRX: "cryptocurrency:trx",
  DOGE: "cryptocurrency:doge",
  ADA: "cryptocurrency:ada",
  USDT: "cryptocurrency:usdt",
  USDC: "cryptocurrency:usdc",
  SHIBA: "cryptocurrency:shib",
  PEPE: "cryptocurrency:pepe",
};

const CoinDropdown = ({ coins, selected, onSelect }: CoinDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (coin: CoinData) => {
    onSelect(coin);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 hover:border-[#ebb70c] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ebb70c]/50"
      >
        <div className="flex items-center space-x-3">
          <Icon icon={selected.icon} width={28} height={28} />
          <div className="text-left">
            <p className="text-white font-medium">{selected.symbol}</p>
            <p className="text-gray-400 text-sm">{selected.name}</p>
          </div>
        </div>
        <Icon 
          icon={isOpen ? "ic:baseline-keyboard-arrow-up" : "ic:baseline-keyboard-arrow-down"} 
          className="text-gray-400 text-xl transition-transform duration-200"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
          <div className="py-2">
            {coins.map((coin) => (
              <button
                key={coin.symbol}
                onClick={() => handleSelect(coin)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-[#2A2A2A] transition-colors duration-150 ${
                  selected.symbol === coin.symbol 
                    ? "bg-[#2A2A2A] border-r-2 border-[#ebb70c]" 
                    : ""
                }`}
              >
                <Icon icon={coin.icon} width={24} height={24} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium">{coin.symbol}</p>
                  <p className="text-gray-400 text-sm truncate">{coin.name}</p>
                </div>
                {selected.symbol === coin.symbol && (
                  <Icon icon="ic:baseline-check" className="text-[#ebb70c] text-lg flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const Deposit = () => {
  const coins: CoinData[] = Object.keys(walletAddresses).map((symbol) => {
    const typedSymbol = symbol as keyof typeof coinIdMap;
    const walletData = walletAddresses[symbol as keyof typeof walletAddresses];
    
    return {
      id: coinIdMap[typedSymbol],
      symbol,
      name: (Array.isArray(walletData) ? (walletData[0] as WalletAddress)?.name : (walletData as WalletAddress)?.name) || symbol,
      icon: iconMap[symbol] || "cryptocurrency:question",
      addresses: Array.isArray(walletData) ? walletData : [walletData],
    };
  });

  const [selected, setSelected] = useState<CoinData>(coins[0]);
  const [amount, setAmount] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Wallet address copied!");
  };

  const handleSend = () => {
    if (amount) {
      toast.success(`You marked $${amount} as sent.`);
      setAmount("");
    } else {
      toast.error("Please enter an amount.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Receive Crypto</h1>
          <p className="text-gray-400 text-sm md:text-base">
            Select a cryptocurrency and follow the steps to complete your deposit
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Coin Selection & Amount */}
          <div className="space-y-6">
            {/* Coin Selection Dropdown */}
            <div>
              <label className="block mb-4 text-sm font-medium text-gray-300">
                Choose Cryptocurrency
              </label>
              <CoinDropdown 
                coins={coins} 
                selected={selected} 
                onSelect={setSelected} 
              />
            </div>

            {/* Amount Input */}
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {selected.symbol} Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-4 rounded-lg bg-[#2A2A2A] text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ebb70c] focus:border-transparent border border-transparent transition-all"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <Icon icon={selected.icon} width={20} height={20} />
                  <span className="text-gray-400 text-sm font-medium">{selected.symbol}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Wallet Address & Upload */}
          <div className="space-y-6">
            {/* Wallet Address */}
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {selected.symbol} Wallet Address
              </label>
              <div className="flex items-center justify-between bg-[#2A2A2A] border border-[#3A3A3A] px-4 py-4 rounded-lg group hover:border-[#ebb70c] transition-colors">
                <span className="text-sm font-mono truncate pr-4 flex-1">
                  {selected.addresses[0]?.address || "No address available"}
                </span>
                <button 
                  onClick={() => handleCopy(selected.addresses[0]?.address || "")}
                  className="flex-shrink-0 p-2 rounded-md hover:bg-[#3A3A3A] transition-colors"
                  title="Copy address"
                >
                  <Icon
                    icon="tabler:copy"
                    className="text-xl text-gray-400 hover:text-[#ebb70c] transition-colors"
                  />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Send only {selected.symbol} to this address. Other tokens may be lost permanently.
              </p>
            </div>

            {/* File Upload */}
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Transaction Proof
              </label>
              
              <div className="relative">
                <input
                  type="file"
                  id="screenshot"
                  name="screenshot"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                />
                
                <div className={`flex flex-col items-center justify-center bg-[#2A2A2A] border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer hover:bg-[#333] ${
                  fileName ? 'border-green-500 bg-green-500/5' : 'border-[#444] hover:border-[#ebb70c]'
                }`}>
                  <div className="mb-4">
                    <Icon 
                      icon={fileName ? "ic:baseline-check-circle" : "ic:baseline-photo"} 
                      className={`text-6xl ${fileName ? 'text-green-400' : 'text-[#ebb70c]'}`}
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-white font-medium mb-2">
                      {fileName ? 'File Selected!' : 'Upload Screenshot'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {fileName || 'Click to select a screenshot (PNG, JPG, JPEG)'}
                    </p>
                  </div>
                </div>
              </div>

              {fileName && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon icon="ic:baseline-check" className="text-green-400" />
                    <span className="text-green-400 text-sm font-medium">
                      {fileName}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <button
            onClick={handleSend}
            className="w-full bg-[#ebb70c] hover:bg-[#ffcc3f] text-black font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-lg shadow-lg"
          >
            I&apos;ve sent {amount || '0'} {selected.symbol}
          </button>
          
          <button className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 border border-[#444] hover:border-[#555]">
            Continue
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A]">
          <div className="flex items-start space-x-3">
            <Icon icon="ic:baseline-info" className="text-[#ebb70c] text-xl flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-400">
              <p className="font-medium text-gray-300 mb-1">Important Notes:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Ensure you send the exact amount specified</li>
                <li>Upload a clear screenshot of your transaction</li>
                <li>Deposits may take 10-30 minutes to confirm</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;