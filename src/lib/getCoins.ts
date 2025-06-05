// lib/getCoins.ts
import { walletAddresses, coinIdMap } from "./wallet";

export interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_percentage_24h: number;
  addresses?: { name: string; address: string }[]; 
}

export async function getCoins(): Promise<CoinGeckoCoin[]> {
  const includedIds = Object.values(coinIdMap);

  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${includedIds.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`;

  const res = await fetch(url);
  const data: CoinGeckoCoin[] = await res.json();

  // Attach wallet addresses
  const enriched = data.map((coin) => ({
    ...coin,
    addresses:
      walletAddresses[coin.symbol.toUpperCase()] || []
  }));

  // Ensure proper order
  const sorted = includedIds
    .map((id) => enriched.find((coin) => coin.id === id))
    .filter(Boolean) as CoinGeckoCoin[];

  return sorted;
}

