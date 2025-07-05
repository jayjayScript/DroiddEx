const symbolMap: Record<string, string> = {
  BTC: 'BTCUSDT',
  ETH: 'ETHUSDT',
  SOL: 'SOLUSDT',
  BNB: 'BNBUSDT',
  XRP: 'XRPUSDT',
  LTC: 'LTCUSDT',
  XLM: 'XLMUSDT',
  TRX: 'TRXUSDT',
  DOGE: 'DOGEUSDT',
  POLYGON: 'MATICUSDT',
  LUNC: 'LUNCUSDT',
  ADA: 'ADAUSDT',
  USDT: 'USDTUSDT',
  USDC: 'USDCUSDT',
  SHIB: 'SHIBUSDT',
  PEPE: 'PEPEUSDT',
};

const fetchBinancePrices = async (): Promise<Record<string, number>> => {
  const prices: Record<string, number> = {};

  await Promise.all(
    Object.entries(symbolMap).map(async ([coin, binanceSymbol]) => {
      try {
        if (binanceSymbol === 'USDTUSDT') {
          prices[coin] = 1;
        } else {
          const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`);
          const data = await res.json();
          prices[coin] = parseFloat(data.price);
        }
      } catch (err) {
        console.error(`Error fetching ${coin}`, err);
        prices[coin] = 0;
      }
    })
  );

  return prices
}

export default fetchBinancePrices