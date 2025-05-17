import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface Coin {
  symbol: string;
}

const Swap = ({ coins }: { coins: Coin[] }) => {
  const [fromCoin, setFromCoin] = useState("BTC");
  const [toCoin, setToCoin] = useState("ETH");
  const [amount, setAmount] = useState("");

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  return (
    <div className="bg-[#1A1A1A] p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4 text-white">Swap Coins</h2>

      {/* FROM Dropdown */}
      <div className="mb-4 relative">
        <label className="text-white text-sm block mb-2">From:</label>
        <div
          className="bg-[#2A2A2A] text-white p-2 rounded flex justify-between items-center cursor-pointer"
          onClick={() => setShowFromDropdown(!showFromDropdown)}
        >
          {fromCoin.toUpperCase()}
          <Icon icon="ic:round-arrow-drop-down" />
        </div>
        {showFromDropdown && (
          <div className="absolute bg-[#2A2A2A] w-full mt-1 rounded shadow z-10">
            {coins.map((coin) => (
              <div
                key={coin.symbol}
                onClick={() => {
                  setFromCoin(coin.symbol.toUpperCase());
                  setShowFromDropdown(false);
                }}
                className="p-2 hover:bg-[#3A3A3A] cursor-pointer"
              >
                {coin.symbol.toUpperCase()}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TO Dropdown */}
      <div className="mb-4 relative">
        <label className="text-white text-sm block mb-2">To:</label>
        <div
          className="bg-[#2A2A2A] text-white p-2 rounded flex justify-between items-center cursor-pointer"
          onClick={() => setShowToDropdown(!showToDropdown)}
        >
          {toCoin.toUpperCase()}
          <Icon icon="ic:round-arrow-drop-down" />
        </div>
        {showToDropdown && (
          <div className="absolute bg-[#2A2A2A] w-full mt-1 rounded shadow z-10">
            {coins.map((coin) => (
              <div
                key={coin.symbol}
                onClick={() => {
                  setToCoin(coin.symbol.toUpperCase());
                  setShowToDropdown(false);
                }}
                className="p-2 hover:bg-[#3A3A3A] cursor-pointer"
              >
                {coin.symbol.toUpperCase()}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AMOUNT */}
      <div className="mb-4">
        <label className="text-white text-sm block mb-2">Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 rounded bg-[#2A2A2A] text-white outline-none"
          placeholder="Enter amount"
        />
      </div>

      <button className="w-full bg-[#ebb70c] hover:bg-[#deb574] transition text-black font-semibold p-2 rounded cursor-pointer">
        Swap {fromCoin} to {toCoin}
      </button>
    </div>
  );
};

export default Swap;
