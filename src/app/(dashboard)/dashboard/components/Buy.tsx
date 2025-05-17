"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";

const Buy = () => {
  const [coin, setCoin] = useState("Bitcoin");
  const [amount, setAmount] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const walletAddresses: Record<string, string> = {
    Bitcoin: "bc1qxyz123bitcoinwallet",
    Ethereum: "0xABCDEF123ethereum",
    USDT: "TXYZ1234567usdtwallet",
    Solana: "solXYZ789solwallet",
  };

  const coinList = Object.keys(walletAddresses);

  const purchaseLinks = [
    { name: "Binance", url: "https://www.binance.com/" },
    { name: "Coinbase", url: "https://www.coinbase.com/" },
    { name: "Kraken", url: "https://www.kraken.com/" },
    { name: "KuCoin", url: "https://www.kucoin.com/" },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddresses[coin]);
    alert(`${coin} wallet address copied!`);
  };

  return (
    <div className="text-white relative">
      <h2 className="text-xl font-bold mb-4">Buy Crypto</h2>

      <div className="space-y-4">
        {/* Custom Dropdown */}
        <div className="relative">
          <label className="block text-sm mb-1">Select Coin</label>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full p-2 bg-[#2A2A2A] rounded-lg flex justify-between items-center"
          >
            <span>{coin}</span>
            <Icon icon="mdi:chevron-down" className="text-xl" />
          </button>

          {showDropdown && (
            <ul className="absolute z-10 mt-1 w-full bg-[#2A2A2A] rounded-lg shadow-lg border border-[#444]">
              {coinList.map((item) => (
                <li
                  key={item}
                  onClick={() => {
                    setCoin(item);
                    setShowDropdown(false);
                  }}
                  className="px-4 py-2 hover:bg-[#3A3A3A] cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm mb-1">Enter Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 100"
            className="w-full p-2 bg-[#2A2A2A] rounded-lg text-white outline-none"
          />
        </div>

        {/* Wallet Display */}
        <div className="bg-[#2A2A2A] p-4 rounded-lg flex justify-between items-center mt-4">
          <div>
            <div className="text-sm text-gray-400">Wallet Address for {coin}</div>
            <div className="text-xs break-all">{walletAddresses[coin]}</div>
          </div>
          <button
            onClick={copyToClipboard}
            className="bg-[#ebb70c] px-4 py-2 text-xs text-black font-bold rounded-lg"
          >
            Copy
          </button>
        </div>

        {/* Purchase Links */}
        <div className="mt-6">
          <h3 className="text-sm mb-2">Buy from:</h3>
          <div className="grid grid-cols-2 gap-4">
            {purchaseLinks.map((site) => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2A2A2A] hover:bg-[#333] text-center p-3 rounded-lg text-sm"
              >
                {site.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;
