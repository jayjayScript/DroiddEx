"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Withdraw from "./Receive";
import Buy from "./Buy";
import Swap from "./Swap";
import { useSelector } from "react-redux";
import { RootState } from "@/store/user";
import { getCoins } from "@/lib/getCoins";
import { CoinGeckoCoin } from "@/lib/getCoins";
import { getUserProfile } from "@/lib/auth";
import { useMemo } from "react";
import logo from "@/assets/web4-removebg-preview.png"

import Link from "next/link";
import { useRouter } from "next/navigation";
import SellPage from "./Sell";
import Deposit from "./Send";
import TransactionHistory from "@/components/history/TransactionHistory";
import { Poppins } from "next/font/google";
import toast from "react-hot-toast";
import Image from "next/image";

const poppins = Poppins({ subsets: ["latin"], weight: ["700"] });

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

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  loading: boolean;
}

interface UserProfile {
  fullname: string;
  phrase: string;
  balance: number;
  subscriptionExpiry?: string | Date;
  // Add other fields as needed
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubscribe, 
  loading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000003a] bg-opacity-50 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#313130] rounded-lg p-6 mx-4 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Bot Subscription</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Icon icon="material-symbols:close" width="24" height="24" />
          </button>
        </div>
        
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

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#2A2A2A] text-white py-3 px-4 rounded-lg hover:bg-[#3A3A3A] transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onSubscribe}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-[#ebb70c] to-[#ffba1a] text-[#1a1a1a] py-3 px-4 rounded-lg hover:from-[#ffba1a] hover:to-[#ebb70c] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Icon icon="eos-icons:loading" width="20" height="20" />
                Processing...
              </>
            ) : (
              'Subscribe Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const to8BitBinary = (num: number) => {
  if (!Number.isInteger(num) || num < 0 || num >= 2 ** 34) {
    throw new Error("Input must be an integer between 0 and 255");
  }
  return num.toString(2).padStart(27, "0");
};
const Wallet = () => {
  const router = useRouter();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [activeBot, setActiveBot] = useState(false);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [binaryString, setBinaryString] = useState(() => to8BitBinary(0));
  const { phrase } = useSelector((state: RootState) => state.user.value);
  const [showFullPhrase, setShowFullPhrase] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Subscription related states
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<Date | null>(null);

  const handleCopyPhrase = () => {
    navigator.clipboard.writeText(phrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
        
        // Check for existing subscription
        // You'll need to add subscription fields to your user profile
        if (profile.subscriptionExpiry) {
          const expiryDate = new Date(profile.subscriptionExpiry);
          if (expiryDate > new Date()) {
            setHasActiveSubscription(true);
            setSubscriptionExpiry(expiryDate);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile details:", error);
      }
    }

    fetchUserProfile();
  }, []);

  const handleBotToggle = () => {
    if (!hasActiveSubscription) {
      setShowSubscriptionModal(true);
      return;
    }
    
    setActiveBot(!activeBot);
  };

  const handleSubscribe = async () => {
    setSubscriptionLoading(true);
    
    try {
      // Here you would integrate with your payment processor (Stripe, PayPal, etc.)
      // For now, we'll simulate a successful payment
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate expiry date (30 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      // Update subscription status
      setHasActiveSubscription(true);
      setSubscriptionExpiry(expiryDate);
      setShowSubscriptionModal(false);
      
      // You would typically make an API call here to update the user's subscription status
      // await updateUserSubscription(userId, expiryDate);
      
      // Optionally show a success message
      toast.success('Subscription activated successfully!');
      
    } catch (error) {
      console.error('Subscription failed:', error);
      toast.error('Subscription failed. Please try again.');
    } finally {
      setSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await getCoins();
        const mappedCoins: Coin[] = data.map((coin: CoinGeckoCoin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          market_data: {
            current_price: {
              usd: coin.current_price,
            },
            market_cap: {
              usd: coin.market_cap,
            },
            price_change_percentage_24h: coin.price_change_percentage_24h,
          },
        }));
        setCoins(mappedCoins);
      } catch (error) {
        console.error("Error fetching coins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  useEffect(() => {
    if (!activeBot) return;

    const tickInterval = setInterval(() => {
      const next = Math.floor(Math.random() * 2 ** 34);
      setBinaryString(to8BitBinary(next));
    }, 700);

    return () => clearInterval(tickInterval);
  }, [activeBot]);

  // Check if subscription has expired
  useEffect(() => {
    if (hasActiveSubscription && subscriptionExpiry) {
      const checkExpiry = () => {
        if (new Date() > subscriptionExpiry) {
          setHasActiveSubscription(false);
          setActiveBot(false);
          setSubscriptionExpiry(null);
        }
      };

      const interval = setInterval(checkExpiry, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [hasActiveSubscription, subscriptionExpiry]);

  const initials = useMemo(() => {
    if (!userProfile || !userProfile.fullname) return "...";
    return userProfile.fullname
      .split(" ")
      .map((word: string) => word[0]?.toUpperCase() || "")
      .join('');
  }, [userProfile]);

  const formatExpiryDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen md:max-w-[60%] mx-auto text-white p-4 pb-20">
      <div className="hidden">{copied}</div>
      <header className="flex justify-between items-center my-4">
          {activePage ? (
            <div className="flex items-center gap-1" onClick={() => setActivePage(null)}>
              <Icon icon="weui:back-outlined" width="24" height="24" />
              <span className="ml-1">Back</span>
            </div>
          ) : (
           <Icon onClick={() => router.push("/")} className="cursor-pointer text-gray-400" icon="bxs:home" width="24" height="24" />
          )}
        <p className="text-gray-400 font-semibold">Web4.0</p>
      </header>

      <div className="my-2">
        <div className="relative group my-4">
          <div className="flex items-center justify-between gap-3 hover:border-gray-600 transition-colors duration-300 pe-3 rounded-full bg-gradient-to-r from-[#1a1a1a] to-[#ebb70c] backdrop-blur-sm">
            <div
              className={`w-10 h-10 rounded-full bg-[#ebb70cbf] flex items-center justify-center ${poppins.className}`}
            >
              <p className="text-black font-black text-[16px]">{initials}</p>
            </div>
            <div className={`overflow-auto transition-all duration-500 ease-in-out ${showFullPhrase ? "w-auto max-w-none" : "w-[178px] sm:w-40"
              }`}>
              <p className="text-[14px] sm:text-sm whitespace-nowrap p-1 font-mono text-gray-300">
                {userProfile ? userProfile.phrase : 'Loading...'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleCopyPhrase}
                className="p-2 hover:bg-gray-700 rounded-lg transition-all duration-200 active:scale-95 group/copy"
              >
                <Icon
                  icon={copied ? "solar:check-circle-bold" : "solar:copy-bold-duotone"}
                  width="20"
                  height="20"
                  className={`transition-colors duration-200 ${copied ? "text-green-400" : "text-gray-800 group-hover/copy:text-white"
                    }`}
                />
              </button>

              <button
                onClick={() => setShowFullPhrase((v) => !v)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-all duration-200 active:scale-95 group/show"
              >
                <Icon
                  icon={showFullPhrase ? "bx:hide" : "bx:show-alt"}
                  width="20"
                  height="20"
                  className="text-gray-800 group-hover/show:text-white transition-colors duration-200"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="text-3xl font-bold mb-2">${userProfile ? userProfile.balance : '...'}</div>

        <div className="grid grid-cols-5 sm:grid-cols-5 gap-4 text-center text-sm mt-8 mb-2 px-4">
          {[
            { label: "Send", icon: "dashicons:arrow-up-alt" },
            { label: "Receive", icon: "dashicons:arrow-down-alt" },
            { label: "Swap", icon: "tdesign:swap" },
            { label: "Buy", icon: "ion:card-sharp" },
            { label: "Sell", icon: "fluent:building-bank-28-filled" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setActivePage(item.label.toLowerCase())}
            >
              <div className="bg-[#2A2A2A] p-[10.1px] px-[10.1px] rounded-full mb-1">
                <Icon icon={item.icon} width="27" height="27" className="" />
              </div>
              <div className="text-white text-[13px] mt-2">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col my-4 bg-[#0000003C] hover:bg-[#00000050] p-1 px-3 rounded-lg overflow-x-hidden transition-all duration-300 border border-transparent hover:border-[#313130]">
          <div className="flex items-center">
            <div className={`flex items-center p-1 rounded-lg transition-all duration-500 `}>
              <Icon
                icon="fluent:bot-28-filled"
                width="50"
                height="50"
                className={`transition-all duration-500 ${activeBot ? "text-green-500" : hasActiveSubscription ? "text-[#ebb70c]" : "text-gray-500"
                  }`}
              />
              <button
                onClick={handleBotToggle}
                className="ml-2 hover:bg-[#2A2A2A] p-1 rounded transition-all duration-200 active:scale-95"
              >
                <Icon
                  icon="grommet-icons:power-cycle"
                  width="24"
                  height="24"
                  className={`cursor-pointer transition-all duration-300 ${activeBot
                    ? "rotate-animation text-green-500 animate-spin"
                    : hasActiveSubscription 
                      ? "text-[#ebb70c] hover:text-[#ffba1a]"
                      : "text-gray-500 hover:text-gray-400"
                    }`}
                />
              </button>
            </div>
            <div
              className={`ml-3 font-mono text-[11.4px] font-bold p-2 rounded transition-all duration-300 ${activeBot ? "text-green-500 bg-green-500/10" : hasActiveSubscription ? "text-[#ebb70c] bg-[#ebb70c]/10" : "text-gray-500 bg-gray-500/10"
                }`}
            >
              {binaryString}
            </div>
          </div>
          <small className="font-medium text-center text-[10px] my-1 ms-[2.6rem] text-gray-400 flex items-center justify-center gap-1">
            <Icon icon="material-symbols:security" width="12" height="12" />
            {hasActiveSubscription 
              ? `Subscription expires: ${subscriptionExpiry ? formatExpiryDate(subscriptionExpiry) : 'Unknown'} ⚠`
              : 'Subscribe to activate bot ⚠'
            }
          </small>
        </div>

        {/* Subscription Modal */}
        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={handleSubscribe}
          loading={subscriptionLoading}
        />

        {/* assets */}
        {activePage === null && (
          <div>
            <div>
              <h2 className="text-[#ebb70c] text-[18px] font-bold p-1 px-4 my-2 rounded-xs">
                Assets
              </h2>
            </div>

            <div className="space-y-4 flex flex-col gap-4">
              {loading && <p>Loading...</p>}
              {!loading &&
                coins.map((coin) => {
                  const iconName = iconMap[coin.symbol.toUpperCase()] || "cryptocurrency:question";
                  return (
                    <Link
                      href={`/coins/${coin.id}`}
                      key={coin.id}
                      className="flex justify-between bg-[#1A1A1A] p-2 mb-[6px] rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Icon icon={iconName} width="32" height="32"/>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <div className="text-[13px] font-semibold">
                              {coin.symbol.toUpperCase()}
                            </div>
                            <div className="text-[10px] text-gray-400 bg-[#2A2A2A] px-[1.5px] rounded-xs font-semibold">
                              {coin.name}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="text-[12px] text-gray-400">
                              ${coin.market_data.current_price.usd.toFixed(2)}
                            </div>
                            <div
                              className={
                                coin.market_data.price_change_percentage_24h >= 0
                                  ? "text-green-400 text-[12px] bg-[#00ff3c2d]"
                                  : "text-red-400 text-[12px] bg-[#fb040423]"
                              }
                            >
                              {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-sm flex flex-col gap-1">
                        <span className="font-semibold text-[13px]">0.3103</span>
                        <span className="text-[12px] text-gray-400">
                          ${(coin.market_data.current_price.usd * 0.3103).toFixed(2)}
                        </span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}

        {activePage === "send" && (
          <div>
            <Withdraw />
          </div>
        )}

        {activePage === "receive" && (
          <div>
            <Deposit />
          </div>
        )}

        {activePage === "swap" && (
          <div>
            <Swap coins={coins} />
          </div>
        )}

        {activePage === "buy" && (
          <div>
            <Buy />
          </div>
        )}

        {activePage === "sell" && (
          <div>
            <SellPage />
          </div>
        )}
      </div>
      <div>
        <div className="p-2 py-6 border-b" style={{ borderColor: '#3a3a3a' }}>
          <div className="flex items-center space-x-3">
            <Image src={logo} height={40} width={40} alt="Logo"/>
            <div>
              <h1 className="text-[15px] font-bold text-white">Transaction History</h1>
            </div>
          </div>
        </div>
        <TransactionHistory />
      </div>
    </div>
  );
};

export default Wallet;