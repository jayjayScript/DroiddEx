"use client";
import React, { useState } from "react";
import { ChevronDown, Check, Send, Info, Copy, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const coinOptions = [
  { id: "btc", name: "Bitcoin", networks: ["Bitcoin"], icon: "₿" },
  { id: "eth", name: "Ethereum", networks: ["ERC20", "BEP20"], icon: "Ξ" },
  { id: "usdt", name: "USDT", networks: ["ERC20", "TRC20", "BEP20"], icon: "₮" },
  { id: "bnb", name: "BNB", networks: ["BEP20"], icon: "🔶" },
  { id: "sol", name: "Solana", networks: ["Solana"], icon: "◎" },
];

const Dropdown = ({
  label,
  options,
  selected,
  setSelected,
  coinData,
}: {
  label: string;
  options: string[];
  selected: string;
  setSelected: (val: string) => void;
  coinData?: typeof coinOptions;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block mb-3 text-sm font-medium text-gray-300">
        {label}
      </label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-4 rounded-xl bg-[#2A2A2A] text-white border border-[#3A3A3A] hover:border-[#ebb70c] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ebb70c]/50"
      >
        <div className="flex items-center space-x-3">
          {coinData && (
            <span className="text-lg">
              {coinData.find(c => c.name === selected)?.icon || ""}
            </span>
          )}
          <span className="font-medium">{selected}</span>
        </div>
        <ChevronDown 
          size={18} 
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      
      {open && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setOpen(false)}
          />
          <div className="absolute z-20 mt-2 w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl shadow-2xl max-h-60 overflow-y-auto">
            <div className="py-2">
              {options.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setSelected(option);
                    setOpen(false);
                  }}
                  className={`p-4 hover:bg-[#3A3A3A] cursor-pointer flex justify-between items-center transition-colors duration-150 ${
                    selected === option ? "bg-[#3A3A3A] border-r-2 border-[#ebb70c]" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {coinData && (
                      <span className="text-lg">
                        {coinData.find(c => c.name === option)?.icon || ""}
                      </span>
                    )}
                    <span className="font-medium">{option}</span>
                  </div>
                  {selected === option && (
                    <Check size={16} className="text-[#ebb70c]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(coinOptions[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(coinOptions[0]!.networks[0]);
  const [showAddress, setShowAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!amount || isNaN(+amount) || +amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    if (!address.trim()) {
      toast.error("Enter a valid address");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Withdrawing ${amount} ${selectedCoin.name} via ${selectedNetwork}`);
      setIsLoading(false);
      // Reset form
      setAmount("");
      setAddress("");
    }, 2000);
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text);
      toast.success("Address pasted from clipboard");
    } catch (err) {
      toast.error("Failed to paste from clipboard");
    }
  };

  const estimatedFee = selectedNetwork === "Bitcoin" ? 0.0005 : 
                      selectedNetwork === "Ethereum" || selectedNetwork === "ERC20" ? 0.002 :
                      selectedNetwork === "TRC20" ? 1 : 0.001;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-2xl mx-auto px-2 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ebb70c]/10 rounded-full mb-4">
            <Send className="w-8 h-8 text-[#ebb70c]" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Send Crypto</h2>
          <p className="text-gray-400">
            Send cryptocurrency to any wallet address
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 space-y-6">
          
          {/* Amount Input */}
          <div>
            <label className="block mb-3 text-sm font-medium text-gray-300">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-4 pr-20 rounded-xl bg-[#2A2A2A] text-white text-lg border border-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#ebb70c] focus:border-transparent placeholder-gray-500 transition-all duration-200"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <span className="text-lg">{selectedCoin.icon}</span>
                <span className="text-gray-400 font-medium">{selectedCoin.name}</span>
              </div>
            </div>
            {amount && (
              <p className="text-xs text-gray-500 mt-2">
                ≈ ${(parseFloat(amount || "0") * 45000).toLocaleString()} USD
              </p>
            )}
          </div>

          {/* Coin Selection */}
          <Dropdown
            label="Select Coin"
            options={coinOptions.map((c) => c.name)}
            selected={selectedCoin.name}
            setSelected={(coinName) => {
              const coin = coinOptions.find((c) => c.name === coinName)!;
              setSelectedCoin(coin);
              setSelectedNetwork(coin.networks[0]);
            }}
            coinData={coinOptions}
          />

          {/* Network Selection */}
          <Dropdown
            label="Select Network"
            options={selectedCoin.networks}
            selected={selectedNetwork}
            setSelected={setSelectedNetwork}
          />

          {/* Address Input */}
          <div>
            <label className="block mb-3 text-sm font-medium text-gray-300">
              Recipient Address
            </label>
            <div className="relative">
              <input
                type={showAddress ? "text" : "password"}
                placeholder="Enter wallet address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-4 pr-24 rounded-xl bg-[#2A2A2A] text-white border border-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#ebb70c] focus:border-transparent placeholder-gray-500 transition-all duration-200"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="p-2 hover:bg-[#3A3A3A] rounded-lg transition-colors"
                  title={showAddress ? "Hide address" : "Show address"}
                >
                  {showAddress ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={pasteFromClipboard}
                  className="p-2 hover:bg-[#3A3A3A] rounded-lg transition-colors"
                  title="Paste from clipboard"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Make sure the address is correct. Transactions cannot be reversed.
            </p>
          </div>

          {/* Transaction Summary */}
          {amount && address && (
            <div className="bg-[#2A2A2A] rounded-lg p-4 border border-[#3A3A3A]">
              <h3 className="font-medium text-gray-300 mb-3">Transaction Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">{amount} {selectedCoin.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee:</span>
                  <span className="text-white">{estimatedFee} {selectedCoin.name}</span>
                </div>
                <div className="border-t border-[#3A3A3A] pt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-300">Total:</span>
                    <span className="text-white">
                      {(parseFloat(amount) + estimatedFee).toFixed(6)} {selectedCoin.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={handleWithdraw}
            disabled={isLoading || !amount || !address}
            className="w-full bg-[#ebb70c] hover:bg-[#ffc107] disabled:bg-[#ebb70c]/50 disabled:cursor-not-allowed text-black font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-lg shadow-lg flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Send {selectedCoin.name}</span>
              </>
            )}
          </button>

          {/* Security Notice */}
          <div className="bg-[#2A2A2A] rounded-xl p-4 border border-[#3A3A3A]">
            <div className="flex items-start space-x-3">
              <Info className="text-[#ebb70c] text-lg flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-400">
                <p className="font-medium text-gray-300 mb-1">Security Notice:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Double-check the recipient address before sending</li>
                  <li>Ensure you're using the correct network</li>
                  <li>Transactions are irreversible once confirmed</li>
                  <li>Start with a small test amount for new addresses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;