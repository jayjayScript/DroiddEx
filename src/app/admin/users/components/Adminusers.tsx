"use client"

import React, { useEffect, useState } from 'react';
import { Search, Users, Eye, DollarSign, UserCheck, UserX, Filter, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAllUsers } from '@/lib/admin';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  interface User {
    fullname?: string;
    email: string;
    balance: number;
    status: 'verified' | 'unverified' | 'suspended' | string;
    joinDate: string;
    avatar?: string;
    id: string | number;
    username?: string;
  }

  const [users, setUsers] = useState<User[]>([])
  const router = useRouter();

  interface HandleViewUser {
    (userId: string): void;
  }

  const handleViewUser: HandleViewUser = (userId) => {
    router.push(`/admin/users/${userId}`);
  };

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const getusers = await getAllUsers();
      const usersList = getusers?.map(user => ({
        fullname: user.fullname,
        email: user.email,
        balance: user.balance,
        status: user.isVerified, // Make sure this matches your filter values
        joinDate: user.joinDate,
        username: user.fullname,
        id: user._id,
      }));
      setUsers(usersList);
    } catch (error) {
      // handle error
      toast.error('Failed to get users')
      console.log(error)
    }
  };
  fetchUsers();
}, []);

  // Sample user data
  // const usersList = [
  //   {
  //     id: 1,
  //     username: 'john_crypto',
  //     email: 'john@example.com',
  //     balance: '$12,450.80',
  //     status: 'verified',
  //     joinDate: '2024-01-15',
  //     lastActive: '2 hours ago',
  //     avatar: 'JC'
  //   },
  //   {
  //     id: 2,
  //     username: 'sarah_trader',
  //     email: 'sarah@example.com',
  //     balance: '$8,750.25',
  //     status: 'verified',
  //     joinDate: '2024-02-08',
  //     lastActive: '1 day ago',
  //     avatar: 'ST'
  //   },
  //   {
  //     id: 3,
  //     username: 'mike_hodl',
  //     email: 'mike@example.com',
  //     balance: '$25,890.50',
  //     status: 'unverified',
  //     joinDate: '2023-11-22',
  //     lastActive: '1 week ago',
  //     avatar: 'MH'
  //   },
  //   {
  //     id: 4,
  //     username: 'crypto_alice',
  //     email: 'alice@example.com',
  //     balance: '$5,620.75',
  //     status: 'verified',
  //     joinDate: '2024-03-10',
  //     lastActive: '5 minutes ago',
  //     avatar: 'CA'
  //   },
  //   {
  //     id: 5,
  //     username: 'btc_bob',
  //     email: 'bob@example.com',
  //     balance: '$0.00',
  //     status: 'suspended',
  //     joinDate: '2024-01-05',
  //     lastActive: '2 weeks ago',
  //     avatar: 'BB'
  //   },
  //   {
  //     id: 6,
  //     username: 'eth_emma',
  //     email: 'emma@example.com',
  //     balance: '$18,920.30',
  //     status: 'verified',
  //     joinDate: '2023-12-18',
  //     lastActive: '30 minutes ago',
  //     avatar: 'EE'
  //   }
  // ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch = (user.fullname ?? '').toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: User['status']): string => {
    switch (status) {
      case 'verified':
        return 'bg-green-900 text-green-300';
      case 'unverified':
        return 'bg-yellow-900 text-yellow-300';
      case 'suspended':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  // interface StatusIconProps {
  //   status: User['status'];
  // }

  const getStatusIcon = (status: User['status']): React.ReactElement | null => {
    switch (status) {
      case 'verified':
        return <UserCheck className="w-3 h-3" />;
      case 'unverified':
        return <UserX className="w-3 h-3" />;
      case 'suspended':
        return <UserX className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-2 min-h-screen" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="rounded-xl shadow-sm border" style={{ backgroundColor: '#2a2a2a', borderColor: '#3a3a3a' }}>
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: '#3a3a3a' }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#ebb70c' }}>
              <Users className="w-6 h-6" style={{ color: '#1a1a1a' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">User Management</h1>
              <p className="text-gray-400 mt-1">Manage and monitor user accounts and balances</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users by username or email..."
                className="w-full pl-10 pr-4 py-2 rounded-lg text-white outline-none transition-colors duration-200 border"
                style={{ backgroundColor: '#1a1a1a', borderColor: '#3a3a3a' }}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 rounded-lg text-white outline-none appearance-none cursor-pointer border"
                style={{ backgroundColor: '#1a1a1a', borderColor: '#3a3a3a' }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6 border-b" style={{ borderColor: '#3a3a3a' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                </div>
                <Users className="w-8 h-8" style={{ color: '#ebb70c' }} />
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-green-400">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Suspended</p>
                  <p className="text-2xl font-bold text-red-400">
                    {users.filter(u => u.status === 'suspended').length}
                  </p>
                </div>
                <UserX className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="p-6">
          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div key={user.id}
                  className="p-6 rounded-lg border hover:shadow-lg transition-all duration-200"
                  style={{ backgroundColor: '#2a2a2a', borderColor: '#3a3a3a' }}>
                  {/* User Header */}
                  <div className="flex items-center space-x-2 md:space-x-2 mb-4">
                    <div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium"
                        style={{ backgroundColor: '#ebb70c', color: '#1a1a1a' }}>
                        {user.avatar}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-lg">{user.username}</h3>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(user.status)}`}>
                      {getStatusIcon(user.status)}
                      <span>{user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Unknown'}</span>
                    </span>
                  </div>

                  {/* User Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Balance</span>
                      <span className="text-white font-semibold text-lg">{user.balance}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Join Date</span>
                      <span className="text-gray-300 text-sm">{user.joinDate}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      className="flex-1 p-2 rounded-lg transition-colors duration-200 hover:bg-opacity-80 flex items-center justify-center space-x-1"
                      style={{ backgroundColor: '#ebb70c', color: '#1a1a1a' }}
                      onClick={() => handleViewUser(user.id.toString())}
                      title="View User">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">View</span>
                    </button>
                    <button
                      className="flex-1 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1"
                      title="Edit User">
                      <Edit className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit</span>
                    </button>
                  </div>

                  <div className="flex space-x-2 mt-2">
                    <button
                      className="flex-1 p-2 rounded-lg bg-gray-600 text-gray-300 hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-1"
                      title="Update Balance">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-medium">Balance</span>
                    </button>
                    <button
                      className="flex-1 p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-1"
                      title="Delete User">
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t rounded-b-xl"
            style={{ backgroundColor: '#1a1a1a', borderColor: '#3a3a3a' }}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
              <span className="text-gray-400">
                Showing {filteredUsers.length} of {users.length} users
              </span>
              <div className="flex space-x-4">
                <span className="text-green-400">
                  Active: {filteredUsers.filter(u => u.status === 'active').length}
                </span>
                <span className="text-yellow-400">
                  Inactive: {filteredUsers.filter(u => u.status === 'inactive').length}
                </span>
                <span className="text-red-400">
                  Suspended: {filteredUsers.filter(u => u.status === 'suspended').length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;