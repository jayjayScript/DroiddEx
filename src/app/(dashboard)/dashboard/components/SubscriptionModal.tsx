import { Icon } from "@iconify/react";
import React from "react";
import type { Coin } from "./Wallet";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (selectedCoin: string, requiredAmount: number) => void;
  loading: boolean;
  userWallet: any;
  coins: Coin[];
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscribe,
  loading,
  userWallet,
  coins
}) => {
  const [selectedCoin, setSelectedCoin] = React.useState<string>('');
  const [paymentStep, setPaymentStep] = React.useState<'select' | 'confirm'>('select');
  const subscriptionPriceUSD = 200;

  // Get available coins (coins that user has balance for)
  const availableCoins = coins.filter(coin => {
    if (!userWallet) return false;
    const walletEntry = userWallet[coin.symbol.toUpperCase()];
    if (!walletEntry) return false;
    if (Array.isArray(walletEntry)) {
      const totalBalance = walletEntry.reduce((sum, item) => sum + (item.balance || 0), 0);
      return totalBalance > 0;
    }
    return (walletEntry.balance || 0) > 0;
  });

  // Calculate required amount for selected coin
  const getRequiredAmount = (coinSymbol: string): number => {
    const coin = coins.find(c => c.symbol.toUpperCase() === coinSymbol.toUpperCase());
    if (!coin) return 0;
    const coinPrice = coin.market_data.current_price.usd;
    return subscriptionPriceUSD / coinPrice;
  };

  // Get user's balance for selected coin
  const getUserBalance = (coinSymbol: string): number => {
    if (!userWallet) return 0;
    const walletEntry = userWallet[coinSymbol.toUpperCase()];
    if (!walletEntry) return 0;
    if (Array.isArray(walletEntry)) {
      return walletEntry.reduce((sum, item) => sum + (item.balance || 0), 0);
    }
    return walletEntry.balance || 0;
  };

  // Check if user has enough balance
  const hasEnoughBalance = (coinSymbol: string): boolean => {
    const required = getRequiredAmount(coinSymbol);
    const available = getUserBalance(coinSymbol);
    return available >= required;
  };

  const handleCoinSelect = (coinSymbol: string) => {
    setSelectedCoin(coinSymbol);
    setPaymentStep('confirm');
  };

  const handleConfirmPayment = () => {
    if (!selectedCoin) return;
    const requiredAmount = getRequiredAmount(selectedCoin);
    onSubscribe(selectedCoin, requiredAmount);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000003a] bg-opacity-50 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#313130] rounded-lg p-6 mx-4 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {paymentStep === 'confirm' && (
              <button
                onClick={() => setPaymentStep('select')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icon icon="material-symbols:arrow-back" width="20" height="20" />
              </button>
            )}
            <h2 className="text-xl font-bold text-white">
              {paymentStep === 'select' ? 'Bot Subscription' : 'Confirm Payment'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Icon icon="material-symbols:close" width="24" height="24" />
          </button>
        </div>

        {paymentStep === 'select' && (
          <>
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-[#ebb70c] to-[#ffba1a] rounded-full flex items-center justify-center">
                <Icon
                  icon="fluent:bot-28-filled"
                  width="40"
                  height="40"
                  className="text-[#1a1a1a]"
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Activate Trading Bot
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Get access to our advanced AI trading bot that uses encrypted binary algorithms to optimize your trades.
              </p>
            </div>

            <div className="bg-[#0000003C] border border-[#313130] rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-semibold">Monthly Subscription</span>
                <span className="text-[#ebb70c] text-2xl font-bold">$200</span>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Icon icon="material-symbols:check-circle" width="16" height="16" className="text-green-400" />
                  <span>24/7 Automated Trading</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="material-symbols:check-circle" width="16" height="16" className="text-green-400" />
                  <span>Advanced Binary Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="material-symbols:check-circle" width="16" height="16" className="text-green-400" />
                  <span>Real-time Market Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="material-symbols:check-circle" width="16" height="16" className="text-green-400" />
                  <span>Risk Management Tools</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Select Payment Method</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableCoins.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">
                    No coins available for payment. Please add funds to your wallet.
                  </p>
                ) : (
                  availableCoins.map((coin) => {
                    const requiredAmount = getRequiredAmount(coin.symbol);
                    const userBalance = getUserBalance(coin.symbol);
                    const hasEnough = hasEnoughBalance(coin.symbol);
                    const iconName = iconMap[coin.symbol.toUpperCase()] || "cryptocurrency:question";

                    return (
                      <button
                        key={coin.id}
                        onClick={() => hasEnough && handleCoinSelect(coin.symbol)}
                        disabled={!hasEnough}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${hasEnough
                            ? 'bg-[#2A2A2A] border-[#313130] hover:bg-[#3A3A3A] hover:border-[#ebb70c] cursor-pointer'
                            : 'bg-[#1A1A1A] border-[#2A2A2A] opacity-50 cursor-not-allowed'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon icon={iconName} width="32" height="32" />
                          <div className="text-left">
                            <div className="text-white font-semibold text-sm">
                              {coin.symbol.toUpperCase()}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {coin.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold text-sm">
                            {requiredAmount.toFixed(6)}
                          </div>
                          <div className={`text-xs ${hasEnough ? 'text-green-400' : 'text-red-400'}`}>
                            Balance: {userBalance.toFixed(6)}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-[#2A2A2A] text-white py-3 px-4 rounded-lg hover:bg-[#3A3A3A] transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {paymentStep === 'confirm' && selectedCoin && (
          <>
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-[#ebb70c] to-[#ffba1a] rounded-full flex items-center justify-center">
                <Icon
                  icon={iconMap[selectedCoin.toUpperCase()] || "cryptocurrency:question"}
                  width="40"
                  height="40"
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Confirm Payment
              </h3>
              <p className="text-gray-400 text-sm">
                You're about to pay for the monthly bot subscription
              </p>
            </div>

            <div className="bg-[#0000003C] border border-[#313130] rounded-lg p-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Subscription Price</span>
                  <span className="text-white font-semibold">$200.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Payment Currency</span>
                  <span className="text-white font-semibold">{selectedCoin.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Amount Required</span>
                  <span className="text-[#ebb70c] font-bold">
                    {getRequiredAmount(selectedCoin).toFixed(6)} {selectedCoin.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Your Balance</span>
                  <span className="text-green-400 font-semibold">
                    {getUserBalance(selectedCoin).toFixed(6)} {selectedCoin.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#313130]">
                  <span className="text-gray-400">Remaining Balance</span>
                  <span className="text-white font-semibold">
                    {(getUserBalance(selectedCoin) - getRequiredAmount(selectedCoin)).toFixed(6)} {selectedCoin.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPaymentStep('select')}
                className="flex-1 bg-[#2A2A2A] text-white py-3 px-4 rounded-lg hover:bg-[#3A3A3A] transition-colors font-semibold"
              >
                Change Payment
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#ebb70c] to-[#ffba1a] text-[#1a1a1a] py-3 px-4 rounded-lg hover:from-[#ffba1a] hover:to-[#ebb70c] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Icon icon="eos-icons:loading" width="20" height="20" />
                    Processing...
                  </>
                ) : (
                  'Confirm Payment'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionModal;