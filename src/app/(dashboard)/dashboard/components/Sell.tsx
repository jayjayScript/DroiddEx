'use client';

import { useState, useCallback } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useUserContext } from '@/store/userContext';

const sellMethods = [
  'Bank Transfer',
  'PayPal',
  'Cash App',
  'Zelle',
  'P2P Cash',
];

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

interface WalletEntry {
  balance: number;
}

const methodLabels: Record<string, string> = {
  'Bank Transfer': 'Enter your Bank Account Number',
  PayPal: 'Enter your PayPal Email',
  'Cash App': 'Enter your Cash App Tag',
  Zelle: 'Enter your Zelle Email or Phone',
  'P2P Cash': 'Enter Pickup Address',
};

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

const CustomDropdown = ({
  label,
  selectedValue,
  onSelect,
  options,
  isOpen,
  onToggle,
}: {
  label: string;
  selectedValue: string;
  onSelect: (value: string) => void;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="relative">
      <label className="block mb-3 text-sm font-medium text-white">{label}</label>
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex justify-between items-center bg-[#2A2A2A] rounded-xl text-white 
                 hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1E1E1E]
                 transition-all duration-200 ease-in-out text-left"
      >
        <span className={`${selectedValue ? 'text-white' : 'text-gray-400'}`}>
          {selectedValue || `-- Choose ${label} --`}
        </span>
        <Icon
          icon="ion:chevron-down-sharp"
          className={`text-xl transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={onToggle}
          />
          <div className="absolute z-20 mt-2 w-full bg-[#2A2A2A] rounded-xl shadow-lg max-h-64 overflow-y-auto">
            {options.map((option, index) => (
              <div
                key={option}
                onClick={() => {
                  onSelect(option);
                  onToggle();
                }}
                className={`p-4 hover:bg-[#3A3A3A] cursor-pointer transition-colors duration-200
                          ${index !== options.length - 1 ? 'border-b border-[#3A3A3A]' : ''}
                          ${selectedValue === option ? 'bg-[#3A3A3A] text-white' : ''}`}
              >
                {option}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const CoinDropdown = ({
  label,
  selectedCoin,
  onSelect,
  coins,
  isOpen,
  onToggle,
  getUserBalance,
  formatCurrency,
}: {
  label: string;
  selectedCoin: string;
  onSelect: (coin: string) => void;
  coins: Coin[];
  isOpen: boolean;
  onToggle: () => void;
  getUserBalance: (symbol: string) => number;
  formatCurrency: (amount: number) => string;
}) => {
  const selectedInfo = coins.find(c => c.symbol.toUpperCase() === selectedCoin.toUpperCase());
  const selectedIcon = iconMap[selectedCoin.toUpperCase()] || "cryptocurrency:question";
  const selectedName = selectedInfo?.name || selectedCoin;

  return (
    <div className="relative">
      <label className="block mb-3 text-sm font-medium text-white">{label}</label>
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex justify-between items-center bg-[#2A2A2A] rounded-xl text-white 
                 hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1E1E1E]
                 transition-all duration-200 ease-in-out text-left"
      >
        {selectedCoin ? (
          <div className="flex items-center space-x-3">
            <Icon icon={selectedIcon} width={20} height={20} />
            <div>
              <span className="font-medium">{selectedCoin.toUpperCase()}</span>
              <span className="text-gray-400 text-sm ml-2">- {selectedName}</span>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">-- Choose Coin --</span>
        )}
        <Icon
          icon="ion:chevron-down-sharp"
          className={`text-xl transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={onToggle}
          />
          <div className="absolute z-20 mt-2 w-full bg-[#2A2A2A] rounded-xl shadow-lg max-h-64 overflow-y-auto">
            {coins.map((coinOption, index) => {
              const icon = iconMap[coinOption.symbol.toUpperCase()] || "cryptocurrency:question";
              const balance = getUserBalance(coinOption.symbol);
              
              return (
                <div
                  key={coinOption.symbol}
                  onClick={() => {
                    onSelect(coinOption.symbol.toUpperCase());
                    onToggle();
                  }}
                  className={`p-4 hover:bg-[#3A3A3A] cursor-pointer transition-colors duration-200
                            ${index !== coins.length - 1 ? 'border-b border-[#3A3A3A]' : ''}
                            ${selectedCoin === coinOption.symbol.toUpperCase() ? 'bg-[#3A3A3A] text-white' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon icon={icon} width={18} height={18} />
                      <div>
                        <div className="font-medium">{coinOption.symbol.toUpperCase()}</div>
                        <div className="text-xs text-gray-400">{coinOption.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">${coinOption.market_data.current_price.usd.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Bal: {formatCurrency(balance)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const SellPage = ({ coins }: { coins: Coin[] }) => {
  const { user } = useUserContext();
  const [method, setMethod] = useState('');
  const [coin, setCoin] = useState('');
  const [amount, setAmount] = useState('');
  const [accountDetail, setAccountDetail] = useState('');
  const [message, setMessage] = useState('');
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);

  const getCoinInfo = useCallback((symbol: string) => {
    return coins.find((c) => c.symbol.toUpperCase() === symbol.toUpperCase());
  }, [coins]);

  const getBalanceFromWalletEntry = useCallback((entry: WalletEntry | WalletEntry[]): number => {
    if (Array.isArray(entry)) {
      return entry.reduce((sum, item) => sum + (item.balance || 0), 0);
    }
    return entry.balance || 0;
  }, []);

  const getUserBalance = useCallback((symbol: string): number => {
    if (!user?.wallet || !symbol) return 0;
    const walletEntry = user.wallet[symbol.toUpperCase() as keyof typeof user.wallet];
    if (!walletEntry) return 0;
    return getBalanceFromWalletEntry(walletEntry as WalletEntry | WalletEntry[]);
  }, [user?.wallet, getBalanceFromWalletEntry]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount);
  }, []);

  const getUSDValue = useCallback((amount: string, coinSymbol: string): string => {
    if (!amount || !coinSymbol || !coins.length) return "0.00";
    const coinInfo = getCoinInfo(coinSymbol);
    if (!coinInfo) return "0.00";
    const usdValue = Number(amount) * coinInfo.market_data.current_price.usd;
    return usdValue.toLocaleString();
  }, [getCoinInfo, coins.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!method || !coin || !amount || !accountDetail) {
      setMessage('Please fill in all required fields.');
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setMessage('Please enter a valid amount.');
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    const userBalance = getUserBalance(coin);
    if (numAmount > userBalance) {
      setMessage(`Insufficient ${coin} balance. You have ${formatCurrency(userBalance)} ${coin}.`);
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    const coinInfo = getCoinInfo(coin);
    const data = {
      method,
      coin,
      coinName: coinInfo?.name || coin,
      amount: numAmount,
      usdValue: getUSDValue(amount, coin),
      accountDetail,
      userBalance,
      timestamp: new Date().toISOString(),
    };

    console.log('Sell request:', data);
    setMessage('Sell request submitted successfully!');
    setTimeout(() => setMessage(''), 5000);

    setMethod('');
    setCoin('');
    setAmount('');
    setAccountDetail('');
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Sell Crypto
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full bg-[#1E1E1E] p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 sm:space-y-8"
        >
          <div
            className={`transition-all duration-500 ease-in-out transform ${message
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-4 scale-95 h-0'
              }`}
          >
            {message && (
              <div className={`p-4 rounded-xl text-center font-medium ${message.includes('successfully')
                ? 'bg-green-900/20 text-green-400 border border-green-500/30'
                : 'bg-yellow-900/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                <Icon
                  icon={message.includes('successfully') ? 'mdi:check-circle' : 'mdi:alert-circle'}
                  className="inline mr-2 text-lg"
                />
                {message}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-6">
              <CustomDropdown
                label="Sell Method"
                selectedValue={method}
                options={sellMethods}
                onSelect={(value) => {
                  setMethod(value);
                  setAccountDetail('');
                }}
                isOpen={showMethodDropdown}
                onToggle={() => setShowMethodDropdown(!showMethodDropdown)}
              />

              <div>
                <label className="block mb-3 text-sm font-medium text-white">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full p-4 bg-[#2A2A2A] rounded-xl text-white text-lg
                             outline-none hover:bg-[#333333] focus:bg-[#333333]
                             transition-all duration-200 ease-in-out
                             placeholder:text-gray-400"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Icon icon="mdi:currency-usd" className="text-xl" />
                  </div>
                </div>
                {amount && coin && (
                  <div className="mt-2 text-sm text-gray-400">
                    ≈ ${getUSDValue(amount, coin)} USD
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <CoinDropdown
                label="Select Coin"
                selectedCoin={coin}
                onSelect={setCoin}
                coins={coins}
                isOpen={showCoinDropdown}
                onToggle={() => setShowCoinDropdown(!showCoinDropdown)}
                getUserBalance={getUserBalance}
                formatCurrency={formatCurrency}
              />

              {coin && (
                <div className="p-4 bg-[#2A2A2A] rounded-xl border border-[#3A3A3A]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Available Balance:</span>
                    <span className="text-sm font-medium text-white">
                      {formatCurrency(getUserBalance(coin))} {coin}
                    </span>
                  </div>
                </div>
              )}

              <div
                className={`transition-all duration-500 ease-in-out ${method
                  ? 'opacity-100 translate-y-0 max-h-96'
                  : 'opacity-0 translate-y-4 max-h-0 overflow-hidden'
                  }`}
              >
                {method && (
                  <div>
                    <label className="block mb-3 text-sm font-medium text-white">
                      {methodLabels[method]}
                    </label>
                    <input
                      type="text"
                      placeholder={methodLabels[method]}
                      className="w-full p-4 bg-[#2A2A2A] rounded-xl text-white text-lg
                               outline-none hover:bg-[#333333] focus:bg-[#333333]
                               transition-all duration-200 ease-in-out
                               placeholder:text-gray-400"
                      value={accountDetail}
                      onChange={(e) => setAccountDetail(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#ebb70c] text-black font-bold py-4 px-6 rounded-xl text-lg
                         hover:bg-[#d4a50b] active:bg-[#c29709] 
                         transform hover:scale-105 active:scale-95
                         transition-all duration-200 ease-in-out
                         shadow-lg hover:shadow-xl
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={!method || !coin || !amount || !accountDetail || Number(amount) > getUserBalance(coin)}
            >
              <Icon icon="mdi:cash-multiple" className="inline mr-2 text-xl" />
              Submit Sell Request
            </button>
          </div>
        </form>

        <div className="h-8 sm:h-12"></div>
      </div>
    </div>
  );
};

export default SellPage;