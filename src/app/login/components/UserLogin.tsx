'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { login } from '@/store/user';
import toast from 'react-hot-toast';
import { Icon } from '@iconify/react/dist/iconify.js';
import api from '@/lib/axios';
import { AxiosError } from 'axios';



const UserLogin = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', phrase: '' });
  const [loading, setLoading] = useState(false);
  const [toggleView, setToggleView] = useState(false)
  const { t, ready } = useTranslation();
  const dispatch = useDispatch()

  if (!ready) return null

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post<{ email: string, phrase: string, token: string }>('/seed/login', { email: form.email, phrase: form.phrase });
      handleLoginSuccess(res.data.token)
      dispatch(login({ email: res.data.email, phrase: res.data.phrase }));
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message)
      } else {
        toast.error('Failed to generate seed phrase please Try again later or reload page');
      }
    } finally { setLoading(false) }
  };

  const handlePhraseView = () => {
    setToggleView(!toggleView);
  }

  return (
    <div className="min-h-screen bg-[#121212] px-4">
      <Link href='/' className='cursor-pointer'>
        <Icon icon="ic:outline-home" width={27} height={27} className="text-[#ebb70c] translate-y-[20px] " />
      </Link>

      <div className='flex justify-center items-center mt-10'>
        <div className="w-full max-w-md bg-[#1E1E1E] rounded-lg shadow-lg p-6">
          <h2 className="text-white text-2xl font-semibold mb-6 text-center">{t('login.title')}</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">{t('login.email')}</label>
              <input
                type="email"
                name='email'
                className="w-full p-3 rounded bg-[#2A2A2A] text-white outline-none focus:ring-2 focus:ring-[#ebb70c]"
                value={form.email}
                onChange={handleChange}
                placeholder='example@gmail.com'
                required
              />
            </div>

            <div className='flex gap-2'>
              <div className='flex-1'>
                <label className="text-sm text-gray-300 mb-1 block">Seed Phrase</label>
                <input
                  type={toggleView ? "text" : "password"}
                  name='phrase'
                  className="w-full p-3 rounded bg-[#2A2A2A] text-white outline-none focus:ring-2 focus:ring-[#ebb70c]"
                  value={form.phrase}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Icon className='mt-[3rem]' icon={toggleView ? "simple-line-icons:eye" : "iconamoon:eye-off-light"} width="22" height="22" onClick={handlePhraseView} />
            </div>
            {loading && (
              <div className="text-yellow-400 text-sm text-center animate-pulse">Authenticating...</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ebb70c] hover:scale-105 transition-all duration-300 ease-in-out text-black font-semibold py-3 rounded cursor-pointer"
            >
              {t('login.button')}
            </button>
            <div className='text-[#fff]'>{t('login.signupPrompt')} <Link href='./create-wallet' className='text-[#ebb70c] cursor-pointer'>{t('login.signupLink')}</Link></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
