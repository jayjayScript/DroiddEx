
type adminType = {
   email: string;
   password: string;
   totalDeposit: number;
   totalWithdraw: number;
   ProfitStop: number;
   totalTransactions: number;
   walletAddress: string;
   whatsappLink: string;
   telegramLink: string;
}

type AdminContextType = {
   admin: adminType;
   setAdmin: React.Dispatch<React.SetStateAction<AdminContextType['admin']>>
}