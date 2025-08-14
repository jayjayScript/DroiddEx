/* ────────────────────────────────
   Literal‑union helpers
   ──────────────────────────────── */

type TransactionType   = 'deposit' | 'withdrawal' | 'plans' | 'yield' | 'swap' | 'buy' | 'sell';
type TransactionStatus = 'pending' | 'completed' | 'failed';

/* ────────────────────────────────
   Root UserTransaction document
   ──────────────────────────────── */

interface UserTransactionType {
  /** MongoDB document ID (string form when serialized) */
  _id: string;

  /** References the user by e‑mail (stringified ObjectId in DB, plain e‑mail here) */
  email: string;

  /** 'deposit' | 'withdrawal' */
  type: TransactionType;

  /** Amount denominated in smallest unit (wei, satoshi, etc.) */
  amount: number;

  /** 'pending' | 'completed' | 'failed' */
  status: TransactionStatus;

  /** Coin symbol, e.g. 'USDT', 'BTC' */
  Coin: string;

  /** Network (for multi‑chain coins, e.g. 'ERC20', 'TRC20'); null if not applicable */
  network: string | null;

  /** Free‑form user/admin notes */
  note?: string;

  /** Receipt or proof image URL / storage key */
  image?: string;

  /** Destination wallet address for withdrawals */
  withdrawWalletAddress?: string;

  /** Transaction date */
  date: string;

  /* Added automatically by `{ timestamps: true }` */
  createdAt?: string;
  updatedAt?: string;
}

interface TransactionHistoryResponse {
   success: boolean;
   message: string;
   data: {
      transactions: UserTransactionType[];
      page: number;
      limit: number;
      totalPages: number;
      total: number;
   }
}