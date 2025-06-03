"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

const coins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", icon: "/icons/btc.png" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: "/icons/eth.png" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", icon: "/icons/doge.png" },
  { id: "solana", name: "Solana", symbol: "SOL", icon: "/icons/sol.png" },
];

const walletAddress = "0x92e3...f91a7d";

const Send = () => {
  const [selected, setSelected] = useState(coins[0]);
  const [amount, setAmount] = useState("");
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSend = () => {
    if (amount) {
      toast(`You marked $${amount} as sent.`);
      // You can also trigger API calls or state updates here
      setAmount("");
    } else {
      toast("Please enter an amount.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Wallet address copied!");
  };

  return (
    <div className="min-h-screen p-6 text-white  pb-24">
      <h1 className="text-xl font-semibold mb-6">Receive Crypto</h1>

      <label className="block mb-2 text-sm text-gray-400">Choose Coin</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className={`flex flex-col items-center p-4 rounded-lg cursor-pointer border transition ${
              selected.id === coin.id
                ? "border-[#ebb70c] bg-[#1F1F1F]"
                : "border-[#2A2A2A] bg-[#1A1A1A]"
            }`}
            onClick={() => setSelected(coin)}
          >
            <Image src={coin.icon} alt={coin.name} width={30} height={30} />
            <p className="mt-2 text-sm">{coin.symbol}</p>
          </div>
        ))}
      </div>

      <div className="text-white space-y-4 bg-[#1A1A1A] rounded-lg my-4">
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
          <span className="truncate">{walletAddress}</span>
          <button onClick={handleCopy}>
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

export default Send;
