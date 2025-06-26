'use client';

import React from 'react';
import Modal from './components/Modal';
import { walletAddresses } from '@/lib/wallet';
import { Icon } from '@iconify/react/dist/iconify.js';
import toast from 'react-hot-toast';
import { useRef, useEffect } from 'react';
import { Withdrawal } from '@/lib/transaction';

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
      className="w-full h-[340px] bg-[#1A1A1A]" // ✅ container background must also be set
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

  const [amount, setAmount] = React.useState('');
  const [recipientAddress, setRecipientAddress] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [withdrawLoading, setWithdrawLoading] = React.useState(false);
  
  const walletEntry = coin ? (walletAddresses[coin.symbol.toUpperCase()] || [])[0] || '' : '';
  const walletAddress = typeof walletEntry === 'string' ? walletEntry : walletEntry?.address || '';

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
        // You may want to add network selection if needed, here 'network' is hardcoded
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
      color: "from-purple-600 to-purple-700"
    },
    { 
      label: "AI", 
      icon: "fluent:bot-28-filled",
      color: "from-orange-600 to-orange-700"
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        
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

      </div>
    </div>
  );
}
