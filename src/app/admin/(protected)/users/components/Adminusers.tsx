"use client"

import React, { useEffect, useState } from 'react';
import { Search, Users, Eye, DollarSign, UserCheck, UserX, Filter, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { user } from '@/lib/admin';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import Cookies from 'js-cookie';
import { deleteUser } from '@/lib/updateUser';

const AdminUsers = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; email: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
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

  // Updated to pass both id and email for deletion
  const handleDeleteUser = (userId: string, userEmail: string) => {
    setUserToDelete({ id: userId, email: userEmail });
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      console.log('Attempting to delete user:', userToDelete.email);
      
      // Call the deleteUser function with email
      const response = await deleteUser(userToDelete.email);
      console.log('Delete response:', response);
      
      // Remove user from local state using the ID for filtering
      setUsers(users.filter(user => user.id !== userToDelete.id));
      toast.success("User deleted successfully.");
      
    } catch (error) {
      console.error("Error deleting user:", error);
      
      // More detailed error handling
      if (error instanceof Error) {
        toast.error(`Error deleting user: ${error.message}`);
      } else {
        toast.error("An unexpected error occurred while deleting the user.");
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const adminToken = Cookies.get("adminToken");

      if (!adminToken) {
        router.replace("/admin/auth/");
        return;
      }
      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
        const users = await api<user[]>('admin/users/')
        const getusers = users.data
        const usersList = getusers?.map(user => ({
          fullname: user.fullname,
          email: user.email,
          balance: user.balance,
          status: user.isVerified ? 'verified' : 'unverified',
          joinDate: user.joinDate,
          id: user._id,
        }));
        setUsers(usersList);
      } catch (error) {
        toast.error('Failed to get users')
        console.log(error)
      }
    };
    fetchUsers();
  }, [router]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = (user.fullname ?? '').toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Helper to normalize status/isVerified for display and color
  const getNormalizedStatus = (status: string | boolean | undefined) => {
    if (status === true || status === 'true' || status === 'verified') return 'verified';
    if (status === false || status === 'false' || status === 'unverified') return 'unverified';
    if (status === 'suspended' || status === 'banned') return 'suspended';
    return 'unverified';
  };

  const getStatusColor = (status: User['status']): string => {
    const normalized = getNormalizedStatus(status);
    switch (normalized) {
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

  const getStatusIcon = (status: User['status']): React.ReactElement | null => {
    const normalized = getNormalizedStatus(status);
    switch (normalized) {
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

  // Helper to get user initials for avatar
  const getUserInitials = (fullname?: string, email?: string) => {
    if (fullname) {
      return fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="md:max-w-[70%] mx-auto p-2 min-h-screen" style={{ backgroundColor: '#1a1a1a' }}>
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
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
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
                  <p className="text-gray-400 text-sm">Verified Users</p>
                  <p className="text-2xl font-bold text-green-400">
                    {users.filter(u => u.status === 'verified').length}
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
                  className="p-4 rounded-lg border hover:shadow-lg transition-all duration-200"
                  style={{ backgroundColor: '#2a2a2a', borderColor: '#3a3a3a' }}>
                  {/* User Header */}
                  <div className="flex items-center space-x-2 md:space-x-2 mb-4">
                    <div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium"
                        style={{ backgroundColor: '#ebb70c', color: '#1a1a1a' }}>
                        {getUserInitials(user.fullname, user.email)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className='flex items-center justify-between'>
                        <h3 className="text-white font-medium text-[14px]">{user.fullname || 'No Name'}</h3>
                        <span className={`px-1 py-1 rounded-full text-[8px] font-medium flex items-center space-x-1 ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                          <span>{getNormalizedStatus(user.status).charAt(0).toUpperCase() + getNormalizedStatus(user.status).slice(1)}</span>
                        </span>
                      </div>
                      <p className="text-gray-400 text-[12px]">{user.email}</p>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Balance</span>
                      <span className="text-white font-semibold text-lg">${user.balance}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Join Date</span>
                      <span className="text-gray-300 text-sm">{new Date(user.joinDate).toLocaleDateString()}</span>
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
                      onClick={() => handleDeleteUser(user.id.toString(), user.email)}
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
                  Verified: {filteredUsers.filter(u => u.status === 'verified').length}
                </span>
                <span className="text-yellow-400">
                  Unverified: {filteredUsers.filter(u => u.status === 'unverified').length}
                </span>
                <span className="text-red-400">
                  Suspended: {filteredUsers.filter(u => u.status === 'suspended').length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg border border-[#3a3a3a] w-full max-w-sm mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Deletion</h2>
            <p className="text-gray-300 mb-2">Are you sure you want to delete this user?</p>
            <p className="text-gray-400 text-sm mb-6">Email: {userToDelete.email}</p>
            <p className="text-red-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-200"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;