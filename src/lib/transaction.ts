// import { get } from "http};
import api from "./axios";
import Cookies from "js-cookie";


export const DepositAPI = async (coin: string, amount: number, image: File) => {
  console.log("=== DEPOSIT API DEBUG ===");
  console.log("Received parameters:", { coin, amount, image });
  console.log("Image details:", {
    name: image.name,
    size: image.size,
    type: image.type,
    instanceof: image instanceof File
  });

  const formData = new FormData();
  formData.append('coin', coin);
  formData.append('amount', amount.toString());
  formData.append('image', image as File);  // Make sure this key matches your backend

  // Debug FormData contents
  console.log("FormData entries:");
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
    if (value instanceof File) {
      console.log(`${key} file details:`, {
        name: value.name,
        size: value.size,
        type: value.type
      });
    }
  }

  const token = Cookies.get('token');
  if (!token) throw new Error('No token');
  const response = await api.post('/transaction/recieve', formData, {  // Don't set Content-Type header, let browser set it
    headers: {
        Authorization: `Bearer ${token}`,
    }
  });

  const result = response.data;
  console.log("API response:", result);

  // Axios does not have 'ok', so check for status code
  if (response.status < 200 || response.status >= 300) {
    throw new Error(result.message || 'Deposit failed');
  }

  return result;
};




export const Withdrawal = async (walletAddress: string, amount: number, coin: string, network: string) => {
    
    try{
        console.log('API called with:',
            {
                walletAddress,
                amount,
                coin,
                network
            }
        )

        const formData = new FormData();
        formData.append('walletAddress', walletAddress);
        formData.append('amount', amount.toString());
        formData.append('coin', coin);
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
    const historyData = await api.get('/transaction/history', {
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
      '/profile/crypto/swap',
      { from, to, amount },
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