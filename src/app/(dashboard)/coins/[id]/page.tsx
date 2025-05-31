// src/app/coins/[coinId]/page.tsx
import { getCoinData } from "@/lib/getCoinData";
import Image from "next/image";

// interface CoinPageProps {
//   params: {
//     coinId: string;
//   };
// }

// Your symbol utility (if not already shared)
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

export default async function CoinPage({ params }: { params: { id: string } }) {
  const coinId = params.id;
  const data = await getCoinData(coinId);
  const iconClass = getSymbol(coinId);

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      {/* Title & Icon */}
      <div className="flex items-center gap-4 mb-8">
        {iconClass.startsWith("/") ? (
          <Image
            src={iconClass}
            alt={`${coinId} icon`}
            width={40}
            height={40}
            className="rounded"
          />
        ) : (
          <span className={`iconify text-4xl`} data-icon={iconClass}></span>
        )}
        <h1 className="text-3xl font-bold capitalize">{coinId}</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-5">
          <p className="text-gray-500 dark:text-gray-400">Current Price</p>
          <p className="text-xl font-semibold">${data.currentPrice.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-5">
          <p className="text-gray-500 dark:text-gray-400">24h Change</p>
          <p
            className={`text-xl font-semibold ${
              data.priceChange >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {data.priceChange.toFixed(2)}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-5">
          <p className="text-gray-500 dark:text-gray-400">24h High</p>
          <p className="text-xl font-semibold">${data.high24h.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-5">
          <p className="text-gray-500 dark:text-gray-400">24h Low</p>
          <p className="text-xl font-semibold">${data.low24h.toLocaleString()}</p>
        </div>
      </div>

      {/* Optional Volume Info */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-5">
          <p className="text-gray-500 dark:text-gray-400">Volume (BTC)</p>
          <p className="text-xl font-semibold">{data.volumeBTC.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-5">
          <p className="text-gray-500 dark:text-gray-400">Volume (USDT)</p>
          <p className="text-xl font-semibold">${data.volumeUSDT.toLocaleString()}</p>
        </div>
      </div>
    </main>
  );
}
