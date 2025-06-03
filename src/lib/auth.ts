import { useRouter } from "next/navigation";
import api from "./axios";
import Cookies from "js-cookie";

export async function createWallet(data: any) {
  const res = await api.post('/users', data);
  return res.data;
}

export async function generateSeedPhrase() {
  const res = await api.get('/seed');
  return res.data;
}

// Save the seed phrase to the DB after user confirms
export async function saveSeedPhrase(email: string, phrase: string) {
  const res = await api.post('/seed/save', { email, phrase }); // POST /seed/save
  return res.data;
}

export async function loginWithSeed(email: string, phrase: string) {
  const res = await api.post('/seed/login', { email, phrase });
  return res.data; // contains { token }
}


export async function getUserProfile() {

  const token = Cookies.get('token')
  const router = useRouter()

  // if (!token) {
  //   throw new Error('User not authenticated'); // redirect to login here
  //   // router.replace('/login/')
  // }
  try {
    const res = await api('/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    return res.data;
  } catch (error) {
    throw new Error('Failed to get user profile')
  }
}

// export async function generateSeed(email?: string) {
//   const res = await api.get('/seed/generate', {
//     params: { email }
//   });
//   return res.data;
// }

export async function adminLogin(email: string, password: string) {
  const res = await api.post('/admin/auth/login', { email, password });
  return res.data;
}