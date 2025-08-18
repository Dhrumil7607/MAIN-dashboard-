import React, { useState, useEffect } from 'react';
import { withdrawalHistory, addWithdrawal, getBalance, generateWithdrawalId, getSalesFigures, updateWithdrawalStatus } from '../data/dataStore';

const WithdrawalHistory = () => {
  const [newWithdrawalAmount, setNewWithdrawalAmount] = useState('');
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [history, setHistory] = useState(withdrawalHistory);
  const [filterStatus, setFilterStatus] = useState('All');
  const [availableBalance, setAvailableBalance] = useState(getBalance());
  
  // Refresh history and balance when component mounts
  useEffect(() => {
    setHistory(withdrawalHistory);
    setAvailableBalance(getBalance());
    
    // Refresh balance when localStorage changes
    const handleStorageChange = () => {
      setAvailableBalance(getBalance());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
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
    const newWithdrawal = addWithdrawal(amount);
    
    // Update local state
    setHistory([newWithdrawal, ...history]);
    
    // Refresh balance
    setAvailableBalance(getBalance());
    
    // Reset form
    setNewWithdrawalAmount('');
    setShowWithdrawalForm(false);
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
          
          <button 
            onClick={() => setShowWithdrawalForm(!showWithdrawalForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {showWithdrawalForm ? 'Cancel' : 'Request Withdrawal'}
          </button>
        </div>
        
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