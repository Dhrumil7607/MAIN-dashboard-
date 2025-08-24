import React, { useState, useEffect } from 'react';
import { withdrawalHistory, addWithdrawal, getBalance, generateWithdrawalId, getSalesFigures, updateWithdrawalStatus, getStoredWithdrawalHistory } from '../data/dataStore';

const WithdrawalHistory = ({ currentUser }) => {
  const [newWithdrawalAmount, setNewWithdrawalAmount] = useState('');
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [showBankAccountForm, setShowBankAccountForm] = useState(false);
  const [history, setHistory] = useState(withdrawalHistory);
  const [filterStatus, setFilterStatus] = useState('All');
  const [availableBalance, setAvailableBalance] = useState(getBalance());
  const [bankAccount, setBankAccount] = useState({
    accountNumber: '',
    accountHolderName: '',
    bankName: '',
    ifscCode: ''
  });
  
  // Refresh history and balance when component mounts
  useEffect(() => {
    if (currentUser && currentUser.email) {
      setHistory(getStoredWithdrawalHistory(currentUser.email));
    } else {
      setHistory(withdrawalHistory);
    }
    setAvailableBalance(getBalance());
    
    // Refresh balance when localStorage changes
    const handleStorageChange = () => {
      setAvailableBalance(getBalance());
      if (currentUser && currentUser.email) {
        setHistory(getStoredWithdrawalHistory(currentUser.email));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser]);
  
  // Automatically update pending withdrawals to successful after 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const updatedHistory = history.map(item => {
        if (item.status === 'Pending') {
          // Parse the date properly
          const itemDate = new Date(item.date).getTime();
          // Check if 30 seconds have passed since the withdrawal was created
          if (now - itemDate > 30000) { // 30 seconds in milliseconds
            // Update in data store
            updateWithdrawalStatus(item.id, 'Successful');
            // Return updated item
            return { ...item, status: 'Successful' };
          }
        }
        return item;
      });
      
      // Check if any items were updated
      if (updatedHistory.some((item, index) => item.status !== history[index].status)) {
        setHistory(updatedHistory);
      }
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [history]);
  
  const filteredHistory = filterStatus === 'All' 
    ? history 
    : history.filter(item => item.status === filterStatus);
  
  const handleNewWithdrawal = (e) => {
    e.preventDefault();
    
    if (!newWithdrawalAmount || isNaN(parseFloat(newWithdrawalAmount)) || parseFloat(newWithdrawalAmount) <= 0) {
      alert('Please enter a valid withdrawal amount');
      return;
    }
    
    const amount = parseFloat(newWithdrawalAmount);
    
    if (amount < 5000) {
      alert('Minimum withdrawal amount is 5000 INR');
      return;
    }
    
    if (amount > availableBalance) {
      alert('Withdrawal amount exceeds available balance');
      return;
    }
    
    // Add withdrawal to persistent storage
    const newWithdrawal = addWithdrawal(amount, bankAccount, currentUser?.email);
    
    // Update local state
    setHistory([newWithdrawal, ...history]);
    
    // Refresh balance
    setAvailableBalance(getBalance());
    
    // Reset form
    setNewWithdrawalAmount('');
    setShowWithdrawalForm(false);
  };
  
  const handleBankAccountChange = (field, value) => {
    setBankAccount(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveBankAccount = (e) => {
    e.preventDefault();
    // In a real app, you would save this to a database
    // For now, we'll just close the form
    setShowBankAccountForm(false);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Withdrawal History</h1>
      
      {/* Available Balance Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Available for withdrawal</h2>
            <p className="text-3xl font-bold text-gray-800">₹{availableBalance.toLocaleString('en-IN')}</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowBankAccountForm(!showBankAccountForm)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {showBankAccountForm ? 'Cancel' : 'Bank Account'}
            </button>
            <button
              onClick={() => setShowWithdrawalForm(!showWithdrawalForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {showWithdrawalForm ? 'Cancel' : 'Request Withdrawal'}
            </button>
          </div>
        </div>
        
        {/* Bank Account Form */}
        {showBankAccountForm && (
          <form onSubmit={handleSaveBankAccount} className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Bank Account Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  id="accountHolderName"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter account holder name"
                  value={bankAccount.accountHolderName}
                  onChange={(e) => handleBankAccountChange('accountHolderName', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bankName"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter bank name"
                  value={bankAccount.bankName}
                  onChange={(e) => handleBankAccountChange('bankName', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter account number"
                  value={bankAccount.accountNumber}
                  onChange={(e) => handleBankAccountChange('accountNumber', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">
                  IFSC Code
                </label>
                <input
                  type="text"
                  id="ifscCode"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter IFSC code"
                  value={bankAccount.ifscCode}
                  onChange={(e) => handleBankAccountChange('ifscCode', e.target.value)}
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save Bank Account
                </button>
              </div>
            </div>
          </form>
        )}
        
        {/* New Withdrawal Form */}
        {showWithdrawalForm && (
          <form onSubmit={handleNewWithdrawal} className="mt-6 border-t pt-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Withdrawal Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="text"
                    name="amount"
                    id="amount"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    value={newWithdrawalAmount}
                    onChange={(e) => setNewWithdrawalAmount(e.target.value)}
                    required
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Min: 5000 INR | Max: {availableBalance.toLocaleString('en-IN')} INR
                </p>
              </div>
              
              <div>
                <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                  Withdrawal Method
                </label>
                <div className="mt-1 block w-full pl-3 py-2 text-base border border-gray-300 bg-gray-100 rounded-md text-gray-700">
                  IMPS/NEFT
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Currently only supporting IMPS/NEFT  withdrawals
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Submit Withdrawal Request
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
      
      {/* History Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
        <h2 className="text-lg font-medium text-gray-800">Transaction History</h2>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Successful</option>
          </select>
        </div>
      </div>
      
      {/* Withdrawal History Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount (INR)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank Account
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof item.amount === 'number' ?
                      item.amount.toLocaleString('en-IN') : item.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.bankAccount ? (
                      <div>
                        <div>{item.bankAccount.accountHolderName}</div>
                        <div className="text-xs text-gray-400">
                          {item.bankAccount.bankName} ({item.bankAccount.accountNumber})
                        </div>
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${item.status === 'Successful' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredHistory.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No withdrawal history found.
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalHistory;