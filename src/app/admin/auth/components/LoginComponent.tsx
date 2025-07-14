'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/lib/auth';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';


interface LoginForm {
  email: string;
  password: string;
}

const LoginComponent = () => {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function handleLoginSuccess(token: string) {
    Cookies.set('adminToken', token, {
      expires: 7, // days
      secure: true,
      sameSite: 'lax',
    });
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await adminLogin(form.email, form.password); // treat password as phrase
      handleLoginSuccess(data.adminToken)
      console.log(data)
      setLoading(false);

      toast.success('Login Successful!')
      router.push('/admin');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error('Failed to save settings: ' + err.response?.data.message);
      } else {
        toast.error('Failed To log in')
      }
    }
  };


  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <div className='hidden'>{loading}</div>
      <div className="w-full max-w-md bg-[#1E1E1E] rounded-lg shadow-lg p-6">
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">Admin Login</h2>

        {/* {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>} */}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Email</label>
            <input
              type="email"
              name='email'
              className="w-full p-3 rounded bg-[#2A2A2A] text-white outline-none focus:ring-2 focus:ring-[#ebb70c]"
              value={form.email}
              onChange={handleChange}
              placeholder="Admin Email"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Password</label>
            <input
              type="password"
              name='password'
              className="w-full p-3 rounded bg-[#2A2A2A] text-white outline-none focus:ring-2 focus:ring-[#ebb70c]"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ebb70c] hover:scale-105 transition-all duration-300 ease-in-out text-black font-semibold py-3 rounded cursor-pointer"
          >
            Login
          </button>

          {/* <div className='text-[#fff]'>{t('login.signupPrompt')} <Link href='./create-wallet' className='text-[#ebb70c] cursor-pointer'>{t('login.signupLink')}</Link></div> */}

        </form>
      </div>
    </div>
  );
};

export default LoginComponent;

