import api from '@/lib/axios'
import { AxiosError } from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Cookies from "js-cookie";

const UserPendingTransactions = () => {
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<UserTransactionType[]>([])
  const [loading, setLoading] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [limit, setLimit] = useState(10) // Smaller default for pending transactions

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
      
      // Filter pending transactions on the client side
      const pendingTransactions = response.data.data.transactions.filter(item => item.status === 'pending');
      
      setTransactions(pendingTransactions)
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
        return 'ph:hand-deposit-fill'
      case 'withdrawal':
        return 'icon-park-solid:file-withdrawal'
      case 'swap':
        return 'tdesign:swap'
      case 'buy':
        return 'icon-park-solid:buy'
      case 'sell':
        return 'ep:sell'
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
            <h2 className="text-white text-lg font-semibold flex items-center gap-2">
              <div className="w-2 h-2 bg-[#ebb70c] rounded-full animate-pulse"></div>
              Pending Transactions
            </h2>
            <p className="text-gray-400 text-sm">
              {loading 
                ? 'Checking for pending transactions...' 
                : transactions.length > 0 
                  ? `${transactions.length} transaction${transactions.length === 1 ? '' : 's'} awaiting processing`
                  : 'All transactions have been processed'
              }
            </p>
          </div>
          
          {/* Items per page selector - only show if there are enough transactions */}
          {totalTransactions > 10 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Show:</span>
              <select
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="bg-[#2A2A2A] text-white text-sm rounded px-2 py-1 border border-gray-600 focus:border-[#ebb70c] focus:outline-none"
                disabled={loading}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          )}
        </div>

        {/* Status banner for pending transactions */}
        {transactions.length > 0 && !loading && (
          <div className="bg-[#ebb70c]/10 border border-[#ebb70c]/20 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-[#ebb70c] rounded-full flex items-center justify-center mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17M11,9H13V7H11V9Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[#ebb70c] font-medium text-sm">Processing Status</h3>
                <p className="text-gray-300 text-sm mt-1">
                  Your transactions are being reviewed and will be processed within 24 hours. You'll receive an email confirmation once completed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        {loading ? (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ebb70c] mb-4"></div>
            <p className="text-gray-400 text-sm">Checking for pending transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4 text-4xl">✅</div>
            <p className='text-gray-400 mb-2'>No pending transactions</p>
            <p className='text-gray-500 text-sm'>All your transactions have been processed successfully.</p>
          </div>
        ) : (
          <>
            <div>
              {transactions.map((transaction, index) => {
                const { type, Coin, amount, image, network, email, status, createdAt } = transaction
                const isExpanded = expandedTransaction === index

                return (
                  <div key={index} className='bg-[#2A2A2A] mt-3 rounded-lg overflow-hidden border border-[#ebb70c]/10 hover:border-[#ebb70c]/20 transition-all'>
                    <div
                      className={`p-3 px-3 flex items-center gap-2 ${type === 'deposit' && image ? 'cursor-pointer' : ''}`}
                      onClick={() => type === 'deposit' && image && toggleAccordion(index)}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[#ebb70c] text-lg font-bold bg-[#ebb70c]/10`}>
                        {getTransactionIcon(type)}
                      </div>

                      <div className='flex-1'>
                        <div className="flex items-center gap-2">
                          <h3 className={`uppercase font-medium text-[11px] ${type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>{type}</h3>
                          <div className="w-1.5 h-1.5 bg-[#ebb70c] rounded-full animate-pulse"></div>
                        </div>
                        <p className='text-[12.55px] text-gray-400 font-medium'>{email.substring(0, 19) + "..."}</p>
                        <small className='text-gray-500 text-[10px]'>{formatDate(new Date(createdAt ?? Date.now()))}</small>
                      </div>

                      <div className='text-right'>
                        <p className={`font-medium ${type == 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                          {type === 'deposit' ? '+' : '-'}{amount} {Coin}
                        </p>
                        {network && <p className='text-gray-500 text-[10px]'>{network}</p>}
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <div className="w-1.5 h-1.5 bg-[#ebb70c] rounded-full animate-pulse"></div>
                          <p className='text-[#ebb70c] text-xs bg-[#ebb70c]/10 border border-[#ebb70c]/20 text-center px-2 py-[1px] rounded font-medium'>
                            {status}
                          </p>
                        </div>
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
                            download={`pending_receipt_${createdAt ? new Date(createdAt).getTime() : Date.now()}.png`}
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
                  Page {currentPage} of {totalPages} • {totalTransactions} total pending
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

                {/* Auto-refresh notice for pending transactions */}
                <div className="text-center text-gray-500 text-xs">
                  <div className="flex items-center justify-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                    </svg>
                    Refresh the page to check for status updates
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default UserPendingTransactions