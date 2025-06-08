"use client"
import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Mail  } from 'lucide-react';

interface TransactionProps {
  email: string;
  type: string;
  amount: number;
  status: string;
  coin: string;
  network?: string;
  date: Date;
}

interface Transaction {
  id: number;
  transactionProps: TransactionProps;
  description: string;
  usdValue: number;
  time: string;
  icon: React.ElementType;
  txHash: string;
}

interface TransactionHistoryProps {
  isAdmin: boolean;
  pendingTransactions: Transaction[];
  completedTransactions: Transaction[];
  onTransactionUpdate?: (transactionId: number, newStatus: 'approved' | 'rejected') => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  isAdmin = false,
  pendingTransactions = [],
  completedTransactions = [],
  onTransactionUpdate 
}) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const getStatusIcon = (status: string): React.ReactNode => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" style={{ color: '#ebb70c' }} />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string): string => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'pending':
        return `${baseClasses} text-black`;
      case 'approved':
        return `${baseClasses} bg-green-900 text-green-300`;
      case 'rejected':
        return `${baseClasses} bg-red-900 text-red-300`;
      default:
        return baseClasses;
    }
  };

  const getTransactionColor = (type: string): string => {
    const colorMap: { [key: string]: string } = {
      deposit: 'text-emerald-600',
      buy: 'text-emerald-600',
      withdrawal: 'text-red-600',
      sell: 'text-red-600',
      swap: 'text-blue-600',
    };
    return colorMap[type] || 'text-gray-600';
  };

  const getTransactionPrefix = (type: string): string => {
    const prefixMap: { [key: string]: string } = {
      deposit: '+',
      buy: '+',
      withdrawal: '-',
      sell: '-',
      swap: '~',
    };
    return prefixMap[type] || '';
  };

  const formatCryptoAmount = (amount: number, coin: string): string => {
    if (coin.includes('→')) {
      return coin;
    }
    
    if (coin === 'BTC') {
      return `${amount} ${coin}`;
    } else if (coin === 'ETH') {
      return `${amount} ${coin}`;
    } else if (coin === 'USDT' || coin === 'USDC') {
      return `${amount.toLocaleString()} ${coin}`;
    } else {
      return `${amount.toLocaleString()} ${coin}`;
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleAdminAction = (transaction: Transaction, action: 'approved' | 'rejected') => {
    // Update transaction status
    if (onTransactionUpdate) {
      onTransactionUpdate(transaction.id, action);
    }
    
    // Close modal
    setShowActionModal(false);
    setSelectedTransaction(null);
    
    // Log action for debugging
    console.log(`Transaction ${transaction.id} ${action} by admin`);
  };

  const openActionModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowActionModal(true);
  };

  const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const IconComponent = transaction.icon;
    const { transactionProps } = transaction;
    const transactionColor = getTransactionColor(transactionProps.type);
    const prefix = getTransactionPrefix(transactionProps.type);

    return (
      <div className="flex items-center justify-between p-4 rounded-lg border hover:shadow-lg transition-all duration-200"
           style={{ backgroundColor: '#2a2a2a', borderColor: '#3a3a3a' }}>
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                 style={{ backgroundColor: '#ebb70c' }}>
              <IconComponent className="w-5 h-5" style={{ color: '#1a1a1a' }} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {transaction.description}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-xs text-gray-400">
                {formatDate(transactionProps.date)} at {transaction.time}
              </p>
              <span className="text-xs text-gray-500">•</span>
              <p className="text-xs text-gray-400">
                {transactionProps.network}
              </p>
              {getStatusIcon(transactionProps.status)}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Mail className="w-3 h-3 text-gray-500" />
              <p className="text-xs text-gray-500 font-mono">
                {transactionProps.email}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              {transaction.txHash}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className={`text-sm font-semibold ${transactionColor}`}>
              {prefix}{formatCryptoAmount(transactionProps.amount, transactionProps.coin)}
            </p>
            <p className="text-xs text-gray-400">
              ${transaction.usdValue.toLocaleString()}
            </p>
            <span className={getStatusBadge(transactionProps.status)}
                  style={{ 
                    backgroundColor: transactionProps.status === 'pending' ? '#ebb70c' : 
                                   transactionProps.status === 'approved' ? '#065f46' : '#7f1d1d'
                  }}>
              {transactionProps.status.charAt(0).toUpperCase() + transactionProps.status.slice(1)}
            </span>
          </div>
          
          {/* Admin Action Button - Only show for pending transactions and admin users */}
          {isAdmin && transactionProps.status === 'pending' && (
            <button
              onClick={() => openActionModal(transaction)}
              className="ml-3 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 hover:opacity-80"
              style={{ backgroundColor: '#ebb70c', color: '#1a1a1a' }}
            >
              Review
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto " style={{ backgroundColor: '#1a1a1a' }}>
      <div className="rounded shadow-sm border" style={{ backgroundColor: '#1a1a1a', borderColor: '#3a3a3a' }}>

        {/* Tabs */}
        <div className="border-b" style={{ borderColor: '#3a3a3a' }}>
          <nav className="flex space-x-8 px-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'pending'
                  ? 'text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              style={{ 
                borderBottomColor: activeTab === 'pending' ? '#ebb70c' : 'transparent'
              }}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Pending</span>
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#ebb70c', color: '#1a1a1a' }}>
                  {pendingTransactions.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'completed'
                  ? 'text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              style={{ 
                borderBottomColor: activeTab === 'completed' ? '#ebb70c' : 'transparent'
              }}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Completed</span>
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#3a3a3a', color: '#ebb70c' }}>
                  {completedTransactions.length}
                </span>
              </div>
            </button>
          </nav>
        </div>

        {/* Transaction List */}
        <div className="p-2">
          <div className="space-y-3">
            {activeTab === 'pending' ? (
              pendingTransactions.length > 0 ? (
                pendingTransactions.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No pending transactions</h3>
                  <p className="text-gray-400">All your crypto transactions have been processed.</p>
                </div>
              )
            ) : (
              completedTransactions.length > 0 ? (
                completedTransactions.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No completed transactions</h3>
                  <p className="text-gray-400">Your completed crypto transactions will appear here.</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Summary Footer */}
        {activeTab === 'completed' && completedTransactions.length > 0 && (
          <div className="px-6 py-4 border-t rounded-b-xl" 
               style={{ backgroundColor: '#1a1a1a', borderColor: '#3a3a3a' }}>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">
                Total transactions: {completedTransactions.length}
              </span>
              <div className="flex space-x-4">
                <span className="text-green-400">
                  Approved: {completedTransactions.filter(t => t.transactionProps.status === 'approved').length}
                </span>
                <span className="text-red-400">
                  Rejected: {completedTransactions.filter(t => t.transactionProps.status === 'rejected').length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Action Modal */}
      {showActionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-lg p-6 max-w-md w-full mx-4" 
               style={{ backgroundColor: '#2a2a2a', borderColor: '#3a3a3a' }}>
            <h3 className="text-lg font-semibold text-white mb-4">
              Review Transaction
            </h3>
            
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
              <p className="text-sm text-gray-300 mb-2">
                <strong>Transaction:</strong> {selectedTransaction.description}
              </p>
              <p className="text-sm text-gray-300 mb-2">
                <strong>Amount:</strong> {formatCryptoAmount(
                  selectedTransaction.transactionProps.amount, 
                  selectedTransaction.transactionProps.coin
                )}
              </p>
              <p className="text-sm text-gray-300 mb-2">
                <strong>User:</strong> {selectedTransaction.transactionProps.email}
              </p>
              <p className="text-sm text-gray-300 mb-2">
                <strong>Network:</strong> {selectedTransaction.transactionProps.network}
              </p>
              <p className="text-sm text-gray-300">
                <strong>TX Hash:</strong> {selectedTransaction.txHash}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleAdminAction(selectedTransaction, 'approved')}
                className="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 hover:opacity-80"
                style={{ backgroundColor: '#065f46', color: '#10b981' }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve</span>
                </div>
              </button>
              
              <button
                onClick={() => handleAdminAction(selectedTransaction, 'rejected')}
                className="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 hover:opacity-80"
                style={{ backgroundColor: '#7f1d1d', color: '#ef4444' }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedTransaction(null);
                }}
                className="py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 hover:opacity-80"
                style={{ backgroundColor: '#3a3a3a', color: '#d1d5db' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;