import axios from 'axios';

const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

export const getCoinData = async (coinId: string) => {
  const headers = {
    'x-cg-api-key': COINGECKO_API_KEY || '',
  };

  try {
    const marketRes = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}`,
      { headers }
    );

    const marketData = marketRes.data.market_data;

    return {
      currentPrice: marketData.current_price.usd,
      priceChange: marketData.price_change_percentage_24h,
      high24h: marketData.high_24h.usd,
      low24h: marketData.low_24h.usd,
      volumeBTC: marketData.total_volume.btc,
      volumeUSDT: marketData.total_volume.usd,
    };
  } catch (error: any) {
    console.error('Market API error:', error?.response?.data || error.message);
    throw error;
  }
};


