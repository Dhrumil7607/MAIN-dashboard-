import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import WithdrawalHistory from './components/WithdrawalHistory';
import TrendingProducts from './components/TrendingProducts';
import AdminPanel from './components/AdminPanel';
import Settings from './components/Settings';
import { updateSalesData, userSettings } from './data/dataStore';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [theme, setTheme] = useState(userSettings.theme || 'light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Update theme when settings change
  useEffect(() => {
    const handleStorageChange = () => {
      // Get updated settings from localStorage
      const storedSettings = localStorage.getItem('dashboardSettings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setTheme(parsedSettings.theme || 'light');
      } else {
        setTheme('light');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      
      // Update sales data on each login/refresh
      updateSalesData();
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update sales data on login
    updateSalesData();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderActivePage = () => {
    // Check if user is admin for admin panel access
    const isAdmin = currentUser && currentUser.role === 'admin';
    
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'trending-products':
        return <TrendingProducts />;
      case 'withdrawal-history':
        return <WithdrawalHistory currentUser={currentUser} />;
      case 'admin-panel':
        // Only allow admin users to access the admin panel
        return isAdmin ? <AdminPanel /> : <Dashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex flex-1">
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        
        {/* Sidebar - hidden on mobile by default, shown when isSidebarOpen is true */}
        <div className={`fixed md:relative z-50 md:z-auto inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
          <Sidebar activePage={activePage} onPageChange={handlePageChange} currentUser={currentUser} />
        </div>
        
        <main className="flex-1 p-6 overflow-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}

export default App;