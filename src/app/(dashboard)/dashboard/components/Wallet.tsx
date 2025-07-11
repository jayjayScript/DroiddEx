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

import Link from "next/link";
import { useRouter } from "next/navigation";
import SellPage from "./Sell";
import Deposit from "./Send";
import TransactionHistory from "@/components/history/TransactionHistory";
import { Poppins } from "next/font/google";
import { useUserContext } from "@/store/userContext";
import SubscriptionModal, { WalletEntry } from "./SubscriptionModal";
import { UserWallet } from "./SubscriptionModal";

const poppins = Poppins({ subsets: ["latin"], weight: ["700"] });

export interface Coin {
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

interface UserProfile {
  fullname: string;
  phrase: string;
  balance: number;
  subscriptionExpiry?: string | Date;
  // Add other fields as needed
}

const to8BitBinary = (num: number) => {
  if (!Number.isInteger(num) || num < 0 || num >= 2 ** 34) {
    throw new Error("Input must be an integer between 0 and 255");
  }
  return num.toString(2).padStart(27, "0");
};

// Skeleton Components
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex justify-between bg-[#1A1A1A] p-2 mb-[6px] rounded-lg animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          <div className="flex flex-col gap-1">
            <div className="w-16 h-3 bg-gray-600 rounded"></div>
            <div className="w-24 h-2 bg-gray-600 rounded"></div>
          </div>
        </div>
        <div className="text-right flex flex-col gap-1">
          <div className="w-12 h-3 bg-gray-600 rounded"></div>
          <div className="w-16 h-2 bg-gray-600 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

const UserProfileSkeleton = () => (
  <div className="flex items-center justify-between gap-3 pe-3 rounded-full bg-gradient-to-r from-[#1a1a1a] to-[#ebb70c] backdrop-blur-sm">
    <div className="w-10 h-10 rounded-full bg-gray-600 animate-pulse"></div>
    <div className="flex-1 overflow-hidden">
      <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      <div className="w-8 h-8 bg-gray-600 rounded-lg animate-pulse"></div>
      <div className="w-8 h-8 bg-gray-600 rounded-lg animate-pulse"></div>
    </div>
  </div>
);

const BalanceSkeleton = () => (
  <div className="mb-2">
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-2xl">$</span>
      <div className="w-24 h-8 bg-gray-600 rounded animate-pulse"></div>
    </div>
  </div>
);

const BotSectionSkeleton = () => (
  <div className="flex flex-col my-4 bg-[#0000003C] p-1 px-3 rounded-lg border border-transparent">
    <div className="flex items-center">
      <div className="flex items-center p-1 rounded-lg">
        <div className="w-12 h-12 bg-gray-600 rounded animate-pulse"></div>
        <div className="ml-2 w-6 h-6 bg-gray-600 rounded animate-pulse"></div>
      </div>
      <div className="ml-3 w-32 h-6 bg-gray-600 rounded animate-pulse"></div>
    </div>
    <div className="ms-[2.6rem] mt-1">
      <div className="w-48 h-3 bg-gray-600 rounded animate-pulse"></div>
    </div>
  </div>
);

const Wallet = () => {
  const router = useRouter();
  const [coins, setCoins] = useState<Coin[]>([]);
  const { user, setUser } = useUserContext()
  const [activeBot, setActiveBot] = useState(user.ActivateBot ?? false);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [binaryString, setBinaryString] = useState(() => to8BitBinary(0));
  const { phrase } = useSelector((state: RootState) => state.user.value);
  const [showFullPhrase, setShowFullPhrase] = useState(false);
  const [copied, setCopied] = useState(false);

  const [coinsLoading, setCoinsLoading] = useState(true);
  const [userProfileLoading, setUserProfileLoading] = useState(true);
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

  // useEffect(() => {
  //   console.log(user)
  // },[])

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
        setUserProfileLoading(true);
        const profile = await getUserProfile();
        setUserProfile(profile);

        // Check for existing subscription
        if (profile.subscriptionExpiry) {
          const expiryDate = new Date(profile.subscriptionExpiry);
          if (expiryDate > new Date()) {
            setHasActiveSubscription(true);
            setSubscriptionExpiry(expiryDate);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile details:", error);
      } finally {
        setUserProfileLoading(false);
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

  const handleSubscribe = async (selectedCoin: string, requiredAmount: number) => {
    setSubscriptionLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const userBalance = getTotalBalance(user.wallet, coins);
      if (userBalance < requiredAmount) {
        setSubscriptionLoading(false);
        return;
      }

      if (user?.wallet) {
        const updatedWallet = { ...user.wallet };
        const walletEntry = updatedWallet[selectedCoin.toUpperCase() as keyof typeof updatedWallet];

        if (Array.isArray(walletEntry)) {
          let remainingAmount = requiredAmount;
          for (let i = 0; i < walletEntry.length && remainingAmount > 0; i++) {
            const available = walletEntry[i].balance || 0;
            const deductAmount = Math.min(available, remainingAmount);
            walletEntry[i].balance = available - deductAmount;
            remainingAmount -= deductAmount;
          }
        } else {
          walletEntry.balance = (walletEntry.balance || 0) - requiredAmount;
        }

        setUser({
          ...user,
          wallet: updatedWallet
        });
      }

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      setHasActiveSubscription(true);
      setSubscriptionExpiry(expiryDate);
      setShowSubscriptionModal(false);

    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCoins = async () => {
      try {
        setCoinsLoading(true);
        const data = await getCoins();

        if (!isMounted) return;

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
        if (!isMounted) return;
        setCoins([]);
      } finally {
        if (isMounted) {
          setCoinsLoading(false);
        }
      }
    };

    fetchCoins();

    return () => {
      isMounted = false;
    };
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

      const interval = setInterval(checkExpiry, 60000);
      return () => clearInterval(interval);
    }
  }, [hasActiveSubscription, subscriptionExpiry]);

  const initials = useMemo(() => {
    if (!userProfile || !userProfile.fullname) return "...";
    return userProfile.fullname[0]?.toUpperCase() || "";
  }, [userProfile]);

  const formatExpiryDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalBalance = (wallet: Wallet, coins: Coin[] = []): number => {
    if (!wallet || !coins || coins.length === 0) return 0;

    return Object.entries(wallet).reduce<number>((total, [symbol, entry]: [string, WalletEntry]) => {
      const coinData = coins.find(coin => coin.symbol.toUpperCase() === symbol.toUpperCase());
      if (!coinData) return total

      const currentPrice = coinData.market_data.current_price.usd;

      if (Array.isArray(entry)) {
        const coinQuantity = entry.reduce(
          (sub: number, item) => sub + (item.balance || 0),
          0
        );
        return total + (coinQuantity * currentPrice);
      }

      const coinQuantity = entry.balance || 0;
      return total + (coinQuantity * currentPrice);
    }, 0);
  }

  const transformWalletToUserWallet = (wallet: Wallet): UserWallet => {
    const userWallet: UserWallet = {};

    Object.entries(wallet).forEach(([coinSymbol, walletData]) => {
      if (walletData && typeof walletData === 'object') {
        userWallet[coinSymbol] = {
          balance: walletData.balance || 0,
        };
      }
    });

    return userWallet;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
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
        <p className="font-semibold text-[#ebb70c] uppercase">Web4.0</p>
      </header>

      <div className="my-2">
        <div className="relative group my-4">
          {userProfileLoading ? (
            <UserProfileSkeleton />
          ) : (
            <div className="flex items-center justify-between gap-3 hover:border-gray-600 transition-colors duration-300 pe-3 rounded-full bg-gradient-to-r from-[#1a1a1a] to-[#ebb70c] backdrop-blur-sm">
              <div
                className={`w-10 h-10 rounded-full bg-[#ebb70cbf] flex items-center justify-center ${poppins.className}`}
              >
                <p className="text-black font-medium text-[23px]">{initials}</p>
              </div>
              <div className={`overflow-auto transition-all duration-500 ease-in-out ${showFullPhrase ? "w-auto max-w-none" : "w-[178px] sm:w-40"
                }`}>
                <p className="text-[14px] sm:text-sm whitespace-nowrap p-1 font-mono text-gray-300">
                  {user ? user.phrase : 'Loading...'}
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
          )}
        </div>

        {/* Balance Section */}
        {userProfileLoading || coinsLoading ? (
          <BalanceSkeleton />
        ) : (
          <div className="text-3xl font-bold mb-2">
            <span className="text-gray-400 text-2xl">$ </span>
            {user?.wallet && !coinsLoading
              ? formatCurrency(getTotalBalance(user.wallet, coins))
              : '0.00'
            }
          </div>
        )}

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

        {/* Bot Section */}
        {userProfileLoading ? (
          <BotSectionSkeleton />
        ) : (
          <div className="flex flex-col my-4 bg-[#0000003C] hover:bg-[#00000050] p-1 px-3 rounded-lg overflow-x-hidden transition-all duration-300 border border-transparent hover:border-[#313130]">
            <div className="flex items-center">
              <div className={`flex items-center p-1 rounded-lg transition-all duration-500 `}>
                <Icon
                  icon="fluent:bot-28-filled"
                  width="50"
                  height="50"
                  className={`transition-all duration-500 ${activeBot ? "text-[#ebb70c]" : hasActiveSubscription ? "text-[#ebb70c]" : "text-gray-500"
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
                      ? "rotate-animation text-[#ebb70c] animate-spin"
                      : hasActiveSubscription
                        ? "text-[#ebb70c] hover:text-[#ffba1a]"
                        : "text-gray-500 hover:text-gray-400"
                      }`}
                  />
                </button>
              </div>
              <div
                className={`ml-3 font-mono text-[11.4px] font-bold p-2 rounded transition-all duration-300 ${activeBot ? "text-[#ebb70c] bg-[#ebb70c]/10" : hasActiveSubscription ? "text-[#ebb70c] bg-[#ebb70c]/10" : "text-gray-500 bg-gray-500/10"
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
        )}

        {user.ActivateBot == true ? "" : <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={handleSubscribe}
          loading={subscriptionLoading}
          userWallet={user?.wallet ? transformWalletToUserWallet(user.wallet) : {}}
          coins={coins}
          userEmail={user.email}
        />}

        {/* Assets Section */}
        {activePage === null && (
          <div>
            <div>
              <h2 className="text-gray-400 text-[18px] font-bold p-1 px-4 my-2 rounded-xs">
                Assets
              </h2>
            </div>

            <div className="space-y-3 flex flex-col gap-4">
              {/* Show skeleton while loading, then show coins */}
              {coinsLoading ? (
                <LoadingSkeleton />
              ) : coins.length > 0 ? (
                coins.map((coin) => {
                  const iconName = iconMap[coin.symbol.toUpperCase()] || "cryptocurrency:question";
                  let userBalance = 0;
                  if (user?.wallet) {
                    const walletEntry = user.wallet[coin.symbol.toUpperCase() as keyof typeof user.wallet];
                    if (walletEntry) {
                      if (Array.isArray(walletEntry)) {
                        userBalance = walletEntry.reduce((sum, item) => sum + (item.balance || 0), 0);
                      } else {
                        userBalance = walletEntry.balance || 0;
                      }
                    }
                  }
                  return (
                    <Link
                      href={`/coins/${coin.id}`}
                      key={coin.id}
                      className="flex justify-between bg-[#0000003C] p-2 py-4 mb-[6px] rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Icon icon={iconName} width="32" height="32" />
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
                        <span className="font-semibold text-[13px]">{userBalance}</span>
                        <span className="text-[12px] text-gray-400">
                          ${(coin.market_data.current_price.usd * userBalance).toFixed(2)}
                        </span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Icon icon="cryptocurrency:question" width="48" height="48" className="mx-auto mb-4" />
                  <p>No coins available</p>
                </div>
              )}
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
            <p className="font-semibold text-[#ebb70c] uppercase">Web4.0</p>
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