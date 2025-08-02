// import { get } from "http};
import api from "./axios";
import Cookies from "js-cookie";


export const DepositAPI = async (Coin: string, amount: number, image: string) => {

  const token = Cookies.get('token');
  if (!token) throw new Error('No token');

  // Prepare JSON payload
  const payload = {
    Coin,
    amount,
    image: image, // This is a base64 string, not a File
  };

  const response = await api.post('/transaction/recieve', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  });

  const result = response.data;
  console.log("API response:", result);

  if (response.status < 200 || response.status >= 300) {
    throw new Error(result.message || 'Deposit failed');
  }

  return result;
};




export const Withdrawal = async (walletAddress: string, amount: string, coin: string, network: string) => {
    
    try{
        const formData = new FormData();
        formData.append('walletAddress', walletAddress);
        formData.append('amount', amount.toString());
        formData.append('coin', coin.toUpperCase());
        formData.append('network', network);
        
        console.log('FormData entries:');
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const token = Cookies.get('token');
        if(!token) throw new Error('No token');

        const withdrawData = await api.post('/transaction/send', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            }
        })

        return withdrawData;
    } catch(error) {
        console.error('Withdraw API Error:', error);
        throw error;
    }

}



export const history = async (email: string): Promise<unknown> => {
  const token = Cookies.get('token');
  if (!token) throw new Error('No token');
  try {
    const historyData = await api.get('/transaction/histroy', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: { email }
    });
    return historyData;
  } catch (error) {
    console.error(error, 'Failed to get history');
    return null;
  }
}

export const swapCoins = async (from: string, to: string, amount: number): Promise<unknown> => {
  const token = Cookies.get('token');
  if (!token) throw new Error('No token');
  try {
    const res = await api.post(
      '/transaction/swap',
      { fromCoin: from, Coin: to, amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error('failed to swap coin', error);
    throw error;
  }
}