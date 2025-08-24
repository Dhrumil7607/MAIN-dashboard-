/**
 * Data Store for managing dynamic application data
 * Handles product data, sales updates, and user preferences
 */

// Initial import of mock data
import { trendingProducts as initialProducts } from './shopifyMockData';

// Get stored products from localStorage if available
const getStoredProducts = () => {
  const storedProducts = localStorage.getItem('shopifyProducts');
  if (storedProducts) {
    try {
      return JSON.parse(storedProducts);
    } catch (e) {
      console.error('Error parsing stored products:', e);
      return [...initialProducts];
    }
  }
  return [...initialProducts];
};

// Empty withdrawal history as requested
const initialWithdrawalHistory = [];

const getStoredWithdrawalHistory = (userEmail) => {
  if (!userEmail) return [...initialWithdrawalHistory];
  
  const storedHistory = localStorage.getItem(`withdrawalHistory_${userEmail}`);
  if (storedHistory) {
    try {
      return JSON.parse(storedHistory);
    } catch (e) {
      console.error('Error parsing stored withdrawal history:', e);
      return [...initialWithdrawalHistory];
    }
  }
  return [...initialWithdrawalHistory];
};

const getStoredSettings = () => {
  const storedSettings = localStorage.getItem('dashboardSettings');
  if (storedSettings) {
    try {
      return JSON.parse(storedSettings);
    } catch (e) {
      console.error('Error parsing stored settings:', e);
      return {
        theme: 'light',
        currency: 'INR',
        notificationsEnabled: true,
        salesUpdateFrequency: 'daily',
        dashboardLayout: 'default',
        chartType: 'bar',
        showProfitMargin: false,
        comparisonPeriod: '30d'
      };
    }
  }
  return {
    theme: 'light',
    currency: 'INR',
    notificationsEnabled: true,
    salesUpdateFrequency: 'daily',
    dashboardLayout: 'default',
    chartType: 'bar',
    showProfitMargin: false,
    comparisonPeriod: '30d'
  };
};

// Dynamic data store
let products = getStoredProducts();
let withdrawalHistory = getStoredWithdrawalHistory();
let userSettings = getStoredSettings();

// Get current balance
const getBalance = () => {
  const storedFigures = localStorage.getItem('salesFigures');
  if (storedFigures) {
    try {
      const figures = JSON.parse(storedFigures);
      return figures.balance || 442750;
    } catch (e) {
      console.error('Error parsing stored sales figures:', e);
      return 442750; // Default balance in INR
    }
  }
  return 442750; // Default balance in INR
};

