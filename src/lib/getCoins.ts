// lib/getCoins.ts
export async function getCoins() {
  const res = await fetch("https://api.coinpaprika.com/v1/tickers");
  const data = await res.json();

  const includedSymbols = ["ETH", "SOL", "BTC", "BNB", "XRP", "LTC", "XLM", "TRX", "DOGE"];

  const filtered = data
    .filter((coin: any) => includedSymbols.includes(coin.symbol))
    .sort(
      (a: any, b: any) =>
        includedSymbols.indexOf(a.symbol) - includedSymbols.indexOf(b.symbol)
    );

  return filtered;
}



