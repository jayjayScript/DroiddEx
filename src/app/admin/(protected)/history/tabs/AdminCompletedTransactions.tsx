import api from '@/lib/axios';
import { AxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Cookies from "js-cookie";
import { Icon } from '@iconify/react/dist/iconify.js'

// Define UserTransactionType if not imported from elsewhere
type UserTransactionType = {
  _id: string;
  type: string;
  Coin: string;
  amount: number;
  image?: string;
  network?: string;
  withdrawWalletAddress?: string;
  email: string;
  status: string;
  createdAt?: string | Date;
};

const AdminCompletedTransactions = () => {
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<UserTransactionType[]>([])

  const fetchTransactions = async () => {
    const adminToken = Cookies.get("adminToken");
    if (!adminToken) {
      // router.replace("/admin/auth/");
      return;
    }
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
      const response = await api<UserTransactionType[]>('/admin/transactions');
      setTransactions(response.data)
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message)
      } else {
        toast.error('Failed to load transactions. Please try again later or reload page');
      }
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return '↓'
      case 'withdrawal':
        return '↑'
      default:
        return '?'
    }
  }

  const ImageDownload = (image: string) => image.startsWith('data:') ? image : `data:image/png;base64,${image}`;

  const toggleAccordion = (index: number) => {
    setExpandedTransaction(expandedTransaction === index ? null : index)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Wallet address copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy wallet address');
    });
  }

  const handleUpdateTransactionStatus = async (_id: string, newStatus: string) => {
    try {
      const response = await api.patch(`/admin/transactions/${_id}?status=${newStatus}`)
      toast.success(`Transaction ${newStatus} successfully`)
      fetchTransactions()
      console.log(response)
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message)
      } else {
        toast.error(`Failed to update transaction status. Please try again later`);
      }
    }
  }

  // Filter completed transactions (non-pending)
  const completedTransactions = transactions.filter(item => item.status !== 'pending');

  return (
    <div>
      <div>
        {completedTransactions.length === 0 && (
          <p className='text-center text-gray-400 my-6'>No completed Transactions</p>
        )}

        <div>
          {completedTransactions.map((transaction, index) => {
            const { type, Coin, amount, image, network, email, status, createdAt, _id } = transaction
            const isExpanded = expandedTransaction === index

            return (
              <div key={index} className='bg-[#2A2A2A] mt-3 rounded-lg overflow-hidden'>
                <div
                  className={`p-3 px-3 flex items-center gap-2 ${type === 'deposit' && image ? 'cursor-pointer' : ''}`}
                  onClick={() => type === 'deposit' && image && toggleAccordion(index)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[#ebb70c] text-lg font-bold`}>
                    {getTransactionIcon(type)}
                  </div>

                  <div className='flex-1'>
                    <h3 className={`uppercase font-medium text-[11px] ${type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>{type}</h3>
                    <p className='text-[12.55px] text-gray-400 font-medium'>{email.substring(0, 19) + "..."}</p>
                    <small className='text-gray-500 text-[10px]'>{formatDate(new Date(createdAt ?? Date.now()))}</small>
                  </div>

                  <div className='text-right'>
                    <p className={`${type == 'deposit' ? 'text-green-400' : 'text-red-400'}`}>{amount}{Coin}</p>
                    {network && <p className='text-gray-500 text-[10px]'>{network}</p>}
                    <p className={`text-xs text-center px-2 py-[1px] rounded ${status === 'completed'
                        ? 'text-green-500 bg-green-500/10'
                        : status === 'failed'
                          ? 'text-red-500 bg-red-500/10'
                          : 'text-yellow-500 bg-yellow-500/10'
                      }`}>{status}</p>
                  </div>

                  {/* Dropdown arrow for deposits with receipts only */}
                  {type === 'deposit' && image && (
                    <div className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                      }`}>
                      <svg width="16" height="16" viewBox="0 0 10 24" fill="currentColor">
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Accordion Content - Receipt Image for Deposits */}
                {type === 'deposit' && image && (
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="px-3 pb-3 border-t border-gray-600">
                      <div className="mt-3 bg-[#1f1f1f] rounded-lg p-3">
                        <h4 className="text-white text-[11px] font-medium mb-2 uppercase">Receipt Image</h4>
                        <div className="bg-[#2A2A2A] rounded-lg p-4">
                          <Image
                            src={ImageDownload(image)}
                            alt="Receipt"
                            className="w-full h-auto max-h-64 object-contain rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');

                            }}
                            width={200}
                            height={200}
                          />
                          <div className="text-center hidden">
                            <div className="text-2xl mb-1 text-[#ebb70c]">🧾</div>
                            <p className="text-gray-400 text-[10px]">Failed to load image</p>
                            <p className="text-gray-500 text-[9px] mt-1">Use download link below</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Receipt indicator for non-expandable transactions */}
                {image && type === 'deposit' && (
                  <div className="px-3 pb-3 border-t border-gray-600 mt-2">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-2">
                      <span>📎</span>
                      <Link download={`${email}_receipt_image.png`} target="_blank" rel="noopener noreferrer" href={ImageDownload(image)}>Download Receipt attached</Link>
                    </div>
                  </div>
                )}

                {/* Admin action buttons - for reverting completed transactions */}
                <div className="px-3 py-2 border-t border-gray-600">
                  <div className="flex gap-2">
                    {status === 'completed' && (
                      <button
                        onClick={() => handleUpdateTransactionStatus(_id, 'failed')}
                        className="bg-red-600/10 px-3 py-1 rounded text-red-500 text-xs hover:bg-red-700/20 transition-colors"
                      >
                        Mark as Failed
                      </button>
                    )}
                    {status === 'failed' && (
                      <button
                        onClick={() => handleUpdateTransactionStatus(_id, 'completed')}
                        className="bg-green-600/10 px-3 py-1 rounded text-green-500 text-xs hover:bg-green-700/20 transition-colors"
                      >
                        Mark as Completed
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateTransactionStatus(_id, 'pending')}
                      className="bg-yellow-600/10 px-3 py-1 rounded text-yellow-500 text-xs hover:bg-yellow-700/20 transition-colors"
                    >
                      Mark as Pending
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AdminCompletedTransactions