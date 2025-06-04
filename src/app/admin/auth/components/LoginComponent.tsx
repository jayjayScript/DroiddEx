'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin} from '@/lib/auth';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next'; 
import toast from 'react-hot-toast';




const LoginComponent = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { t, ready } = useTranslation('common');

  if(!ready) return null;


  interface LoginForm {
    email: string;
    password: string;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function handleLoginSuccess(token: string) {
    Cookies.set('token', token, {
      expires: 7, // days
      secure: true,
      sameSite: 'lax',
    });
  }


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await adminLogin(form.email, form.password); // treat password as phrase
      handleLoginSuccess(data.token)
      setLoading(false);

      toast.success('Login Successful!')
      router.push('/admin');
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };


  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <div className='hidden'>{loading}</div>
      <div className="w-full max-w-md bg-[#1E1E1E] rounded-lg shadow-lg p-6">
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">{t('login.title')}</h2>

        {/* {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>} */}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">{t('login.email')}</label>
            <input
              type="email"
              name='email'
              className="w-full p-3 rounded bg-[#2A2A2A] text-white outline-none focus:ring-2 focus:ring-[#ebb70c]"
              value={form.email}
              onChange={handleChange}
              placeholder={t("login.placeholder.email")}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">{t('login.password')}</label>
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
            className="w-full bg-[#ebb70c] hover:scale-105 transition-all duration-300 ease-in-out text-black font-semibold py-3 rounded cursor-pointer"
          >
            {t('login.button')}
          </button>

          {/* <div className='text-[#fff]'>{t('login.signupPrompt')} <Link href='./create-wallet' className='text-[#ebb70c] cursor-pointer'>{t('login.signupLink')}</Link></div> */}

        </form>
      </div>
    </div>
  );
};

export default LoginComponent;

