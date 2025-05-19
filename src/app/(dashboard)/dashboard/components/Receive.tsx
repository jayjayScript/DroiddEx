"use client";
import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

const coinOptions = [
  { id: "btc", name: "Bitcoin", networks: ["Bitcoin"] },
  { id: "eth", name: "Ethereum", networks: ["ERC20", "BEP20"] },
  { id: "usdt", name: "USDT", networks: ["ERC20", "TRC20", "BEP20"] },
  { id: "bnb", name: "BNB", networks: ["BEP20"] },
  { id: "sol", name: "Solana", networks: ["Solana"] },
];

const Dropdown = ({
  label,
  options,
  selected,
  setSelected,
}: {
  label: string;
  options: string[];
  selected: string;
  setSelected: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block mb-2 text-sm text-gray-300">{label}</label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-3 rounded-lg bg-[#2A2A2A] text-white"
      >
        {selected}
        <ChevronDown size={18} />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-[#2A2A2A] rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
              className={`p-3 hover:bg-[#3A3A3A] cursor-pointer flex justify-between ${
                selected === option ? "bg-[#3A3A3A]" : ""
              }`}
            >
              {option}
              {selected === option && <Check size={16} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(coinOptions[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(coinOptions[0].networks[0]);

  const handleWithdraw = () => {
    if (!amount || isNaN(+amount) || +amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    alert(`Withdrawing ${amount} ${selectedCoin.name} via ${selectedNetwork}`);
  };

  return (
    <div className="text-white bg-[#1A1A1A] p-6 rounded-lg w-full max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-bold text-center">Send</h2>

      {/* Amount */}
      <div>
        <label className="block mb-2 text-sm text-gray-300">Amount</label>
        <input
          type="number"
          min="0"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#2A2A2A] text-white"
        />
      </div>

      {/* Coin Dropdown */}
      <Dropdown
        label="Select Coin"
        options={coinOptions.map((c) => c.name)}
        selected={selectedCoin.name}
        setSelected={(coinName) => {
          const coin = coinOptions.find((c) => c.name === coinName)!;
          setSelectedCoin(coin);
          setSelectedNetwork(coin.networks[0]);
        }}
      />

      {/* Network Dropdown */}
      <Dropdown
        label="Select Network"
        options={selectedCoin.networks}
        selected={selectedNetwork}
        setSelected={setSelectedNetwork}
      />

      {/* Withdraw Button */}
      <button
        onClick={handleWithdraw}
        className="w-full bg-[#ebb70c] text-black font-semibold py-3 rounded-lg hover:bg-[#ffc107] transition"
      >
        Send
      </button>
    </div>
  );
};

export default Withdraw;
