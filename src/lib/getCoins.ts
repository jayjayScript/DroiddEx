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

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache
let lastFetchTime = 0;
let cachedData: CoinGeckoCoin[] | null = null;

export async function getCoins(): Promise<CoinGeckoCoin[]> {
  // Return cached data if available and not expired
  if (cachedData && Date.now() - lastFetchTime < CACHE_TTL) {
    return cachedData;
  }

  const includedIds = Object.values(coinIdMap);
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${includedIds.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`;

  try {
    const res = await fetch(url, {
      headers: {
        // Some APIs require a user-agent
        'User-Agent': 'YourAppName/1.0',
        // Add API key if you have one
        // 'x-cg-pro-api-key': 'your-api-key-here'
      }
    });

    if (!res.ok) {
      throw new Error(`CoinGecko API error: ${res.status} ${res.statusText}`);
    }

    const data: CoinGeckoCoin[] = await res.json();

    // Attach wallet addresses
    const enriched = data.map((coin) => ({
      ...coin,
      addresses: walletAddresses[coin.symbol.toUpperCase()] || []
    }));

    // Ensure proper order
    const sorted = includedIds
      .map((id) => enriched.find((coin) => coin.id === id))
      .filter(Boolean) as CoinGeckoCoin[];

    // Update cache
    cachedData = sorted;
    lastFetchTime = Date.now();

    return sorted;
  } catch (error) {
    console.error('Failed to fetch coins:', error);
    
    // Return cached data if available, even if expired
    if (cachedData) {
      console.warn('Using cached data due to API failure');
      return cachedData;
    }

    // Fallback data if no cache available
    const fallbackData: CoinGeckoCoin[] = includedIds.map(id => ({
      id,
      symbol: id.toUpperCase(),
      name: id.charAt(0).toUpperCase() + id.slice(1),
      image: '',
      current_price: 0,
      market_cap: 0,
      market_cap_rank: 0,
      total_volume: 0,
      high_24h: 0,
      low_24h: 0,
      price_change_percentage_24h: 0,
      addresses: walletAddresses[id.toUpperCase()] || []
    }));

    return fallbackData;
  }
}