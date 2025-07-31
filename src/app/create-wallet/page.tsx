'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';

const Page = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!form.email) {
        toast.error('Email is missing');
        return;
      }
      const response = await api<boolean>(`/seed/checkUser?email=${form.email}`)
      if (!response.data) {
        toast.error('User Already Exist, Please Use Another Email')
        return
      }
      sessionStorage.setItem('userEmail', form.email);
      router.push('/seedPhrase');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message)
      } else {
        toast.error('An error occurred during signup')
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#121212] h-[99.8vh] px-4">
      <Link href='/' className='cursor-pointer'>
        <Icon icon="ic:outline-home" width={27} height={27} className="text-[#ebb70c] translate-y-[20px] " />
      </Link>

      <div className='flex items-center justify-center translate-y-[50%]'>
        <div className="w-full max-w-md bg-[#1E1E1E] rounded-lg shadow-lg p-8 translate-y-[-10%]">
          <h2 className="text-white text-2xl font-semibold mb-6 text-center">Sign Up</h2>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[{ label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com' }].map(
              ({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="text-sm text-gray-300 mb-1 block">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={form[name as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full p-3 rounded bg-[#2A2A2A] text-white outline-none focus:ring-2 focus:ring-[#ebb70c]"
                    required
                  />
                </div>
              )
            )}

            <button
              type="submit"
              className="w-full text-[#fff] bg-[#ebb70c] hover:scale-105 transition-all duration-300 ease-in-out font-semibold py-3 rounded cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Generating Phrase...' : 'Proceed'}
            </button>
          </form>

          <div className="text-[#fff] mt-5">
            Already have an account?{' '}
            <Link href="./login" className="text-[#ebb70c] cursor-pointer">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
