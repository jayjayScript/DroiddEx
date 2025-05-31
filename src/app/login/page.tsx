'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginWithSeed } from '@/lib/auth';
import Cookies from 'js-cookie';


const LoginPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', phrase: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
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
      const data = await loginWithSeed(form.email, form.phrase); // treat password as phrase
      handleLoginSuccess(data.token)
      setLoading(false);

      alert('Login successful!');
      router.push('/dashboard');
    } catch (err: any) {
      setLoading(false);
      alert(err.response?.data?.message || 'Login failed');
    }
  };


  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1E1E1E] rounded-lg shadow-lg p-8">
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">Login</h2>

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
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Password</label>
            <input
              type="text"
              name='phrase'
              className="w-full p-3 rounded bg-[#2A2A2A] text-white outline-none focus:ring-2 focus:ring-[#ebb70c]"
              value={form.phrase}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#ebb70c] hover:scale-105 transition-all duration-300 ease-in-out text-black font-semibold py-3 rounded cursor-pointer"
          >
            Log In
          </button>

          <div className='text-[#fff]'>Don&apos;t have an account? <Link href='./create-wallet' className='text-[#ebb70c] cursor-pointer'>signup</Link></div>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;
