import React, { useState, useEffect } from 'react';
import AreaChartComponent from './charts/AreaChart';
import BarChartComponent from './charts/BarChart';
import PieChartComponent from './charts/PieChart';
import LineChartComponent from './charts/LineChart';
import StatsCard from './StatsCard';
import {
  shopifyStats,
  monthlySalesData,
  revenueByCategoryData,
  trafficSourceData,
  customerAcquisitionData,
} from '../data/shopifyMockData';
import { products, getSalesFigures, userSettings, updateSalesFiguresAI } from '../data/dataStore';

const Dashboard = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [salesFigures, setSalesFigures] = useState(getSalesFigures());
  const [settings, setSettings] = useState(userSettings);

  // Load products and sales figures on component mount
  useEffect(() => {
    setTrendingProducts(products);
    setSalesFigures(getSalesFigures());
    setSettings(userSettings);
    
    // Refresh sales figures when localStorage changes
    const handleStorageChange = () => {
      setSalesFigures(getSalesFigures());
      // Get updated settings from localStorage
      const storedSettings = localStorage.getItem('dashboardSettings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings(parsedSettings);
      } else {
        setSettings(userSettings);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Automatically update sales figures based on user settings
  useEffect(() => {
    // Don't run if sales update frequency is set to manual
    if (settings.salesUpdateFrequency === 'manual') {
      return;
    }

    // Determine interval based on user settings
    let intervalMs;
    switch (settings.salesUpdateFrequency) {
      case 'realtime':
        intervalMs = 30000; // 30 seconds
        break;
      case 'hourly':
        intervalMs = 3600000; // 1 hour
        break;
      case 'daily':
        intervalMs = 86400000; // 24 hours
        break;
      case 'weekly':
        intervalMs = 604800000; // 7 days
        break;
      default:
        intervalMs = 3600000; // 1 hour default
    }

    // Set up interval to update sales figures
    const interval = setInterval(() => {
      updateSalesFiguresAI();
      // Refresh local state after update
      setSalesFigures(getSalesFigures());
    }, intervalMs);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [settings]);

  // Get top 4 trending products for quick view
  const topTrendingProducts = trendingProducts
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 4);

  // Update stats with actual figures from datastore
  const updatedStats = shopifyStats.map(stat => {
    if (stat.title === 'Total Revenue') {
      return {
        ...stat,
        value: `₹${(salesFigures.totalSales / 100000).toFixed(2)} Lakhs`,
        change: `${salesFigures.salesGrowth >= 0 ? '+' : ''}${salesFigures.salesGrowth}%`,
        trend: salesFigures.salesGrowth >= 0 ? 'up' : 'down'
      };
    }
    if (stat.title === 'Orders') {
      return {
        ...stat,
        value: salesFigures.totalOrders.toLocaleString('en-IN'),
        change: `${salesFigures.ordersGrowth >= 0 ? '+' : ''}${salesFigures.ordersGrowth}%`,
        trend: salesFigures.ordersGrowth >= 0 ? 'up' : 'down'
      };
    }
    return stat;
  });

  return (
    <div className={`space-y-6 ${settings.dashboardLayout === 'compact' ? 'space-y-4' : settings.dashboardLayout === 'expanded' ? 'space-y-8' : 'space-y-6'}`}>
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {updatedStats.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>
      
      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Monthly Sales (INR)</h2>
        <div className="h-80">
          {settings.chartType === 'bar' && (
            <BarChartComponent data={monthlySalesData} dataKeys={['online', 'retail']} xAxisDataKey="month" />
          )}
          {settings.chartType === 'line' && (
            <LineChartComponent data={monthlySalesData} dataKeys={['online', 'retail']} xAxisDataKey="month" />
          )}
          {settings.chartType === 'area' && (
            <AreaChartComponent data={monthlySalesData} dataKeys={['online', 'retail']} xAxisDataKey="month" />
          )}
          {settings.chartType === 'pie' && (
            <PieChartComponent data={monthlySalesData} />
          )}
        </div>
      </div>
      
      {/* Charts - Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Revenue Trend (INR)</h2>
          <div className="h-72">
            <AreaChartComponent data={monthlySalesData} xAxisDataKey="month" dataKeys={['online', 'retail']} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Customer Acquisition</h2>
          <div className="h-72">
            <LineChartComponent data={customerAcquisitionData} dataKeys={['newCustomers', 'returningCustomers']} />
          </div>
        </div>
      </div>
      
      {/* Charts - Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Revenue by Category</h2>
          <div className="h-64">
            <PieChartComponent data={revenueByCategoryData} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Traffic Sources</h2>
          <div className="h-64">
            <PieChartComponent data={trafficSourceData} colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Top Trending Products</h2>
          <div className="space-y-4 max-h-64 overflow-auto">
            {topTrendingProducts.map((product) => (
              <div key={product.id} className="flex items-center">
                <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-full w-full object-cover" 
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/200?text=Product";
                    }}
                  />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    ₹{typeof product.price === 'number' ? product.price.toLocaleString('en-IN') : '0'} • {product.sales} sales
                  </p>
                </div>
                <div className={`text-sm font-medium ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.growth >= 0 ? '+' : ''}{product.growth}%
                </div>
              </div>
            ))}
            <div className="mt-2 pt-2 border-t">
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500" onClick={(e) => {
                e.preventDefault();
                document.querySelector('[data-id="trending-products"]')?.click();
              }}>
                View all trending products
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;