// Save products to localStorage
const saveProducts = () => {
  try {
    localStorage.setItem('shopifyProducts', JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products to localStorage:', e);
  }
};

// Save withdrawal history to localStorage
const saveWithdrawalHistory = (userEmail) => {
  if (!userEmail) return;
  
  try {
    localStorage.setItem(`withdrawalHistory_${userEmail}`, JSON.stringify(withdrawalHistory));
  } catch (e) {
    console.error('Error saving withdrawal history to localStorage:', e);
  }
};

// Save user settings to localStorage
const saveSettings = () => {
  try {
    localStorage.setItem('dashboardSettings', JSON.stringify(userSettings));
  } catch (e) {
    console.error('Error saving settings to localStorage:', e);
  }
};

/**
 * Update sales data with higher fluctuation rates
 * Now ranges from -30% to +45% for more dramatic changes
 */
const updateSalesData = () => {
  products = products.map(product => {
    // Generate more dramatic fluctuation between -30% and +45%
    const fluctuationPercentage = -30 + Math.random() * 75;
    const salesMultiplier = 1 + (fluctuationPercentage / 100);
    
    // Calculate new sales based on original value
    const newSales = Math.round(product.originalSales * salesMultiplier);
    
    // Update growth percentage accordingly
    const growthChange = -20 + Math.random() * 50; // Between -20% and +30%
    const newGrowth = Math.min(Math.max(product.growth + growthChange, -50), 100); // Keep between -50% and 100%
    
    return {
      ...product,
      originalSales: product.originalSales || product.sales, // Store original if not already stored
      sales: newSales,
      growth: parseFloat(newGrowth.toFixed(1))
    };
  });
  
  // Save updated products to localStorage
  saveProducts();
  
  return products;
};

/**
 * AI-driven sales update function that realistically updates sales figures
 * This function simulates realistic sales patterns that match chart data
 */
const updateSalesFiguresAI = () => {
  // Get current sales figures
  const currentFigures = getSalesFigures();
  
  // Generate realistic fluctuations
  // Sales growth fluctuation between -5% and +15%
  const salesGrowthChange = -5 + Math.random() * 20;
  const newSalesGrowth = Math.min(Math.max(currentFigures.salesGrowth + salesGrowthChange, -20), 50);
  
  // Calculate new total sales based on growth
  const salesMultiplier = 1 + (newSalesGrowth / 100);
  const newTotalSales = Math.max(currentFigures.totalSales * salesMultiplier, 1000000);
  
  // Orders fluctuation between -3% and +12%
  const ordersGrowthChange = -3 + Math.random() * 15;
  const newOrdersGrowth = Math.min(Math.max(currentFigures.ordersGrowth + ordersGrowthChange, -15), 30);
  const ordersMultiplier = 1 + (newOrdersGrowth / 100);
  const newTotalOrders = Math.max(currentFigures.totalOrders * ordersMultiplier, 100);
  
  // Customers fluctuation between -2% and +10%
  const customersGrowthChange = -2 + Math.random() * 12;
  const newCustomersGrowth = Math.min(Math.max(currentFigures.customersGrowth + customersGrowthChange, -10), 25);
  const customersMultiplier = 1 + (newCustomersGrowth / 100);
  const newTotalCustomers = Math.max(currentFigures.totalCustomers * customersMultiplier, 50);
  
  // Update balance with a small random fluctuation
  const balanceChange = -10000 + Math.random() * 50000;
  const newBalance = Math.max(currentFigures.balance + balanceChange, 0);
  
  // Update sales figures
  const updatedFigures = {
    totalSales: parseFloat(newTotalSales.toFixed(2)),
    salesGrowth: parseFloat(newSalesGrowth.toFixed(1)),
    totalOrders: Math.round(newTotalOrders),
    ordersGrowth: parseFloat(newOrdersGrowth.toFixed(1)),
    totalCustomers: Math.round(newTotalCustomers),
    customersGrowth: parseFloat(newCustomersGrowth.toFixed(1)),
    balance: parseFloat(newBalance.toFixed(2))
  };
  
  // Save updated figures
  localStorage.setItem('salesFigures', JSON.stringify(updatedFigures));
  
  // Also update product sales data
  updateSalesData();
  
  return updatedFigures;
};

/**
 * Generate a precise withdrawal ID
 * Format: TX-YYYYMMDD-XXXXX-ABCD
 * Where ABCD is a 4-character alphanumeric hash
 */
const generateWithdrawalId = () => {
  const today = new Date();
  const dateString = today.toISOString().slice(0,10).replace(/-/g, "");
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  
  // Generate 4-character alphanumeric hash
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let hash = '';
  for (let i = 0; i < 4; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `TX-${dateString}-${randomPart}-${hash}`;
};

/**
 * Add new withdrawal to history
 */
const addWithdrawal = (amount, bankAccount, userEmail) => {
  const newWithdrawal = {
    id: generateWithdrawalId(),
    amount: parseFloat(amount),
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    method: 'IMPS/NEFT',
    bankAccount: bankAccount || {
      accountNumber: 'XXXXXX1234',
      accountHolderName: 'John Doe',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0002499'
    }
  };
  
  withdrawalHistory = [newWithdrawal, ...withdrawalHistory];
  saveWithdrawalHistory(userEmail);
  
  // Deduct withdrawal amount from balance
  const currentBalance = getBalance();
  const newBalance = currentBalance - parseFloat(amount);
  
  // Update balance in sales figures
  const salesFigures = getSalesFigures();
  updateSalesFigures(
    salesFigures.totalSales,
    salesFigures.salesGrowth,
    salesFigures.totalOrders,
    salesFigures.ordersGrowth,
    salesFigures.totalCustomers,
    salesFigures.customersGrowth,
    newBalance
  );
  
  return newWithdrawal;
};

/**
 * Update withdrawal status
 */
const updateWithdrawalStatus = (withdrawalId, newStatus) => {
  withdrawalHistory = withdrawalHistory.map(withdrawal => {
    if (withdrawal.id === withdrawalId) {
      return { ...withdrawal, status: newStatus };
    }
    return withdrawal;
  });
  saveWithdrawalHistory();
  return withdrawalHistory;
};

/**
 * Update user settings
 */
const updateSettings = (newSettings) => {
  userSettings = { ...userSettings, ...newSettings };
  saveSettings();
  return userSettings;
};

/**
 * Update product details
 */
const updateProduct = (productId, updatedData) => {
  products = products.map(product => {
    if (product.id === productId) {
      return { ...product, ...updatedData };
    }
    return product;
  });
  
  saveProducts();
  return products.find(p => p.id === productId);
};

/**
 * Add new product
 */
const addProduct = (productData) => {
  const newProduct = {
    id: Date.now().toString(),
    ...productData,
    originalSales: productData.sales
  };
  
  products = [newProduct, ...products];
  saveProducts();
  
  return newProduct;
};

/**
 * Remove product
 */
const removeProduct = (productId) => {
  products = products.filter(product => product.id !== productId);
  saveProducts();
};

// Admin panel functions
const updateSalesFigures = (newTotalSales, newSalesGrowth, newTotalOrders, newOrdersGrowth,
                          newTotalCustomers, newCustomersGrowth, newBalance) => {
  const updatedSettings = {
    totalSales: newTotalSales || 44382550,
    salesGrowth: newSalesGrowth || 14.5,
    totalOrders: newTotalOrders || 5732,
    ordersGrowth: newOrdersGrowth || 5.2,
    totalCustomers: newTotalCustomers || 2453,
    customersGrowth: newCustomersGrowth || 9.1,
    balance: newBalance || 442750,
  };
  
  try {
    localStorage.setItem('salesFigures', JSON.stringify(updatedSettings));
  } catch (e) {
    console.error('Error saving sales figures to localStorage:', e);
  }
  return updatedSettings;
};

const getSalesFigures = () => {
  const storedFigures = localStorage.getItem('salesFigures');
  if (storedFigures) {
    try {
      return JSON.parse(storedFigures);
    } catch (e) {
      console.error('Error parsing stored sales figures:', e);
    }
  }
  return {
    totalSales: 44382550, // ₹44,38,255
    salesGrowth: 14.5,
    totalOrders: 5732,
    ordersGrowth: 5.2,
    totalCustomers: 2453,
    customersGrowth: 9.1,
    balance: 442750, // ₹4,42,750
  };
};

export {
  products,
  withdrawalHistory,
  userSettings,
  getBalance,
  updateSalesData,
  updateSalesFiguresAI,
  generateWithdrawalId,
  addWithdrawal,
  updateWithdrawalStatus,
  updateSettings,
  updateProduct,
  addProduct,
  removeProduct,
  updateSalesFigures,
  getSalesFigures
};