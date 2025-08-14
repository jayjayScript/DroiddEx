import api from '@/lib/axios';
import { AxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Cookies from "js-cookie";

const UserCompletedTransactions = () => {
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<UserTransactionType[]>([])
  const [loading, setLoading] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [limit, setLimit] = useState(15) // Default items per page for users

  const fetchTransactions = async (page: number = currentPage) => {
    const userToken = Cookies.get("token");

    if (!userToken) {
      // router.replace("/login");
      return;
    }

    setLoading(true)
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
      
      // Assuming the API supports pagination parameters
      const response = await api<TransactionHistoryResponse>(`/transaction/history?page=${page}&limit=${limit}`);
      
      // Filter completed transactions (non-pending) on the client side
      const completedTransactions = response.data.data.transactions.filter(item => item.status !== 'pending');
      
      setTransactions(completedTransactions)
      setTotalPages(response.data.data.totalPages)
      setTotalTransactions(response.data.data.total)
      setCurrentPage(page)
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message)
      } else {
        toast.error('Failed to load transactions. Please try again later or reload page');
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions(1)
  }, [limit])

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

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchTransactions(page)
      // Reset expanded states when changing pages
      setExpandedTransaction(null)
      // Scroll to top of transaction list
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setCurrentPage(1) // Reset to first page when changing limit
  }

  // Generate page numbers for pagination - simplified for user interface
  const getVisiblePages = () => {
    const delta = 1 // Show fewer pages on mobile-friendly interface
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots.filter((page, index, array) => array.indexOf(page) === index)
  }

  return (
    <div>
      {/* Header with pagination controls */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-white text-lg font-semibold">Transaction History</h2>
            <p className="text-gray-400 text-sm">
              {loading 
                ? 'Loading your transactions...' 
                : transactions.length > 0 
                  ? `${transactions.length} completed transactions`
                  : 'No completed transactions yet'
              }
            </p>
          </div>
          
          {/* Items per page selector - simplified for users */}
          {totalTransactions > 10 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Show:</span>
              <select
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="bg-[#2A2A2A] text-white text-sm rounded px-2 py-1 border border-gray-600 focus:border-[#ebb70c] focus:outline-none"
                disabled={loading}
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div>
        {loading ? (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ebb70c] mb-4"></div>
            <p className="text-gray-400 text-sm">Loading your transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4 text-4xl">📊</div>
            <p className='text-gray-400 mb-2'>No completed transactions yet</p>
            <p className='text-gray-500 text-sm'>Your transaction history will appear here once you make deposits or withdrawals.</p>
          </div>
        ) : (
          <>
            <div>
              {transactions.map((transaction, index) => {
                const { type, Coin, amount, image, network, email, status, createdAt } = transaction
                const isExpanded = expandedTransaction === index

                return (
                  <div key={index} className='bg-[#2A2A2A] mt-3 rounded-lg overflow-hidden hover:bg-[#2F2F2F] transition-colors'>
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
                        <p className={`font-medium ${type == 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                          {type === 'deposit' ? '+' : '-'}{amount} {Coin}
                        </p>
                        {network && <p className='text-gray-500 text-[10px]'>{network}</p>}
                        <p className={`text-xs text-center px-2 py-[1px] rounded font-medium ${
                          status === 'completed' 
                            ? 'text-green-400 bg-green-500/10' 
                            : status === 'failed'
                              ? 'text-red-400 bg-red-500/10'
                              : 'text-yellow-400 bg-yellow-500/10'
                        }`}>
                          {status}
                        </p>
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

                    {/* Receipt download link for deposits */}
                    {image && type === 'deposit' && (
                      <div className="px-3 pb-3">
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                          </svg>
                          <Link 
                            download={`receipt_${createdAt ? new Date(createdAt).getTime() : Date.now()}.png`}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            href={ImageDownload(image)}
                            className="hover:text-[#ebb70c] transition-colors underline"
                          >
                            Download Receipt
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Pagination Controls - User-friendly design */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="text-gray-400 text-sm text-center">
                  Page {currentPage} of {totalPages} • {totalTransactions} total transactions
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Previous button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-4 py-2 rounded bg-[#2A2A2A] text-white text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                    </svg>
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {getVisiblePages().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-2 py-2 text-gray-400 text-sm">...</span>
                        ) : (
                          <button
                            onClick={() => handlePageChange(page as number)}
                            disabled={loading}
                            className={`px-3 py-2 rounded text-sm transition-all ${
                              currentPage === page
                                ? 'bg-[#ebb70c] text-black font-medium shadow-lg'
                                : 'bg-[#2A2A2A] text-white hover:bg-gray-600'
                            } disabled:opacity-50`}
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Next button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="px-4 py-2 rounded bg-[#2A2A2A] text-white text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                    </svg>
                  </button>
                </div>

                {/* Quick jump for large datasets */}
                {totalPages > 10 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Go to page:</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value)
                        if (page >= 1 && page <= totalPages) {
                          handlePageChange(page)
                        }
                      }}
                      className="w-16 px-2 py-1 rounded bg-[#2A2A2A] text-white text-center border border-gray-600 focus:border-[#ebb70c] focus:outline-none"
                      disabled={loading}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default UserCompletedTransactions