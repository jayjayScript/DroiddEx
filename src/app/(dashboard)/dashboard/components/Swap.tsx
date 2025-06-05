import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

interface Coin {
  symbol: string;
  name?: string;
  icon?: string;
  price?: number;
}

const coinData: Record<string, { name: string; icon: string; price: number }> = {
  BTC: { name: "Bitcoin", icon: "cryptocurrency:btc", price: 45000 },
  ETH: { name: "Ethereum", icon: "cryptocurrency:eth", price: 2800 },
  SOL: { name: "Solana", icon: "cryptocurrency:sol", price: 95 },
  BNB: { name: "BNB", icon: "cryptocurrency:bnb", price: 310 },
  XRP: { name: "XRP", icon: "cryptocurrency:xrp", price: 0.52 },
  ADA: { name: "Cardano", icon: "cryptocurrency:ada", price: 0.38 },
  USDT: { name: "Tether", icon: "cryptocurrency:usdt", price: 1 },
  USDC: { name: "USD Coin", icon: "cryptocurrency:usdc", price: 1 },
  DOGE: { name: "Dogecoin", icon: "cryptocurrency:doge", price: 0.08 },
  LTC: { name: "Litecoin", icon: "cryptocurrency:ltc", price: 72 },
};

const CoinDropdown = ({
  label,
  selectedCoin,
  onSelect,
  coins,
  isOpen,
  onToggle,
  excludeCoin,
}: {
  label: string;
  selectedCoin: string;
  onSelect: (coin: string) => void;
  coins: Coin[];
  isOpen: boolean;
  onToggle: () => void;
  excludeCoin?: string;
}) => {
  const filteredCoins = coins.filter(coin => coin.symbol !== excludeCoin);
  const selectedData = coinData[selectedCoin];

  return (
    <div className="relative">
      <label className="block mb-3 text-sm font-medium text-gray-300">
        {label}
      </label>
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 rounded-xl bg-[#2A2A2A] text-white border border-[#3A3A3A] hover:border-[#ebb70c] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ebb70c]/50"
      >
        <div className="flex items-center space-x-3">
          <Icon icon={selectedData?.icon || "cryptocurrency:question"} width={28} height={28} />
          <div className="text-left">
            <p className="font-medium">{selectedCoin}</p>
            <p className="text-sm text-gray-400">{selectedData?.name}</p>
          </div>
        </div>
        <Icon 
          icon="ic:round-arrow-drop-down" 
          className={`text-xl transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={onToggle}
          />
          <div className="absolute z-20 mt-2 w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl shadow-2xl max-h-60 overflow-y-auto">
            <div className="py-2">
              {filteredCoins.map((coin) => {
                const data = coinData[coin.symbol];
                return (
                  <button
                    key={coin.symbol}
                    onClick={() => {
                      onSelect(coin.symbol);
                      onToggle();
                    }}
                    className={`w-full flex items-center justify-between p-4 hover:bg-[#3A3A3A] transition-colors duration-150 text-left ${
                      selectedCoin === coin.symbol ? "bg-[#3A3A3A] border-r-2 border-[#ebb70c]" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon icon={data?.icon || "cryptocurrency:question"} width={24} height={24} />
                      <div>
                        <p className="font-medium text-white">{coin.symbol}</p>
                        <p className="text-sm text-gray-400">{data?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-300">${data?.price?.toLocaleString()}</p>
                      {selectedCoin === coin.symbol && (
                        <Icon icon="ic:baseline-check" className="text-[#ebb70c] text-lg" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Swap = ({ coins }: { coins: Coin[] }) => {
  const [fromCoin, setFromCoin] = useState("BTC");
  const [toCoin, setToCoin] = useState("ETH");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [slippage, setSlippage] = useState("0.5");

  // Calculate exchange rate and estimated output
  useEffect(() => {
    if (fromAmount && !isNaN(Number(fromAmount))) {
      const fromPrice = coinData[fromCoin]?.price || 0;
      const toPrice = coinData[toCoin]?.price || 0;
      
      if (fromPrice && toPrice) {
        const exchangeRate = fromPrice / toPrice;
        const estimated = (Number(fromAmount) * exchangeRate).toFixed(6);
        setToAmount(estimated);
      }
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromCoin, toCoin]);

  const handleSwapCoins = () => {
    const tempCoin = fromCoin;
    const tempAmount = fromAmount;
    
    setFromCoin(toCoin);
    setToCoin(tempCoin);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = async () => {
    if (!fromAmount || Number(fromAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    
    // Simulate swap process
    setTimeout(() => {
      toast.success(`Successfully swapped ${fromAmount} ${fromCoin} to ${toAmount} ${toCoin}`);
      setIsLoading(false);
      setFromAmount("");
      setToAmount("");
    }, 2000);
  };

  const exchangeRate = coinData[fromCoin]?.price && coinData[toCoin]?.price 
    ? (coinData[fromCoin].price / coinData[toCoin].price).toFixed(6)
    : "0";

  const priceImpact = Number(fromAmount) > 1000 ? "0.15%" : "0.05%";

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-lg mx-auto py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ebb70c]/10 rounded-full mb-4">
            <Icon icon="ic:baseline-swap-horiz" className="w-8 h-8 text-[#ebb70c]" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Swap Crypto</h2>
          <p className="text-gray-400">
            Exchange one cryptocurrency for another instantly
          </p>
        </div>

        {/* Main Swap Interface */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 space-y-4">
          
          {/* From Section */}
          <div className="bg-[#2A2A2A] rounded-xl p-4 border border-[#3A3A3A]">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-300">From</label>
              <span className="text-sm text-gray-400">Balance: 0.00</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="w-full bg-transparent text-2xl font-semibold text-white placeholder-gray-500 focus:outline-none"
                  placeholder="0.0"
                />
                <p className="text-sm text-gray-400 mt-1">
                  ≈ ${fromAmount ? (Number(fromAmount) * (coinData[fromCoin]?.price || 0)).toLocaleString() : "0.00"}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <CoinDropdown
                  label=""
                  selectedCoin={fromCoin}
                  onSelect={setFromCoin}
                  coins={coins}
                  isOpen={showFromDropdown}
                  onToggle={() => setShowFromDropdown(!showFromDropdown)}
                  excludeCoin={toCoin}
                />
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwapCoins}
              className="p-3 bg-[#2A2A2A] hover:bg-[#3A3A3A] border border-[#3A3A3A] rounded-full transition-all duration-200 hover:scale-110"
            >
              <Icon icon="ic:baseline-swap-vert" className="w-6 h-6 text-[#ebb70c]" />
            </button>
          </div>

          {/* To Section */}
          <div className="bg-[#2A2A2A] rounded-xl p-4 border border-[#3A3A3A]">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-300">To</label>
              <span className="text-sm text-gray-400">Balance: 0.00</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={toAmount}
                  readOnly
                  className="w-full bg-transparent text-2xl font-semibold text-white placeholder-gray-500 focus:outline-none cursor-not-allowed"
                  placeholder="0.0"
                />
                <p className="text-sm text-gray-400 mt-1">
                  ≈ ${toAmount ? (Number(toAmount) * (coinData[toCoin]?.price || 0)).toLocaleString() : "0.00"}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <CoinDropdown
                  label=""
                  selectedCoin={toCoin}
                  onSelect={setToCoin}
                  coins={coins}
                  isOpen={showToDropdown}
                  onToggle={() => setShowToDropdown(!showToDropdown)}
                  excludeCoin={fromCoin}
                />
              </div>
            </div>
          </div>

          {/* Swap Details */}
          {fromAmount && toAmount && (
            <div className="bg-[#2A2A2A] rounded-xl p-4 border border-[#3A3A3A] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Exchange Rate</span>
                <span className="text-sm text-white">1 {fromCoin} = {exchangeRate} {toCoin}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Price Impact</span>
                <span className="text-sm text-green-400">{priceImpact}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Slippage Tolerance</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="w-16 px-2 py-1 text-sm bg-[#3A3A3A] rounded border border-[#4A4A4A] focus:outline-none focus:border-[#ebb70c]"
                  />
                  <span className="text-sm text-gray-400">%</span>
                </div>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={isLoading || !fromAmount || Number(fromAmount) <= 0}
            className="w-full bg-[#ebb70c] hover:bg-[#ffc107] disabled:bg-[#ebb70c]/50 disabled:cursor-not-allowed text-black font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-lg shadow-lg flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                <span>Swapping...</span>
              </>
            ) : (
              <>
                <Icon icon="ic:baseline-swap-horiz" className="w-5 h-5" />
                <span>Swap {fromCoin} to {toCoin}</span>
              </>
            )}
          </button>

          {/* Info Section */}
          <div className="bg-[#2A2A2A] rounded-xl p-4 border border-[#3A3A3A]">
            <div className="flex items-start space-x-3">
              <Icon icon="ic:baseline-info" className="text-[#ebb70c] text-lg flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-400">
                <p className="font-medium text-gray-300 mb-1">Swap Information:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Rates are estimated and may change during execution</li>
                  <li>Minimum swap amount is 0.001 of any token</li>
                  <li>Swaps are executed instantly on-chain</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;