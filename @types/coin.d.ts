type CoinQuote = {
  USD: {
    price: number;
    market_cap: number;
    percent_change_24h: number;
  };
};

type Coin = {
  id: string;
  name: string;
  symbol: string;
  quotes: CoinQuote;
};