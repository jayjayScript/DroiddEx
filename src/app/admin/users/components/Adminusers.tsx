// src/app/dashboard/admin/users/page.tsx

'use client';

import Link from 'next/link';
import React, { useState } from 'react';

const dummyUsers = [
  {
    id: '1',
    username: 'johndoe',
    email: 'johndoe@email.com',
    balance: '$2,500',
    status: 'active',
  },
  {
    id: '2',
    username: 'janesmith',
    email: 'jane@email.com',
    balance: '$1,200',
    status: 'inactive',
  },
  {
    id: '3',
    username: 'btc_whale',
    email: 'btc@email.com',
    balance: '$150,000',
    status: 'active',
  },
];

const AdminUsers = () => {
  const [search, setSearch] = useState('');

  const filteredUsers = dummyUsers.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-6">Users</h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full sm:w-1/3 p-2 rounded bg-[#2A2A2A] text-white outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#2A2A2A] rounded-lg text-sm">
          <thead>
            <tr className="bg-[#1F1F1F] text-white/70">
              <th className="text-left p-3">Username</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Balance</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-white/10">
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.balance}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${user.status === 'active'
                        ? 'bg-green-600'
                        : 'bg-red-600'
                      }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3">
                  <Link href={`/admin/users/${user.id}`}>
                    <button className="text-blue-400 hover:underline text-xs mr-2">
                      View
                    </button>
                  </Link>
                  <button className="text-yellow-400 hover:underline text-xs">
                    Update Balance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="text-white/70 mt-4">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
