/* ────────────────────────────────
   Wallet‑related primitives
   ──────────────────────────────── */

interface WalletItem {
  address: string;
  balance: number;          // stored in smallest unit (e.g. satoshi, wei)
}

interface USDTAddress {
  name: string;             // e.g. "USDT (ERC20)"
  address: string;
}

/* ────────────────────────────────
   Activity‑specific sub‑documents
   ──────────────────────────────── */

interface WithdrawalWallet {
  walletAddress: string;
  amount: number;
  coin: string;
  network: string;
}

interface DepositWallet {
  amount: number;
  coin: string;
  /** image URL or storage key */
  recieptImage: string;
}

/* Literal‑union for status fields */
type TxStatus = 'pending' | 'completed' | 'failed';

/* ────────────────────────────────
   Master Wallet document
   ──────────────────────────────── */

interface Wallet {
  BTC: WalletItem;
  ETH: WalletItem;
  SOL: WalletItem;
  BNB: WalletItem;
  XRP: WalletItem;
  LTC: WalletItem;
  XLM: WalletItem;
  TRX: WalletItem;
  DOGE: WalletItem;
  POLYGON: WalletItem;
  LUNC: WalletItem;
  ADA: WalletItem;

  /** Each network variant tracked independently */
  USDT: USDTAddress[];

  USDC: WalletItem;
  SHIBA: WalletItem;
  PEPE: WalletItem;
}

/* ────────────────────────────────
   Root User document
   ──────────────────────────────── */

interface UserType {
  /** MongoDB object ID (stringified) */
  _id?: string;

  fullname?: string;

  /* ─ Core auth fields ─ */
  email: string;
  phrase: string;               // recovery phrase

  /* ─ Optional KYC/profile data ─ */
  country?: string;
  phone?: string;
  address?: string;

  /* ─ Wallets ─ */
  wallet: Wallet;

  /* ─ Deposit / withdraw metadata ─ */
  depositWallet?: DepositWallet;
  depositStatus?: TxStatus;

  withdrawalWallet?: WithdrawalWallet;
  withdrawStatus?: TxStatus;

  /* ─ Verification / activation ─ */
  verificationStatus: 'verified' | 'pending' | 'unverified'
  isVerified: boolean;
  activation: boolean;

  /* ─ KYC Verification ─ */
  KYCVerified: boolean
  KYCVerificationStatus: 'verified' | 'pending' | 'unverified'

  /** One‑time activation token (sent via email / SMS) */
  activationCode?: string;
  /** Unix epoch (ms) when the code expires */
  activationCodeValidation?: number;

  /* ─ Feature toggles ─ */
  ActivateBot: boolean;

  /* ─ Metadata ─ */
  joinDate: string | Date;      // ISO string once serialized to JSON
  createdAt?: string | Date;    // added by `{ timestamps: true }`
  updatedAt?: string | Date;
}


type UserContextType = {
   user: UserType;
   setUser: React.Dispatch<React.SetStateAction<UserContextType['user']>>
}

type AllUserContextType = {
  allUsers: UserType[]
  setAllUsers: React.Dispatch<React.SetStateAction<AllUserContextType['allUsers']>>
}

type UserResponse = {
  users: UserType[],
  limit: number
  page: number
  total: number
  totalPages: number
}