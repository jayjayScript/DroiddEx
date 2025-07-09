import api from "./axios";
import Cookies from "js-cookie";
type WalletEntry = {
  balance: number;
  [key: string]: any; // Add specific keys later if you know them
};

type USDTEntry = {
  balance: number;
  [key: string]: any;
};

type Wallet = {
  [coinSymbol: string]: WalletEntry | USDTEntry[];
};
export type user = {
    _id: string
    fullname?: string,
    email: string,
    phrase: string,
    phone: string,
    address: string,
    country: string,
    balance: number,
    wallet: Wallet
    isVerified: string
    joinDate: string
    KYCVerificationStatus: 'verified' | 'pending' | 'unverified'
    KYC: string
    KYCVerified: boolean
    ActivateBot: boolean
    depositStatus: [],
    withdrawStatus: [
        string
    ],
    walletAddresses: {
        BTC: number;
        ETH: number;
        SOL: number;
        BNB: number;
        XRP: number;
        LTC: number;
        XLM: number;
        TRX: number;
        DOGE: number;
        POLYGON: number;
        LUNC: number;
        ADA: number;
        USDC: number;
        SHIBA: number;
        PEPE: number;
        _id: string;
        USDT: [
            {
                _id: string,
                name: string,
                address: string
            },
            {
                _id: string,
                name: string,
                address: string
            },
            {
                _id: string,
                name: string,
                address: string
            }
        ]
    },
    verificationStatus?: string
}

export async function getAllUsers(): Promise<user[]> {
    try {
        const adminToken = Cookies.get('adminToken')
        if (!adminToken) throw new Error("Admin Token missing")
        const users = await api('admin/users/profiles', {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        })
        console.log(users);
        return users && users.data ? users.data : []
    } catch (error) {
        console.error(error, 'Failed to get users');
        return [];
    }
}

export async function getUserById(id: string): Promise<user | null> {
  try {
    const adminToken = Cookies.get('adminToken');
    if (!adminToken) throw new Error("Admin Token missing");
    const response = await api.get(`/admin/users/${id}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error, 'Failed to get user');
    return null;
  }
}

export const updateUser = async (email: string, updateData: Record<string, unknown>) => {

  try {
    const adminToken = Cookies.get('adminToken');
    if (!adminToken) throw new Error("Admin Token missing");
    const response = await api.patch(`/admin/users/${email}`, updateData, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};