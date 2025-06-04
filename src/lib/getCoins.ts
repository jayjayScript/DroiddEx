// lib/getCoins.ts

interface Coin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_15m: number;
      percent_change_30m: number;
      percent_change_1h: number;
      percent_change_6h: number;
      percent_change_12h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_1y: number;
      ath_price: number;
      ath_date: string;
      percent_from_price_ath: number;
    };
  };
}

export async function getCoins(): Promise<Coin[]> {
  const res = await fetch("https://api.coinpaprika.com/v1/tickers");
  const data: Coin[] = await res.json();

  const includedSymbols = ["ETH", "SOL", "BTC", "BNB", "XRP", "LTC", "XLM", "TRX", "DOGE"];

  const filtered = data
    .filter((coin) => includedSymbols.includes(coin.symbol))
    .sort(
      (a, b) =>
        includedSymbols.indexOf(a.symbol) - includedSymbols.indexOf(b.symbol)
    );

  return filtered;
}
