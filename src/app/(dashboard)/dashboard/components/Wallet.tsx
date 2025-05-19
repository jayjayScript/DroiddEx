"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import Send from "./Send";
import Withdraw from "./Receive";
import Buy from "./Buy";
import Swap from "./Swap";

const API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=dogecoin,tron,binancecoin,bitcoin,ripple,solana&order=market_cap_desc&per_page=100&page=1&sparkline=false";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
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

  useEffect(() => {
    const fetchData = () => {
      axios.get(API_URL).then((res) => {
        setCoins(res.data);
      });
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 1000); // fetch every 1s

    return () => clearInterval(interval); // cleanup
  }, []);

  const getSymbol = (id: string): string => {
    switch (id) {
      case "dogecoin":
        return "cryptocurrency-color:doge";
      case "tron":
        return "cryptocurrency-color:trx";
      case "binancecoin":
        return "cryptocurrency-color:bnb";
      case "bitcoin":
        return "cryptocurrency-color:btc";
      case "ripple":
        return "cryptocurrency-color:xrp";
      case "solana":
        return "token-branded:solana";
      default:
        return "/icons/default.png";
    }
  };

  const hancdleActiveBot = () => {
    setActiveBot(!activeBot);
  };

  // const RandomNumber = Math.floor(Math.random() * 256);
  // const binaryString = to8BitBinary(RandomNumber);

  // useEffect(() => {
  //   const toggleInterval = setInterval(() => {
  //     const randomNumber = Math.floor(Math.random() * 256);
  //     setActiveBot(randomNumber % 2 === 0);
  //   }, 100);

  //   return () => clearInterval(toggleInterval);
  // }, [])

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

      <div className="flex flex-col mb-4 bg-[#0000003C] p-2 px-4 rounded-lg overflow-x-hidden">
        <div className="flex items-center">
          <div className={`bg-[#2A2A2AE6] flex items-center p-4 rounded-lg border-1 ${activeBot ? "border-green-500" : "border-[#eb0c0c]"}`}>
            <Icon
              icon="fluent:bot-28-filled"
              width="54"
              height="54"
              className={`text-[#eb0c0c] ${activeBot ? "text-green-500" : ""}`}
            />
            <Icon
              icon="grommet-icons:power-cycle"
              width="24"
              height="24"
              className={`cursor-pointer ${
                activeBot ? "rotate-animation text-green-500" : "text-[#eb0c0c]"
              } `}
              onClick={hancdleActiveBot}
            />
          </div>
          <div
            className={`${
              activeBot ? "text-green-500" : "text-[#eb0c0c]"
            } text-[12px] font-bold`}
          >
            {binaryString} {!activeBot}
          </div>
        </div>
        {/* <span
          className={`bg-[#2a2a2a] font-bold p-3 px-4 rounded-lg text-[10px] ${
            activeBot ? "text-green-500" : "text-[#EB560CFF]"
          } trasition-all duration-300 ease-in-out`}
        >
          {activeBot ? "+10%" : "Inactive"}
        </span> */}
        <small className="font-medium text-center text-[10px] my-1 ms-[2.6rem]">Trades are encrypted in binary codes ⚠</small>
      </div>

      <div className="overflow-hidden whitespace-nowrap border-b border-gray-700 mb-4">
        <div className="animate-marquee inline-block">
          {coins.map((coin) => (
            <span key={coin.id} className="mx-4 text-sm text-gray-300">
              {coin.symbol.toUpperCase()}: ${coin.current_price.toFixed(2)}
            </span>
          ))}
        </div>
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
            {coins.map((coin: Coin) => (
              <div
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
                        ${coin.current_price.toFixed(2)}
                      </div>
                      <div
                        className={
                          coin.price_change_percentage_24h >= 0
                            ? "text-green-400 text-[12px]"
                            : "text-red-400 text-[12px]"
                        }
                      >
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm flex flex-col gap-1">
                  <span className="font-semibold text-[13px]">45.3445</span>
                  <span className="text-[12px] text-gray-400">$10.30</span>
                </div>
              </div>
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
          <Send />
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
    </div>
  );
};

export default Wallet;
