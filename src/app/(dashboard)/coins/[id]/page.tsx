'use client';


import React from 'react';
import { getCoins } from '@/lib/getCoins';
import { walletAddresses } from '@/lib/wallet';
import Link from 'next/link';

export default function CoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); // ✅ Properly unwrap the promise

  const [coin, setCoin] = React.useState<any>(null);
  
  React.useEffect(() => {
    const fetch = async () => {
      const coins = await getCoins();
      const match = coins.find((c: any) => c.id === id);
      setCoin(match);
    };
    fetch();
  }, [id]);

  if (!coin) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6 text-white max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{coin.name} ({coin.symbol})</h1>
      <p>Price: ${coin.quotes.USD.price.toFixed(2)}</p>
      <p>Market Cap: ${coin.quotes.USD.market_cap.toLocaleString()}</p>
      <p>24h %: {coin.quotes.USD.percent_change_24h.toFixed(2)}%</p>

      <div className="mt-6 flex gap-4">
        <Link href="">
          <button
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          Deposit
        </button>
        </Link>
        <button
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Withdraw
        </button>
      </div>
      
    </div>
  );
}
