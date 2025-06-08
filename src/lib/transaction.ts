// import { get } from "http";
import api from "./axios";
import Cookies from "js-cookie";

// api/deposit.ts or wherever you keep your API functions

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
  formData.append('image', image);  // Make sure this key matches your backend

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
  const response = await fetch('/api/deposit', {
    method: 'POST',
    body: formData,  // Don't set Content-Type header, let browser set it
    headers: {
        Authorization: `Bearer ${token}`,
    }
  });

  const result = await response.json();
  console.log("API response:", result);
  
  if (!response.ok) {
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
                Authorization: `Bearer ${token}`
            }
        })

        return withdrawData;
    } catch(error) {
        console.error('Withdraw API Error:', error);
        throw error;
    }

}
// Alternative version if you prefer to pass an object
// export const DepositWithObject = async (depositData: {
//     coin: string;
//     amount: number;
//     // Add other fields from your DepositDto here
// }, image: File) => {
//     try {
//         const formData = new FormData();
        
//         // Add the image file
//         formData.append('image', image);
        
//         // Add all depositData fields to formData
//         Object.keys(depositData).forEach(key => {
//             const value = depositData[key as keyof typeof depositData];
//             formData.append(key, value.toString());
//         });
        
//         const response = await api.post('/transaction/recieve', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             }
//         });
        
//         return response;
//     } catch (error) {
//         console.error('Deposit API Error:', error);
//         throw error;
//     }
// };