import api from '@/lib/axios'
import { AxiosError } from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Cookies from "js-cookie";
import { Icon } from '@iconify/react/dist/iconify.js'

// Define UserTransactionType if not imported from elsewhere
type UserTransactionType = {
  _id: string;
  type: string;
  Coin: string;
  fromCoin: string;
  amount: number;
  image?: string;
  network?: string;
  withdrawWalletAddress?: string;
  email: string;
  status: string;
  createdAt?: string | Date;
};

const AdminPendingTransactions = () => {
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null)
  const [expandedWalletAddress, setExpandedWalletAddress] = useState<number | null>(null)
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

  const toggleWalletAddress = (index: number) => {
    setExpandedWalletAddress(expandedWalletAddress === index ? null : index)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Wallet address copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy wallet address');
    });
  }

  const handleAcceptTransaction = async (_id: string) => {
    try {
      const response = await api.patch(`/admin/transactions/${_id}?status=completed`)
      toast.success('Transaction approved successfully')
      fetchTransactions()
      console.log(response)
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message)
      } else {
        toast.error('Failed to approve transaction. Please try again later');
      }
    }
  }

  const handleRejectTransaction = async (_id: string) => {
    try {
      const response = await api.patch(`/admin/transactions/${_id}?status=failed`)
      toast.success('Transaction rejected successfully')
      fetchTransactions()
      console.log(response)
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message)
      } else {
        toast.error('Failed to reject transaction. Please try again later');
      }
    }
  }

  // Filter pending transactions
  const pendingTransactions = transactions.filter(item => item.status === 'pending');

  return (
    <div>
      <div>
        {pendingTransactions.length === 0 && (
          <p className='text-center text-gray-400 my-6'>No Pending Transactions</p>
        )}

        <div>
          {pendingTransactions.map((transaction, index) => {
            const { type, Coin, amount, image, network, withdrawWalletAddress, email, status, createdAt, _id } = transaction
            const isExpanded = expandedTransaction === index
            const isWalletExpanded = expandedWalletAddress === index

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
                    
                    {type === 'withdrawal' && withdrawWalletAddress && (
                      <div className="mt-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <p className='text-[12.55px] text-white font-medium font-mono break-all'>
                              {isWalletExpanded 
                                ? withdrawWalletAddress 
                                : withdrawWalletAddress.length > 25 
                                  ? `${withdrawWalletAddress.slice(0, 25)}...` 
                                  : withdrawWalletAddress
                              }
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {/* Copy button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(withdrawWalletAddress);
                              }}
                              className="p-1 hover:bg-gray-600 rounded transition-colors"
                              title="Copy wallet address"
                            >
                              <Icon icon="solar:copy-bold-duotone" width="16" height="16" />
                            </button>
                            
                            {/* Toggle button for long addresses */}
                            {withdrawWalletAddress.length > 25 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWalletAddress(index);
                                }}
                                className="p-1 hover:bg-gray-600 rounded transition-colors"
                                title={isWalletExpanded ? "Show less" : "Show more"}
                              >
                                <Icon 
                                  icon={isWalletExpanded ? "ant-design:up-outlined" : "ant-design:down-outlined"} 
                                  width="16" 
                                  height="16" 
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <small className='text-gray-500 text-[10px]'>{formatDate(new Date(createdAt ?? Date.now()))}</small>
                  </div>

                  <div className='text-right'>
                    <p className={`${type == 'deposit' ? 'text-green-400' : 'text-red-400'}`}>{amount}{Coin}</p>
                    {network && <p className='text-gray-500 text-[10px]'>{network}</p>}
                    <p className='text-[#ebb70c] text-xs bg-[#ebb70c27] text-center px-2 py-[1px] rounded'>{status}</p>
                  </div>

                  {/* Dropdown arrow for deposits with receipts only */}
                  {type === 'deposit' && image && (
                    <div className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Accordion Content - Receipt Image for Deposits */}
                {type === 'deposit' && image && (
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
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
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) {
                                nextElement.classList.remove('hidden');
                              }
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

                {/* Receipt indicator for deposits */}
                {image && type === 'deposit' && (
                  <div className="px-3 pb-3">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <Icon icon="material-symbols:attach-file" width="12" height="12" />
                      <Link 
                        download={`${email}_receipt_image.png`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        href={ImageDownload(image)}
                        className="hover:text-[#ebb70c] transition-colors"
                      >
                        Download Receipt
                      </Link>
                    </div>
                  </div>
                )}

                {/* Admin action buttons */}
                <div className="px-3 py-2 border-t border-gray-600">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptTransaction(_id)}
                      className="bg-green-600/10 px-3 py-1 rounded text-green-500 text-xs hover:bg-green-700/20 transition-colors flex items-center gap-1"
                    >
                      <Icon icon="material-symbols:check-circle" width="14" height="14" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectTransaction(_id)}
                      className="bg-red-600/10 px-3 py-1 rounded text-red-500 text-xs hover:bg-red-700/20 transition-colors flex items-center gap-1"
                    >
                      <Icon icon="material-symbols:cancel" width="14" height="14" />
                      Reject
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

export default AdminPendingTransactions
