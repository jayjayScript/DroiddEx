'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }

    if (data.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1E1E1E] rounded-lg shadow-lg p-8">
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded bg-[#2A2A2A] text-white outline-none focus:ring-2 focus:ring-[#ebb70c]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded bg-[#2A2A2A] text-white outline-none focus:ring-2 focus:ring-[#ebb70c]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
