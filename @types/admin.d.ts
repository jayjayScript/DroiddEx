type USDTAddress = {
   name: string;
   address: string;
};

type WalletAddresses = {
   BTC?: string;
   ETH?: string;
   SOL?: string;
   BNB?: string;
   XRP?: string;
   LTC?: string;
   XLM?: string;
   TRX?: string;
   DOGE?: string;
   POLYGON?: string;
   LUNC?: string;
   ADA?: string;
   USDT?: USDTAddress[];
   USDC?: string;
   SHIBA?: string;
   PEPE?: string;
};

type adminType = {
   email: string;
   password?: string;
   minDepositAmount?: number;
   maxDepositAmount?: number;
   minWithdrawalAmount?: number;
   maxWithdrawalAmount?: number;
   addresses?: WalletAddresses;
}

type AdminContextType = {
   admin: adminType;
   setAdmin: React.Dispatch<React.SetStateAction<AdminContextType['admin']>>
}