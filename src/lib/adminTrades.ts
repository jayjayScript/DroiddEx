import api from './axios';
import Cookies from 'js-cookie';
import { CopyTradeType, TradeDetail } from '@/app/(dashboard)/copy-trading/components/CopyTradeCard';

// ------------------------------------------------------------------
// Backend Interfaces
// ------------------------------------------------------------------

interface BackendTrade {
  _id: string;
  trader_name: string;
  country?: string;
  symbol?: string;
  leverage: number;
  trade_price: number;
  winrate?: number;
  last_10_trades?: number[];
}

// ------------------------------------------------------------------
// Helper
// ------------------------------------------------------------------

const getAdminHeaders = () => ({
  headers: { Authorization: `Bearer ${Cookies.get('adminToken')}` },
});

const getCoinIcon = (symbol: string) => {
  const s = symbol.toUpperCase();
  const map: Record<string, string> = {
    BTC: 'cryptocurrency-color:btc', ETH: 'cryptocurrency-color:eth',
    SOL: 'cryptocurrency-color:sol', BNB: 'cryptocurrency-color:bnb',
    XRP: 'cryptocurrency-color:xrp', LTC: 'cryptocurrency-color:ltc',
    DOGE: 'cryptocurrency-color:doge', ADA: 'cryptocurrency-color:ada',
    USDT: 'cryptocurrency-color:usdt', USDC: 'cryptocurrency-color:usdc',
  };
  return map[s] || 'cryptocurrency:question';
};

export const mapBackendTradeToFrontend = (t: BackendTrade): CopyTradeType => {
  const last10Trades: TradeDetail[] = (t.last_10_trades || []).map((num: number) => ({
    isWin: num > 0,
    pnl: Math.abs(num),
  }));
  return {
    id: t._id,
    traderName: t.trader_name,
    countryCode: t.country || 'us',
    coinSymbol: (t.symbol || '').toUpperCase(),
    coinIcon: getCoinIcon(t.symbol || ''),
    leverage: t.leverage,
    price: t.trade_price,
    last10Trades,
  };
};

// ------------------------------------------------------------------
// Admin API Calls (use admin token)
// ------------------------------------------------------------------

/** Fetch all available trades (same endpoint as user, no admin token needed) */
export const adminGetAllTrades = async (): Promise<CopyTradeType[]> => {
  try {
    const res = await api.get('/admin/all-trades?limit=100&page=1', getAdminHeaders());
    const trades: BackendTrade[] = res.data.trades || [];
    return trades.map(mapBackendTradeToFrontend);
  } catch (error) {
    console.error('[Admin] Failed to fetch trades', error);
    return [];
  }
};

/** Create a new trade card */
export const adminCreateTrade = async (body: {
  trader_name: string;
  country: string;
  symbol: string;
  leverage: number;
  trade_price: number;
  winrate: number;
  last_10_trades: number[];
}) => {
  const res = await api.post('/admin/create-trade', body, getAdminHeaders());
  return res.data;
};

/** Update an existing trade card */
export const adminUpdateTrade = async (tradeId: string, body: {
  trader_name?: string;
  country?: string;
  symbol?: string;
  leverage?: number;
  trade_price?: number;
  winrate?: number;
  last_10_trades?: number[];
}) => {
  const res = await api.patch(`/admin/update-trade?tradeId=${tradeId}`, body, getAdminHeaders());
  return res.data;
};

/** Delete a trade card */
export const adminDeleteTrade = async (tradeId: string) => {
  const res = await api.delete(`/admin/delete-trade?tradeId=${tradeId}`, getAdminHeaders());
  return res.data;
};

/** Update a user's active trade PNL */
export const adminUpdateUserActiveTrade = async (email: string, tradeId: string, PNL: number) => {
  const res = await api.patch(
    `/admin/update-user-active-trades?email=${email}&tradeId=${tradeId}`,
    { PNL },
    getAdminHeaders()
  );
  return res.data;
};
