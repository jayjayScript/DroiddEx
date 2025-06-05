// app/deposit/page.tsx
"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { walletAddresses } from "@/lib/wallet";
import { coinIdMap, coins as supportedCoins } from "@/lib/wallet";

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

  

const Deposit = () => {
  const coins = Object.keys(walletAddresses).map((symbol) => {
    const typedSymbol = symbol as keyof typeof coinIdMap;
    return {
      id: coinIdMap[typedSymbol],
      symbol,
      name: walletAddresses[symbol][0]?.name || symbol,
      icon: iconMap[symbol] || "cryptocurrency:question",
      addresses: walletAddresses[symbol],
    };
  });

  const [selected, setSelected] = useState(coins[0]);
  const [amount, setAmount] = useState("");
  const [fileName, setFileName] = useState("");

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
    <div className="min-h-screen p-2 text-white pb-[3rem]">
      <h1 className="text-xl font-semibold mb-6">Receive Crypto</h1>

      <label className="block mb-2 text-sm text-gray-400">Choose Coin</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {coins.map((coin) => (
          <div
            key={coin.symbol}
            className={`flex flex-col items-center p-4 rounded-lg cursor-pointer border transition ${
              selected.symbol === coin.symbol
                ? "border-[#ebb70c] bg-[#1F1F1F]"
                : "border-[#2A2A2A] bg-[#1A1A1A]"
            }`}
            onClick={() => setSelected(coin)}
          >
            <Icon icon={coin.icon} width={30} height={30} />
            <p className="mt-2 text-sm">{coin.symbol}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4 bg-[#1A1A1A] rounded-lg p-1 mb-6">
        <label className="block text-sm text-gray-400 mb-1">
          {selected.symbol} Amount
        </label>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#2A2A2A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ebb70c]"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">
          Wallet Address
        </label>
        <div className="flex items-center justify-between bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-3 rounded-lg">
          <span className="truncate">{selected.addresses[0]?.address || ""}</span>
          <button onClick={() => handleCopy(selected.addresses[0]?.address || "")}>
            <Icon
              icon="tabler:copy"
              className="text-xl text-gray-300 hover:text-white transition cursor-pointer"
            />
          </button>
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="screenshot" className="block text-sm text-gray-400 mb-2">
          Upload Transaction Screenshot
        </label>

        <div className="relative flex items-center justify-center bg-[#2a2a2a] border border-[#444] rounded-lg p-4 hover:bg-[#333] transition cursor-pointer">
          <input
            type="file"
            id="screenshot"
            name="screenshot"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />

          <div className="flex items-center gap-3 text-white pointer-events-none">
            <Icon icon="ic:baseline-photo" className="text-[#ebb70c]" width="54" height="54" />
            <span className="block text-sm text-gray-400 mb-2">{fileName || 'Click to select a screenshot (PNG, JPG, JPEG)'}</span>
          </div>
        </div>

        {fileName && (
          <p className="text-xs text-green-400 mt-2">✔ {fileName} selected</p>
        )}
      </div>

      <button className="w-full bg-[#ebb70c] hover:bg-[#ffcc3f] text-black py-3 rounded-lg font-semibold transition mt-6">
        Continue
      </button>
      <button
        onClick={handleSend}
        className="w-full my-2 bg-[#ebb70c] text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition-all"
      >
        I’ve sent this amount of {selected.symbol}
      </button>
    </div>
  );
};

export default Deposit;
