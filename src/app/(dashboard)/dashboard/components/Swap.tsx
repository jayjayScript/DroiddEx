import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { swapCoins } from "@/lib/transaction";
import { useUserContext } from "@/store/userContext";

// Interface matching the Wallet component's Coin interface
interface Coin {
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

// Interface for wallet entries
interface WalletEntry {
  balance: number;
}

type Wallet = Record<string, WalletEntry | WalletEntry[]>;

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
  const selectedInfo = coins.find(c => c.symbol.toUpperCase() === selectedCoin.toUpperCase());
  
  // Icon mapping like in Wallet component
  const iconMap: Record<string, string> = {
    BTC: "cryptocurrency-color:btc",
    ETH: "cryptocurrency-color:eth",
    SOL: "cryptocurrency-color:sol",
    BNB: "cryptocurrency-color:bnb",
    XRP: "cryptocurrency-color:xrp",
    LTC: "cryptocurrency-color:ltc",
    XLM: "cryptocurrency-color:xlm",
    TRX: "cryptocurrency-color:trx",
    DOGE: "cryptocurrency-color:doge",
    POLYGON: "cryptocurrency-color:matic",
    LUNC: "token-branded:lunc",
    ADA: "cryptocurrency-color:ada",
    USDT: "cryptocurrency-color:usdt",
    USDC: "cryptocurrency-color:usdc",
    SHIB: "token-branded:shib",
    PEPE: "token-branded:pepes",
  };

  const selectedIcon = iconMap[selectedCoin.toUpperCase()] || "cryptocurrency:question";
  const selectedName = selectedInfo?.name || selectedCoin;

