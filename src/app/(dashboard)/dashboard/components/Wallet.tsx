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

import Link from "next/link";
import SellPage from "./Sell";
import Deposit from "./Send";

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

const to8BitBinary = (num: number) => {
  if (!Number.isInteger(num) || num < 0 || num >= 2 ** 34) {
    throw new Error("Input must be an integer between 0 and 255");
  }
  return num.toString(2).padStart(27, "0");
};

const Wallet = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [activeBot, setActiveBot] = useState(false);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [binaryString, setBinaryString] = useState(() => to8BitBinary(0));
  const { email, phrase } = useSelector((state: RootState) => state.user.value);
  const [showFullPhrase, setShowFullPhrase] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleCopyPhrase = () => {
    navigator.clipboard.writeText(phrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };


  const getSymbol = (id: string) => {
    // Quick fallback logic, you may map icons more accurately
    return `cryptocurrency:color-${id.split("-")[0]}`;
  };


  const handleActiveBot = () => {
    setActiveBot(!activeBot);
  };

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await getCoins();
        // Map CoinGeckoCoin[] to Coin[]
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


  return (
    <div className="min-h-screen md:max-w-[80%] mx-auto text-white p-4 pb-20">
      <div className="hidden">{copied}</div>
      <header className="flex justify-between items-center mb-4">
        <h1
          className="text-lg font-normal cursor-pointer"
          onClick={() => setActivePage(null)}
        >
          {activePage ? (
            <div className="flex items-center gap-1">
              <Icon icon="weui:back-outlined" width="24" height="24" />
              <span className="ml-1">Back</span>
            </div>
          ) : (
            "Home"
          )}
        </h1>
        <div className="text-sm">$OFT</div>
      </header>

      <div className="my-2">
        <h2>Welcome! {email}</h2>
        <div className="relative group my-4">
          <div className="flex items-center justify-between gap-3 border border-[#2a2a2a] hover:border-gray-600 transition-colors duration-300 px-3 py-3 rounded-xl bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] backdrop-blur-sm">
            <div className={`overflow-auto transition-all duration-500 ease-in-out ${showFullPhrase ? "w-auto max-w-none" : "w-[200px] sm:w-40"
              }`}>
              <p className="text-[14px] sm:text-sm whitespace-nowrap p-1 font-mono text-gray-300">
                {phrase}
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
                  className={`transition-colors duration-200 ${copied ? "text-green-400" : "text-gray-400 group-hover/copy:text-white"
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
                  className="text-gray-400 group-hover/show:text-white transition-colors duration-200"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="text-3xl font-bold mb-2">$32.50</div>

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

        {/* <div className="bg-[#2A2A2A] p-4 rounded-lg mb-4 text-sm">
        <p>
          Swap Solana tokens via Jupiter enabled by Rango.{" "}
          <span className="text-[#ebb70c] underline">Start swapping →</span>
        </p>
      </div> */}

        <div className="flex flex-col mb-4 bg-[#0000003C] hover:bg-[#00000050] p-2 px-4 rounded-lg overflow-x-hidden transition-all duration-300 border border-transparent hover:border-[#313130]">
          <div className="flex items-center">
            <div className={`bg-[#2A2A2AE6] hover:bg-[#353535] flex items-center p-3 rounded-lg border-1 transition-all duration-500 ${activeBot ? "border-green-500 shadow-green-500/20 shadow-lg" : "border-[#eb0c0c]"
              }`}>
              <Icon
                icon="fluent:bot-28-filled"
                width="50"
                height="50"
                className={`transition-all duration-500 ${activeBot ? "text-green-500" : "text-[#eb0c0c]"
                  }`}
              />
              <button
                onClick={handleActiveBot}
                className="ml-2 hover:bg-[#2A2A2A] p-1 rounded transition-all duration-200 active:scale-95"
              >
                <Icon
                  icon="grommet-icons:power-cycle"
                  width="24"
                  height="24"
                  className={`cursor-pointer transition-all duration-300 ${activeBot
                      ? "rotate-animation text-green-500 animate-spin"
                      : "text-[#eb0c0c] hover:text-[#ff1a1a]"
                    }`}
                />
              </button>
            </div>
            <div
              className={`ml-3 font-mono text-[11.4px] font-bold p-2 rounded transition-all duration-300 ${activeBot ? "text-green-500 bg-green-500/10" : "text-[#eb0c0c] bg-[#eb0c0c]/10"
                }`}
            >
              {binaryString}
            </div>
          </div>
          <small className="font-medium text-center text-[10px] my-1 ms-[2.6rem] text-gray-400 flex items-center justify-center gap-1">
            <Icon icon="material-symbols:security" width="12" height="12" />
            Trades are encrypted in binary codes ⚠
          </small>
        </div>
        {/* assets */}

        {activePage === null && (
          <div>
            <div>
              <h2 className="text-[#fff] text-[24px] bg-[#2A2A2A] p-2 px-4 my-2 flex rounded-lg">
                Assets
              </h2>
            </div>

            <div className="space-y-4">
              {loading && <p>Loading...</p>}
              {!loading &&
                coins.map((coin) => (
                  <Link
                    href={`/coins/${coin.id}`}
                    key={coin.id}
                    className="flex justify-between bg-[#1A1A1A] p-2 mb-[6px] rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon={getSymbol(coin.id)} width="40" height="40" />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <div className="text-[18px] font-normal">
                            {coin.symbol.toUpperCase()}
                          </div>
                          <div className="text-[12px] text-gray-400 bg-[#2A2A2A] px-1 rounded-md">
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

                    {/* Hardcoded right-hand info — replace with real portfolio logic later */}
                    <div className="text-right text-sm flex flex-col gap-1">
                      <span className="font-semibold text-[13px]">0.3103</span>
                      <span className="text-[12px] text-gray-400">
                        ${(coin.market_data.current_price.usd * 0.3103).toFixed(2)}
                      </span>
                    </div>
                  </Link>
                ))}
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
    </div>
  );
};

export default Wallet;
