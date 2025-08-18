// Fake trending products data
export const trendingProducts = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    price: 24999,
    sales: 1245,
    revenue: 31323485,
    growth: 24.5,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 16999,
    sales: 982,
    revenue: 16692718,
    growth: 18.3,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 3,
    name: "Ergonomic Standing Desk",
    price: 37999,
    sales: 754,
    revenue: 28651246,
    growth: 32.1,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 4,
    name: "Premium Coffee Maker",
    price: 10999,
    sales: 1367,
    revenue: 15035533,
    growth: 15.7,
    category: "Kitchen",
    image: "/images/coffeemaker.jpg"
  },
  {
    id: 5,
    name: "Organic Cotton T-Shirt",
    price: 2999,
    sales: 2034,
    revenue: 6100966,
    growth: 28.9,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 6,
    name: "Smart Home Security System",
    price: 33999,
    sales: 642,
    revenue: 21827358,
    growth: 41.2,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1558000143-a78f8299c40b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 7,
    name: "Portable Bluetooth Speaker",
    price: 6999,
    sales: 1534,
    revenue: 10736466,
    growth: 22.5,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 8,
    name: "Yoga Mat Premium",
    price: 4999,
    sales: 978,
    revenue: 4889022,
    growth: 19.8,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  }
];

// Empty withdrawal history
export const withdrawalHistory = [];

// Shopify sales stats
export const shopifyStats = [
  {
    title: 'Total Revenue',
    value: '₹19,84,325',
    change: '+24.5%',
    trend: 'up',
    icon: {
      path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      bgColor: 'bg-green-500'
    }
  },
  {
    title: 'Orders',
    value: '1,876',
    change: '+12.8%',
    trend: 'up',
    icon: {
      path: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      bgColor: 'bg-blue-500'
    }
  },
  {
    title: 'Conversion Rate',
    value: '4.28%',
    change: '+1.3%',
    trend: 'up',
    icon: {
      path: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      bgColor: 'bg-purple-500'
    }
  },
  {
    title: 'Average Order Value',
    value: '₹8,575',
    change: '+5.4%',
    trend: 'up',
    icon: {
      path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      bgColor: 'bg-indigo-500'
    }
  }
];

// Monthly sales data
export const monthlySalesData = [
  { month: 'Jan', online: 1450000, retail: 850000 },
  { month: 'Feb', online: 1600000, retail: 780000 },
  { month: 'Mar', online: 1800000, retail: 900000 },
  { month: 'Apr', online: 1750000, retail: 870000 },
  { month: 'May', online: 1950000, retail: 920000 },
  { month: 'Jun', online: 2100000, retail: 980000 },
  { month: 'Jul', online: 2250000, retail: 1050000 }
];

// Revenue by product category
export const revenueByCategoryData = [
  { name: 'Electronics', value: 45 },
  { name: 'Clothing', value: 25 },
  { name: 'Kitchen', value: 15 },
  { name: 'Furniture', value: 10 },
  { name: 'Other', value: 5 }
];

// Traffic sources
export const trafficSourceData = [
  { name: 'Organic Search', value: 40 },
  { name: 'Direct', value: 25 },
  { name: 'Social Media', value: 20 },
  { name: 'Referral', value: 10 },
  { name: 'Email', value: 5 }
];

// Customer acquisition data
export const customerAcquisitionData = [
  { month: 'Jan', newCustomers: 120, returningCustomers: 85 },
  { month: 'Feb', newCustomers: 135, returningCustomers: 90 },
  { month: 'Mar', newCustomers: 155, returningCustomers: 100 },
  { month: 'Apr', newCustomers: 145, returningCustomers: 110 },
  { month: 'May', newCustomers: 165, returningCustomers: 120 },
  { month: 'Jun', newCustomers: 175, returningCustomers: 125 },
  { month: 'Jul', newCustomers: 185, returningCustomers: 135 }
];