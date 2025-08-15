"use client"

import React, { useEffect, useState } from 'react';
import { Search, Users, Eye, DollarSign, UserCheck, UserX, Filter, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { user, Wallet, USDTEntry } from '@/lib/admin';
// import {Coin} from '@/app/(dashboard)/dashboard/components/Wallet';
import {Coin} from "@/app/(dashboard)/dashboard/components/Wallet";
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import Cookies from 'js-cookie';
import { deleteUser } from '@/lib/updateUser';
import {CoinGeckoCoin, getCoins} from "@/lib/getCoins";
import {WalletEntry} from "@/app/(dashboard)/dashboard/components/SubscriptionModal";

const AdminUsers = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; email: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [usersPerPage] = useState(10); // You can make this configurable

  interface User {
    fullname?: string;
    email: string;
    balance: number;
    status: 'verified' | 'unverified' | 'suspended' | string;
    joinDate: string;
    avatar?: string;
    id: string | number;
    username?: string;
    wallet?: Wallet;
  }

  const [users, setUsers] = useState<User[]>([])
  const [coins, setCoins] = useState<Coin[]>([]);
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
      setTotalUsers(prev => prev - 1);
      toast.success("User deleted successfully.");

      // If current page becomes empty and it's not the first page, go to previous page
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        // Refresh current page to get updated data
        fetchUsers(currentPage);
      }

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

  const fetchUsers = async (page: number = 1) => {
    const adminToken = Cookies.get("adminToken");

    if (!adminToken) {
      router.replace("/admin/auth/");
      return;
    }

    setIsLoading(true);
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
      
      // Add pagination parameters to the API call
      const response = await api<TotalUserResponse>(`admin/users/?page=${page}&limit=${usersPerPage}`)
      
      const userData = response.data.data;
      const getusers = userData.users as any;
      
      const usersList = getusers?.map((user: any) => ({
        fullname: user.fullname,
        email: user.email,
        balance: user.balance ?? 0,
        wallet: user.wallet,
        status: user.isVerified ? 'verified' : 'unverified',
        joinDate: user.joinDate,
        id: user._id,
      }));
      
      setUsers(usersList);
      setCurrentPage(userData.page);
      setTotalPages(userData.totalPages);
      setTotalUsers(userData.total);
    } catch (error) {
      toast.error('Failed to get users')
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      fetchUsers(page);
    }
  };

  // Handle search with debounce effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      fetchUsers(1);
    }, 500); // 500ms delay

    return () => clearTimeout(delayedSearch);
  }, [search, statusFilter]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [router]);

  useEffect(() => {
      const fetchCoins = async () => {
          try{
              const data =  await getCoins();
              const mappedCoins: Coin[] = data.map((coin: CoinGeckoCoin) => ({
                  id: coin.id,
                  name: coin.name,
                  symbol: coin.symbol,
                  market_data: {
                      current_price: {
                          usd: coin.current_price,
                      },
                      market_cap: {
                          usd: coin.market_cap,
                      },
                      price_change_percentage_24h: coin.price_change_percentage_24h,
                  },
              }));
              setCoins(mappedCoins)
          } catch (e) {
                console.error('Failed to fetch coins:', e);
                toast.error('Failed to fetch coins');
          }
      }
      fetchCoins();
  }, [])

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

  const getTotalBalance = (wallet: Wallet, coins: Coin[] = []): number => {
      if (!wallet || !coins || coins.length === 0) return 0;

      return Object.entries(wallet).reduce<number>((total, [symbol, entry]: [string, WalletEntry | USDTEntry[]]) => {
          const coinData = coins.find(coin => coin.symbol.toUpperCase() === symbol.toUpperCase());
          if (!coinData) return total

          const currentPrice = coinData.market_data.current_price.usd;

          if (Array.isArray(entry)) {
              const coinQuantity = entry.reduce(
                  (sub: number, item) => sub + (item.balance || 0),
                  0
              );
              return total + (coinQuantity * currentPrice);
          }

          const coinQuantity = entry.balance || 0;
          return total + (coinQuantity * currentPrice);
      }, 0);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
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
                  <p className="text-2xl font-bold text-white">{totalUsers}</p>
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
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
          ) : users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {users.map((user) => (
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
                      <span className="text-white font-semibold text-lg">${formatCurrency(user.wallet ? getTotalBalance(user.wallet, coins) : (user.balance || 0))}</span>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t" style={{ borderColor: '#3a3a3a' }}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Page Info */}
              <div className="text-sm text-gray-400">
                Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="p-2 rounded-lg border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                  style={{ backgroundColor: '#1a1a1a', borderColor: '#3a3a3a' }}
                >
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {generatePageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="px-3 py-2 text-gray-400">...</span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(page as number)}
                          disabled={isLoading}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed ${
                            currentPage === page
                              ? 'text-black'
                              : 'text-gray-400 hover:bg-gray-700'
                          }`}
                          style={{
                            backgroundColor: currentPage === page ? '#ebb70c' : '#1a1a1a',
                            borderColor: '#3a3a3a'
                          }}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="p-2 rounded-lg border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                  style={{ backgroundColor: '#1a1a1a', borderColor: '#3a3a3a' }}
                >
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        {users.length > 0 && (
          <div className="px-6 py-4 border-t rounded-b-xl"
            style={{ backgroundColor: '#1a1a1a', borderColor: '#3a3a3a' }}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
              <span className="text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex space-x-4">
                <span className="text-green-400">
                  Verified: {users.filter(u => u.status === 'verified').length}
                </span>
                <span className="text-yellow-400">
                  Unverified: {users.filter(u => u.status === 'unverified').length}
                </span>
                <span className="text-red-400">
                  Suspended: {users.filter(u => u.status === 'suspended').length}
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