"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { buyCoins } from "@/components/constants";
import Link from "next/link";
// Import your real wallet address data source
import { walletAddresses } from "@/lib/wallet"; // Adjust the path if needed

// Build coins array from walletAddresses
const coins = Object.keys(walletAddresses).map((symbol) => {
  const walletData = walletAddresses[symbol];
  return {
    symbol,
    name: (Array.isArray(walletData) ? walletData[0]?.name : walletData?.name) || symbol,
    addresses: Array.isArray(walletData) ? walletData : [walletData],
  };
});

const Buy = () => {
  const [selected, setSelected] = useState(coins[0]);
  const [amount, setAmount] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selected.addresses[0]?.address || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Buy Crypto
          </h1>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Coin Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium mb-3 text-white">
              Select Coin
            </label>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full p-4 bg-[#2A2A2A] rounded-xl flex justify-between items-center 
                         hover:bg-[#333333] transition-all duration-200 ease-in-out
                         focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              >
                <span className="text-lg font-medium">{selected.symbol}</span>
                <Icon
                  icon="mdi:chevron-down"
                  className={`text-2xl transition-transform duration-300 ease-in-out ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 right-0 mt-2 bg-[#2A2A2A] rounded-xl 
                          overflow-hidden z-20
                          transition-all duration-300 ease-in-out transform
                          ${showDropdown 
                            ? "opacity-100 translate-y-0 scale-100" 
                            : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                          }`}
              >
                {coins.map((coin, index) => (
                  <div
                    key={coin.symbol}
                    onClick={() => {
                      setSelected(coin);
                      setShowDropdown(false);
                    }}
                    className={`px-4 py-3 hover:bg-[#3A3A3A] cursor-pointer transition-colors duration-200
                              ${index !== coins.length - 1 ? "border-b border-[#3A3A3A]" : ""}
                              ${selected.symbol === coin.symbol ? "bg-[#3A3A3A] text-white" : ""}`}
                  >
                    <span className="font-medium">{coin.symbol}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium mb-3 text-white">
              Enter Amount (USD)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 100"
                className="w-full p-4 bg-[#2A2A2A] rounded-xl text-white text-lg
                         outline-none
                         hover:bg-[#333333] focus:bg-[#333333]
                         transition-all duration-200 ease-in-out
                         placeholder:text-gray-500"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Icon icon="mdi:currency-usd" className="text-xl" />
              </div>
            </div>
          </div>

          {/* Wallet Display */}
          <div className="bg-[#2A2A2A] rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Wallet Address for {selected.symbol}
                </h3>
                <div className="bg-[#1A1A1A] rounded-lg p-3">
                  <code className="text-sm text-white break-all font-mono">
                    {selected.addresses[0]?.address || "No address available"}
                  </code>
                </div>
              </div>

              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium
                          transition-all duration-300 ease-in-out transform
                          ${copied 
                            ? "bg-[#4A4A4A] hover:bg-[#5A5A5A] scale-105" 
                            : "bg-[#3A3A3A] hover:bg-[#4A4A4A] hover:scale-105"
                          }
                          active:scale-95`}
              >
                <Icon 
                  icon={copied ? "mdi:check" : "mdi:content-copy"} 
                  className="text-xl" 
                />
                <span className="whitespace-nowrap">
                  {copied ? "Copied!" : "Copy"}
                </span>
              </button>
            </div>
          </div>

          {/* Purchase Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Buy from:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {buyCoins.map((site, index) => (
                <Link
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#2A2A2A] 
                           rounded-xl p-4
                           hover:bg-[#3A3A3A]
                           transition-all duration-300 ease-in-out transform
                           hover:scale-105 active:scale-95"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium group-hover:text-white transition-colors duration-200">
                      {site.name}
                    </span>
                    <Icon
                      icon="mdi:external-link"
                      className="text-xl text-gray-400 group-hover:text-white 
                               transition-all duration-200 transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-8 sm:h-12"></div>
      </div>

      {/* Overlay for dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default Buy;