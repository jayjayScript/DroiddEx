'use client';

import React from 'react';
import Modal from './components/Modal';
import { walletAddresses } from '@/lib/wallet';
import { Icon } from '@iconify/react/dist/iconify.js';
import toast from 'react-hot-toast';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Withdrawal, swapCoins } from '@/lib/transaction';

type CoinData = {
  id: string;
  name: string;
  symbol: string;
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    price_change_percentage_24h: number;
  };
};

interface Props {
  symbol: string; // e.g. 'btc'
  locale?: string;
}

interface Coin {
  symbol: string;
  name?: string;
  icon?: string;
  price?: number;
}

// Static coin data for swap functionality
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

// Convert coinData to coins array
const availableCoins: Coin[] = Object.entries(coinData).map(([symbol, data]) => ({
  symbol,
  name: data.name,
  icon: data.icon,
  price: data.price,
}));

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
  const selectedInfo = coins.find(c => c.symbol === selectedCoin) || coinData[selectedCoin];
  const selectedIcon = selectedInfo?.icon || (coinData[selectedCoin]?.icon) || "cryptocurrency:question";
  const selectedName = selectedInfo?.name || (coinData[selectedCoin]?.name) || selectedCoin;

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
                const icon = coin.icon || (coinData[coin.symbol]?.icon) || "cryptocurrency:question";
                const name = coin.name || (coinData[coin.symbol]?.name) || coin.symbol;
                return (
                  <button
                    key={coin.symbol}
                    onClick={() => {
                      onSelect(coin.symbol);
                      onToggle();
                    }}
                    className={`w-full flex items-center justify-between p-2 hover:bg-[#3A3A3A] transition-colors duration-150 text-left ${
                      selectedCoin === coin.symbol ? "bg-[#3A3A3A] border-r-2 border-[#ebb70c]" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon icon={icon} width={16} height={16} />
                      <div>
                        <p className="font-medium text-xs text-white">{coin.symbol.toUpperCase()} <span className="text-gray-400 text-xs">- {name}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      {selectedCoin === coin.symbol && (
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

// TradingView Widget Component
const TradingViewWidget = ({ symbol, locale = 'en' }: Props, ) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.type = 'text/javascript';

    const widgetConfig = {
      autosize: true,
      symbol: `BINANCE:${symbol.toUpperCase()}USDT`,
      interval: '1',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: locale,
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      container_id: 'tradingview-widget',
      backgroundColor: '#1A1A1A',
      studies: [],
      overrides: {
        'paneProperties.background': '#1A1A1A',
        'paneProperties.vertGridProperties.color': '#2A2A2A',
        'paneProperties.horzGridProperties.color': '#2A2A2A',
        'symbolWatermarkProperties.transparency': 90,
        'scalesProperties.textColor': '#B0B3B8',
        'mainSeriesProperties.candleStyle.upColor': '#00C896',
        'mainSeriesProperties.candleStyle.downColor': '#FF6B6B',
        'mainSeriesProperties.candleStyle.drawWick': true,
        'mainSeriesProperties.candleStyle.drawBorder': true,
        'mainSeriesProperties.candleStyle.borderUpColor': '#00C896',
        'mainSeriesProperties.candleStyle.borderDownColor': '#FF6B6B',
        'mainSeriesProperties.candleStyle.wickUpColor': '#00C896',
        'mainSeriesProperties.candleStyle.wickDownColor': '#FF6B6B',
      },
    };

    script.innerHTML = JSON.stringify(widgetConfig);

    const container = ref.current;
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [symbol, locale]);

  return (
    <div
      id="tradingview-widget"
      ref={ref}
      className="w-full h-[340px] bg-[#1A1A1A]"
    />
  );
};

export default function CoinPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const [coin, setCoin] = React.useState<CoinData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  const [isDepositOpen, setDepositOpen] = React.useState(false);
  const [isWithdrawOpen, setWithdrawOpen] = React.useState(false);
  const [isSwapOpen, setSwapOpen] = React.useState(false);

  const [amount, setAmount] = React.useState('');
  const [recipientAddress, setRecipientAddress] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [withdrawLoading, setWithdrawLoading] = React.useState(false);
  
  // Swap modal states
  const [fromCoin, setFromCoin] = useState("BTC");
  const [toCoin, setToCoin] = useState("ETH");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  
  const walletEntry = coin ? (walletAddresses[coin.symbol.toUpperCase()] || [])[0] || '' : '';
  const walletAddress = typeof walletEntry === 'string' ? walletEntry : walletEntry?.address || '';

  // Helper to get coin info
  const getCoinInfo = useCallback((symbol: string) => {
    return availableCoins.find((c) => c.symbol === symbol) || coinData[symbol];
  }, []);

  // Set the current coin as the default "from" coin when swap modal opens
  useEffect(() => {
    if (isSwapOpen && coin) {
      const currentSymbol = coin.symbol.toUpperCase();
      if (coinData[currentSymbol]) {
        setFromCoin(currentSymbol);
        // Set a different coin as "to" to avoid same coin swap
        const defaultToCoin = currentSymbol === 'BTC' ? 'ETH' : 'BTC';
        setToCoin(defaultToCoin);
      }
    }
  }, [isSwapOpen, coin]);

  // Calculate exchange rate and estimated output for swap
  useEffect(() => {
    if (fromAmount && !isNaN(Number(fromAmount))) {
      const fromInfo = getCoinInfo(fromCoin);
      const toInfo = getCoinInfo(toCoin);
      const fromPrice = fromInfo?.price || 0;
      const toPrice = toInfo?.price || 0;
      if (fromPrice && toPrice) {
        const exchangeRate = fromPrice / toPrice;
        const estimated = (Number(fromAmount) * exchangeRate).toFixed(6);
        setToAmount(estimated);
      }
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromCoin, toCoin, getCoinInfo]);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSend = () => {
    if (coin && amount && fileName) {
      toast.success(`You sent ${amount} ${coin.symbol.toUpperCase()} with screenshot ${fileName}`);
      setDepositOpen(false);
      setAmount('');
      setFileName('');
    } else {
      toast.error('Please fill all required fields');
    }
  };

  const handleWithdraw = async () => {
    if (coin && amount && recipientAddress) {
      setWithdrawLoading(true);
      try {
        const network = 'mainnet';
        await Withdrawal(recipientAddress, (amount), coin.symbol, network);
        toast.success(`Withdrawal of ${amount} ${coin.symbol.toUpperCase()} submitted`);
        setWithdrawOpen(false);
        setAmount('');
        setRecipientAddress('');
      } catch (error) {
        toast.error('Withdrawal failed. Please try again.');
        console.error(error)
      } finally {
        setWithdrawLoading(false);
      }
    } else {
      toast.error('Please fill all required fields');
    }
  };

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
    setSwapLoading(true);
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
        setSwapOpen(false);
      }
    } catch (error: unknown) {
      toast.error("Swap failed. Please try again.");
      console.error(error)
    } finally {
      setSwapLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchCoin = async () => {
      try {
        setLoading(true);
        const { id } = unwrappedParams;
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
        const data = await res.json();
        setCoin(data);
      } catch (err) {
        console.error('Error fetching coin:', err);
        toast.error('Failed to load coin data');
      } finally {
        setLoading(false);
      }
    };

    fetchCoin();
  }, [unwrappedParams]);

  if (loading) {
    return (
      <div className="min-h-screen md:max-w-[60%] mx-auto bg-[#2a2a2a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Failed to load coin data</div>
      </div>
    );
  }

  const actionButtons = [
    { 
      label: "Send", 
      icon: "dashicons:arrow-up-alt", 
      onClick: () => setDepositOpen(true),
      color: "from-green-600 to-green-700"
    },
    { 
      label: "Receive", 
      icon: "dashicons:arrow-down-alt", 
      onClick: () => setWithdrawOpen(true),
      color: "from-blue-600 to-blue-700"
    },
    { 
      label: "Swap", 
      icon: "tdesign:swap",
      onClick: () => setSwapOpen(true),
      color: "from-purple-600 to-purple-700"
    },
    { 
      label: "AI", 
      icon: "fluent:bot-28-filled",
      color: "from-orange-600 to-orange-700"
    },
  ];

  const exchangeRate = coinData[fromCoin]?.price && coinData[toCoin]?.price 
    ? (coinData[fromCoin].price / coinData[toCoin].price).toFixed(6)
    : "0";

  const priceImpact = Number(fromAmount) > 1000 ? "0.15%" : "0.05%";

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="md:max-w-[60%] mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {coin.name}
          </h1>
          <p className="text-gray-400 text-lg">
            ({coin.symbol.toUpperCase()})
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 gap-4 mb-8">
          {actionButtons.map((item, index) => (
            <div
              key={item.label}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={item.onClick}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div>
                <div className="bg-[#2A2A2A] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon={item.icon} className="text-3xl text-[#ebb70c]" />
                </div>
                <div className="text-white font-medium text-center">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Price Chart */}
        <div className="bg-[#1A1A1A] rounded-2xl p-3 py-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-semibold mb-2 sm:mb-0">Live Trading Chart</h2>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold">
                ${coin.market_data.current_price.usd.toFixed(2)}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                coin.market_data.price_change_percentage_24h >= 0
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}>
                {coin.market_data.price_change_percentage_24h >= 0 ? '+' : ''}
                {coin.market_data.price_change_percentage_24h.toFixed(2)}%
              </div>
            </div>
          </div>
          
          {/* TradingView Chart */}
          <div className="h-[350px] sm:h-[500px] bg-[#1A1A1A] rounded-xl overflow-hidden">
            <TradingViewWidget symbol={coin.symbol} />
          </div>
          
          {/* Chart Info */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            Powered by TradingView • Real-time data from Binance
          </div>
        </div>

        {/* Market Data */}
        <div className="bg-[#2A2A2A] rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Market Data</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#1A1A1A] rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Current Price</div>
              <div className="text-white text-xl font-bold">
                ${coin.market_data.current_price.usd.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-[#1A1A1A] rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Market Cap</div>
              <div className="text-white text-xl font-bold">
                ${coin.market_data.market_cap.usd.toLocaleString()}
              </div>
            </div>
            
            <div className="bg-[#1A1A1A] rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">24h Change</div>
              <div className={`text-xl font-bold ${
                coin.market_data.price_change_percentage_24h >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}>
                {coin.market_data.price_change_percentage_24h >= 0 ? '+' : ''}
                {coin.market_data.price_change_percentage_24h.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Modal */}
        <Modal isOpen={isDepositOpen} onCloseAction={() => setDepositOpen(false)}>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Withdraw {coin.name}</h2>

            <div>
              <label className="block text-sm font-medium text-white mb-3">
                {coin.symbol.toUpperCase()} Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#2A2A2A] text-white text-lg
                         placeholder-gray-400 outline-none
                         hover:bg-[#333333] focus:bg-[#333333]
                         transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Recipient Address
              </label>
              <input
                type="text"
                placeholder="Paste recipient address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#2A2A2A] text-white text-lg
                         placeholder-gray-400 outline-none
                         hover:bg-[#333333] focus:bg-[#333333]
                         transition-all duration-200"
              />
            </div>

            <button
              onClick={handleWithdraw}
              disabled={withdrawLoading}
              className="w-full bg-[#ebb70c] hover:bg-[#d4a50b] text-black font-bold py-4 rounded-xl text-lg
                       transform hover:scale-105 active:scale-95
                       transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {withdrawLoading ? 'Processing...' : 'Confirm Withdrawal'}
            </button>
          </div>
        </Modal>

        {/* Withdraw Modal */}
        <Modal isOpen={isWithdrawOpen} onCloseAction={() => setWithdrawOpen(false)}>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Deposit {coin.name}</h2>

            <div>
              <label className="block text-sm font-medium text-white mb-3">
                {coin.symbol.toUpperCase()} Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#2A2A2A] text-white text-lg
                         placeholder-gray-400 outline-none
                         hover:bg-[#333333] focus:bg-[#333333]
                         transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Wallet Address
              </label>
              <div className="flex items-center bg-[#2A2A2A] rounded-xl p-4">
                <code className="flex-1 text-sm text-gray-300 break-all font-mono">
                  {walletAddress}
                </code>
                <button 
                  onClick={handleCopy}
                  className={`ml-4 p-2 rounded-lg transition-all duration-300 ${
                    copied 
                      ? 'bg-green-600 text-white' 
                      : 'bg-[#3A3A3A] hover:bg-[#4A4A4A] text-gray-300'
                  }`}
                >
                  <Icon 
                    icon={copied ? "mdi:check" : "tabler:copy"} 
                    className="text-xl" 
                  />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Upload Transaction Screenshot
              </label>
              
              <div className="relative bg-[#2A2A2A] hover:bg-[#333333] border-2 border-dashed border-[#4A4A4A] rounded-xl p-8 text-center transition-all duration-300 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                
                <Icon icon="ic:baseline-photo" className="text-[#ebb70c] text-6xl mx-auto mb-4" />
                <div className="text-white">
                  {fileName ? (
                    <div>
                      <div className="text-green-400 font-medium mb-2">✓ File Selected</div>
                      <div className="text-sm text-gray-400">{fileName}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium mb-2">Click to upload screenshot</div>
                      <div className="text-sm text-gray-400">PNG, JPG, JPEG supported</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleSend}
              className="w-full bg-[#ebb70c] hover:bg-[#d4a50b] text-black font-bold py-4 rounded-xl text-lg
                       transform hover:scale-105 active:scale-95
                       transition-all duration-200"
            >
              I&apos;ve sent this amount of {coin.symbol.toUpperCase()}
            </button>
          </div>
        </Modal>

        {/* Swap Modal */}
        {/* Swap Modal */}
        <Modal isOpen={isSwapOpen} onCloseAction={() => {
          setSwapOpen(false);
          setFromAmount("");
          setToAmount("");
        }}>
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ebb70c]/10 rounded-full mb-4">
                <Icon icon="ic:baseline-swap-horiz" className="w-8 h-8 text-[#ebb70c]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Swap {coin.name}</h2>
              <p className="text-gray-400">
                Exchange {coin.symbol.toUpperCase()} for another cryptocurrency
              </p>
            </div>

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
                    className="w-full bg-transparent font-semibold text-white placeholder-gray-500 focus:outline-none"
                    placeholder="0.0"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    ≈ ${fromAmount ? (Number(fromAmount) * (getCoinInfo(fromCoin)?.price || 0)).toLocaleString() : "0.00"}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  <CoinDropdown
                    label=""
                    selectedCoin={fromCoin}
                    onSelect={setFromCoin}
                    coins={availableCoins}
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
                className="p-3 bg-[#3A3A3A] hover:bg-[#4A4A4A] rounded-full transition-all duration-200 transform hover:scale-110"
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
                    type="number"
                    value={toAmount}
                    readOnly
                    className="w-full bg-transparent font-semibold text-white placeholder-gray-500 focus:outline-none"
                    placeholder="0.0"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    ≈ ${toAmount ? (Number(toAmount) * (getCoinInfo(toCoin)?.price || 0)).toLocaleString() : "0.00"}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  <CoinDropdown
                    label=""
                    selectedCoin={toCoin}
                    onSelect={setToCoin}
                    coins={availableCoins}
                    isOpen={showToDropdown}
                    onToggle={() => setShowToDropdown(!showToDropdown)}
                    excludeCoin={fromCoin}
                  />
                </div>
              </div>
            </div>

            {/* Swap Details */}
            {fromAmount && toAmount && (
              <div className="bg-[#1A1A1A] rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Exchange Rate</span>
                  <span className="text-sm text-white">
                    1 {fromCoin} = {exchangeRate} {toCoin}
                  </span>
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
                      className="w-16 bg-[#2A2A2A] text-white text-sm p-1 rounded text-center"
                      step="0.1"
                      min="0.1"
                      max="5"
                    />
                    <span className="text-sm text-gray-400">%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Minimum Received</span>
                  <span className="text-sm text-white">
                    {toAmount ? (Number(toAmount) * (1 - Number(slippage) / 100)).toFixed(6) : "0"} {toCoin}
                  </span>
                </div>
              </div>
            )}

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              disabled={!fromAmount || !toAmount || swapLoading}
              className="w-full bg-[#ebb70c] hover:bg-[#d4a50b] disabled:bg-gray-600 disabled:cursor-not-allowed text-black disabled:text-gray-400 font-bold py-4 rounded-xl text-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
            >
              {swapLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  <span>Swapping...</span>
                </div>
              ) : fromAmount && toAmount ? (
                `Swap ${fromAmount} ${fromCoin} for ${toAmount} ${toCoin}`
              ) : (
                "Enter an amount"
              )}
            </button>

            {/* Disclaimer */}
            <div className="text-xs text-gray-500 text-center">
              <p>Swaps are subject to slippage and network fees.</p>
              <p>Always verify transaction details before confirming.</p>
            </div>
          </div>
        </Modal>

        </div>
        </div>
  )}