'use client';

import React from 'react';
import Modal from './components/Modal';
import { walletAddresses } from '@/lib/wallet';
import { Icon } from '@iconify/react/dist/iconify.js';
import toast from 'react-hot-toast';

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

export default function CoinPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const [coin, setCoin] = React.useState<CoinData | null>(null);

  const [isDepositOpen, setDepositOpen] = React.useState(false);
  const [isWithdrawOpen, setWithdrawOpen] = React.useState(false);
  const [activeModal, setActiveModal] = React.useState('')

  const [amount, setAmount] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const walletEntry = coin ? (walletAddresses[coin.symbol.toUpperCase()] || [])[0] || '' : '';
  const walletAddress = typeof walletEntry === 'string' ? walletEntry : walletEntry?.address || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSend = () => {
    // TODO: handle backend submission
    if (coin) {
      toast(`You sent ${amount} ${coin.symbol.toUpperCase()} with screenshot ${fileName}`);
    }
  };

  React.useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { id } = unwrappedParams
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
        const data = await res.json();
        setCoin(data);
      } catch (err) {
        console.error('Error fetching coin:', err);
      }
    };

    fetchCoin();
  }, [unwrappedParams]);

  if (!coin) return <div className="text-white p-6">Loading...</div>;

  // const addressList = walletAddresses[coin.symbol.toUpperCase()] || [];

  return (
    <div className="p-6 text-white max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">
        {coin.name} ({coin.symbol.toUpperCase()})
      </h1>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 text-center text-sm mt-8 mb-2 px-1">
        {[
          { label: "Send", icon: "dashicons:arrow-up-alt", onClick: () => setDepositOpen(true) },
          { label: "Receive", icon: "dashicons:arrow-down-alt", onClick: () => setWithdrawOpen(true) },
          { label: "Swap", icon: "tdesign:swap" },
          { label: "AI", icon: "fluent:bot-28-filled" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center cursor-pointer"
            onClick={item.onClick}
          >
            <div className="bg-[#2A2A2A] p-[10.1px] px-[10.1px] rounded-full mb-1">
              <Icon icon={item.icon} width="27" height="27" className="" />
            </div>
            <div className="text-white text-[13px] mt-2">{item.label}</div>
          </div>
        ))}
      </div>

      <div className='mt-5 grid grid-cols-2 bg-[#2a2a2a] p-2 px-4 rounded'>
        <p className='text-[12px] font-bold'>Price: ${coin.market_data.current_price.usd.toFixed(2)}</p>
        <p className='text-[12px] font-bold'>Market Cap: ${coin.market_data.market_cap.usd.toLocaleString()}</p>
        <p
          className={
          `text-[12px]`
          }
        >
          24h %: <span className={
            coin.market_data.price_change_percentage_24h >= 0
              ? "text-green-400 text-[12px] font-bold"
              : "text-red-400 text-[12px] font-bold"
          }>{coin.market_data.price_change_percentage_24h}</span>
        </p>

        {/* Deposit Modal */}
        <Modal isOpen={isDepositOpen} onCloseAction={() => setDepositOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Deposit {coin.name}</h2>

          <div className="text-white space-y-4 bg-[#1A1A1A] rounded-lg my-4">
            <label className="block text-sm text-gray-400 mb-1 p-1">
              {coin.symbol.toUpperCase()} Amount
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
            <label className="block text-sm text-gray-400 mb-1">Wallet Address</label>
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
                <span className="block text-sm text-gray-400 mb-2">
                  {fileName || 'Click to select a screenshot (PNG, JPG, JPEG)'}
                </span>
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
            I’ve sent this amount of {coin.symbol.toUpperCase()}
          </button>
        </Modal>


        {/* Withdraw Modal */}
        {/* Withdraw Modal */}
        <Modal isOpen={isWithdrawOpen} onCloseAction={() => setWithdrawOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Withdraw {coin.name}</h2>

          <div className="text-white space-y-4 bg-[#1A1A1A] rounded-lg my-4">
            <label className="block text-sm text-gray-400 mb-1 p-1">
              {coin.symbol.toUpperCase()} Amount
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
            <label className="block text-sm text-gray-400 mb-1">Recipient Address</label>
            <input
              type="text"
              placeholder="Paste recipient address"
              className="w-full p-3 rounded-lg bg-[#2A2A2A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ebb70c]"
            />
          </div>

          <button
            onClick={() => {
              if (!amount) {
                toast.error("Please enter amount");
                return;
              }
              toast.success(`Withdrawal of ${amount} ${coin.symbol.toUpperCase()} submitted`);
              setWithdrawOpen(false);
            }}
            className="w-full my-2 bg-[#ebb70c] text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition-all"
          >
            Confirm Withdraw
          </button>
        </Modal>

      </div>
    </div>
  );
}
