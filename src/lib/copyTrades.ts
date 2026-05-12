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

interface BackendActiveTrade {
  tradeId: string;
  trader_name: string;
  country?: string;
  symbol?: string;
  leverage: number;
  PNL?: number;
  winrate?: number;
}

// ------------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------------

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${Cookies.get('token')}` },
});

const getCoinIcon = (symbol: string) => {
  const s = symbol.toUpperCase();
  if (s === 'BTC') return 'cryptocurrency:btc';
  if (s === 'ETH') return 'cryptocurrency:eth';
  if (s === 'SOL') return 'cryptocurrency:sol';
  if (s === 'BNB') return 'cryptocurrency:bnb';
  if (s === 'XRP') return 'cryptocurrency:xrp';
  if (s === 'LTC') return 'cryptocurrency:ltc';
  if (s === 'DOGE') return 'cryptocurrency:doge';
  if (s === 'ADA') return 'cryptocurrency:ada';
  if (s === 'USDT') return 'cryptocurrency:usdt';
  if (s === 'USDC') return 'cryptocurrency:usdc';
  return 'cryptocurrency:question'; // Fallback
};

// ------------------------------------------------------------------
// API Calls
// ------------------------------------------------------------------

export const getAllTrades = async (limit = 50, page = 1): Promise<CopyTradeType[]> => {
  try {
    const res = await api.get(`/copy-trading/all-trades?limit=${limit}&page=${page}`, getAuthHeaders());
    
    // Map backend Trade structure to frontend CopyTradeType
    const trades = res.data.trades || [];
    return trades.map((t: BackendTrade) => {
      const last10Trades: TradeDetail[] = (t.last_10_trades || []).map((num: number) => ({
        isWin: num > 0,
        pnl: Math.abs(num)
      }));

      return {
        id: t._id,
        traderName: t.trader_name,
        countryCode: t.country || 'us',
        coinSymbol: (t.symbol || '').toUpperCase(),
        coinIcon: getCoinIcon(t.symbol || ''),
        leverage: t.leverage,
        price: t.trade_price,
        winrate: t.winrate,
        last10Trades
      };
    });
  } catch (error) {
    console.error('Failed to get all trades', error);
    return [];
  }
};

export const getUserTradingDetails = async () => {
  try {
    const res = await api.get(`/copy-trading/user-trading-details`, getAuthHeaders());
    const data = res.data;
    if (!data) return null;

    // Map active_trades
    const activeTrades: CopyTradeType[] = (data.active_trades || []).map((t: BackendActiveTrade) => ({
      id: t.tradeId,
      traderName: t.trader_name,
      countryCode: t.country || 'us',
      coinSymbol: (t.symbol || '').toUpperCase(),
      coinIcon: getCoinIcon(t.symbol || ''),
      leverage: t.leverage,
      price: t.PNL || 0, // Using price field for PNL display dynamically
      pnl: t.PNL || 0,
      winrate: t.winrate,
      isActive: true,
      last10Trades: [] // Not tracked tightly on active trades
    }));

    return {
      balance: data.balance || 0,
      mainBalance: data.mainBalance || 0,
      activeTrades
    };
  } catch (error) {
    console.error('Failed to get user trading details', error);
    return null;
  }
};

export const depositCopyWallet = async (amount: number) => {
  try {
    const res = await api.post(`/copy-trading/deposit`, { amount }, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error('Failed to deposit into copy wallet', error);
    throw error;
  }
};

export const withdrawCopyWallet = async (amount: number) => {
  try {
    const res = await api.post(`/copy-trading/withdraw`, { amount }, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error('Failed to withdraw from copy wallet', error);
    throw error;
  }
};

export const executeCopyTrade = async (tradeId: string) => {
  try {
    const res = await api.post(`/copy-trading/copy-trade`, { tradeId }, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error('Failed to execute copy trade', error);
    throw error;
  }
};

export const liquidateTrade = async (tradeId: string) => {
  try {
    const res = await api.post(`/copy-trading/liquidate`, { tradeId }, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error('Failed to liquidate trade', error);
    throw error;
  }
};