  return (
    <div className="relative">
      <label className="block mb-2 text-xs font-medium text-gray-300">
        {label}
      </label>
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-2 rounded-lg bg-[#2A2A2A] text-white border border-[#3A3A3A] hover:border-[#ebb70c] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ebb70c]/50 min-h-0"
      >
        <div className="flex items-center space-x-2">
          <Icon icon={selectedIcon} width={18} height={18} />
          <div className="text-left">
            <p className="font-medium text-sm">
              {selectedCoin.toUpperCase()} <span className="text-gray-400 text-xs">- {selectedName}</span>
            </p>
          </div>
        </div>
        <Icon 
          icon="ic:round-arrow-drop-down" 
          className={`text-base transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={onToggle}
          />
          <div className="absolute z-20 mt-1 w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg shadow-2xl max-h-48 overflow-y-auto">
            <div className="py-1">
              {filteredCoins.map((coin) => {
                const icon = iconMap[coin.symbol.toUpperCase()] || "cryptocurrency:question";
                return (
                  <button
                    key={coin.symbol}
                    onClick={() => {
                      onSelect(coin.symbol.toUpperCase());
                      onToggle();
                    }}
                    className={`w-full flex items-center justify-between p-2 hover:bg-[#3A3A3A] transition-colors duration-150 text-left ${
                      selectedCoin.toUpperCase() === coin.symbol.toUpperCase() ? "bg-[#3A3A3A] border-r-2 border-[#ebb70c]" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon icon={icon} width={16} height={16} />
                      <div>
                        <p className="font-medium text-xs text-white">{coin.symbol.toUpperCase()} <span className="text-gray-400 text-xs">- {coin.name}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      {selectedCoin.toUpperCase() === coin.symbol.toUpperCase() && (
                        <Icon icon="ic:baseline-check" className="text-[#ebb70c] text-base" />
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
  const { user } = useUserContext();
  const [fromCoin, setFromCoin] = useState("BTC");
  const [toCoin, setToCoin] = useState("ETH");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [slippage, setSlippage] = useState("0.5");

  // Helper to get coin info from the coins prop
  const getCoinInfo = React.useCallback((symbol: string) => {
    return coins.find((c) => c.symbol.toUpperCase() === symbol.toUpperCase());
  }, [coins]);

  // Helper to get balance from wallet entry (same as Wallet component)
  const getBalanceFromWalletEntry = (entry: WalletEntry | WalletEntry[]): number => {
    if (Array.isArray(entry)) {
      return entry.reduce((sum, item) => sum + (item.balance || 0), 0);
    }
    return entry.balance || 0;
  };

  // Helper to get user balance for a specific coin
  const getUserBalance = (symbol: string): number => {
    if (!user?.wallet) return 0;
    
    const walletEntry = user.wallet[symbol.toUpperCase() as keyof typeof user.wallet];
    if (!walletEntry) return 0;
    
    return getBalanceFromWalletEntry(walletEntry as  WalletEntry | WalletEntry[]);
  };

  // Calculate exchange rate and estimated output
  useEffect(() => {
    if (fromAmount && !isNaN(Number(fromAmount)) && coins.length > 0) {
      const fromInfo = getCoinInfo(fromCoin);
      const toInfo = getCoinInfo(toCoin);
      
      if (fromInfo && toInfo) {
        const fromPrice = fromInfo.market_data.current_price.usd;
        const toPrice = toInfo.market_data.current_price.usd;
        
        if (fromPrice && toPrice) {
          const exchangeRate = fromPrice / toPrice;
          const estimated = (Number(fromAmount) * exchangeRate).toFixed(6);
          setToAmount(estimated);
        }
      }
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromCoin, toCoin, coins, getCoinInfo]);

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

    const userBalance = getUserBalance(fromCoin);
    if (Number(fromAmount) > userBalance) {
      toast.error(`Insufficient ${fromCoin} balance`);
      return;
    }

    setIsLoading(true);
    try {
      const fromFullName = getCoinInfo(fromCoin)?.name || fromCoin;
      const toFullName = getCoinInfo(toCoin)?.name || toCoin;
      const result: unknown = await swapCoins(fromFullName, toFullName, Number(fromAmount));
      
      if (result && typeof result === 'object' && 'success' in result && (result as { success: boolean; message?: string }).success === false) {
        toast.error((result as { message?: string }).message || "Swap failed");
      } else {
        toast.success(`Successfully swapped ${fromAmount} ${fromFullName} to ${toAmount} ${toFullName}`);
        setFromAmount("");
        setToAmount("");
      }
    } catch (error: unknown) {
      toast.error("Swap failed. Please try again.");
      console.error(error)
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate exchange rate using real coin data
  const exchangeRate = (() => {
    const fromInfo = getCoinInfo(fromCoin);
    const toInfo = getCoinInfo(toCoin);
    
    if (fromInfo && toInfo) {
      const fromPrice = fromInfo.market_data.current_price.usd;
      const toPrice = toInfo.market_data.current_price.usd;
      return fromPrice && toPrice ? (fromPrice / toPrice).toFixed(6) : "0";
    }
    return "0";
  })();

  const priceImpact = Number(fromAmount) > 1000 ? "0.15%" : "0.05%";

  // Get USD values for display
  const getUSDValue = (amount: string, coinSymbol: string): string => {
    if (!amount || !coinSymbol) return "0.00";
    const coinInfo = getCoinInfo(coinSymbol);
    if (!coinInfo) return "0.00";
    const usdValue = Number(amount) * coinInfo.market_data.current_price.usd;
    return usdValue.toLocaleString();
  };

  // Format currency like in Wallet component
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

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
              <span className="text-sm text-gray-400">Balance: {formatCurrency(getUserBalance(fromCoin))}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="w-full bg-transparent font-semibold text-white placeholder-gray-500 focus:outline-none"
                  placeholder="0.0"
                />
                <p className="text-sm text-gray-400 mt-1">
                  ≈ ${getUSDValue(fromAmount, fromCoin)}
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
              <span className="text-sm text-gray-400">Balance: {formatCurrency(getUserBalance(toCoin))}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={toAmount}
                  readOnly
                  className="w-full bg-transparent font-semibold text-white placeholder-gray-500 focus:outline-none cursor-not-allowed"
                  placeholder="0.0"
                />
                <p className="text-sm text-gray-400 mt-1">
                  ≈ ${getUSDValue(toAmount, toCoin)}
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
            disabled={isLoading || !fromAmount || Number(fromAmount) <= 0 || Number(fromAmount) > getUserBalance(fromCoin)}
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