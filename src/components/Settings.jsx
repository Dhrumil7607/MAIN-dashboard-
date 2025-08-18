import React, { useState, useEffect, useCallback } from 'react';
import { userSettings, updateSettings } from '../data/dataStore';
import { debounce } from '../utils/debounce';

const Settings = () => {
  const [settings, setSettings] = useState(userSettings);
  const [saveStatus, setSaveStatus] = useState('');
  
  // Create debounced save function
  const debouncedSaveSettings = useCallback(
    debounce((newSettings) => {
      updateSettings(newSettings);
      setSaveStatus('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus('');
      }, 3000);
    }, 1000),
    []
  );
  
  const handleChange = (key, value) => {
    const updatedSettings = {
      ...settings,
      [key]: value
    };
    setSettings(updatedSettings);
    debouncedSaveSettings(updatedSettings);
    
    // Dispatch storage event to notify other components of theme change
    if (key === 'theme') {
      window.dispatchEvent(new Event('storage'));
    }
  };
  
  const handleSave = () => {
    // Settings are already auto-saved, just show confirmation
    setSaveStatus('Settings saved successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSaveStatus('');
    }, 3000);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Display Preferences</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <select
                  id="theme"
                  value={settings.theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="system">System Preference</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chartType" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Chart Type
                </label>
                <select
                  id="chartType"
                  value={settings.chartType}
                  onChange={(e) => handleChange('chartType', e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                  <option value="area">Area Chart</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="dashboardLayout" className="block text-sm font-medium text-gray-700 mb-1">
                  Dashboard Layout
                </label>
                <select
                  id="dashboardLayout"
                  value={settings.dashboardLayout}
                  onChange={(e) => handleChange('dashboardLayout', e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="default">Default</option>
                  <option value="compact">Compact</option>
                  <option value="expanded">Expanded</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Notifications & Updates</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  id="notificationsEnabled"
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="notificationsEnabled" className="ml-2 block text-sm text-gray-700">
                  Enable Notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="showProfitMargin"
                  type="checkbox"
                  checked={settings.showProfitMargin}
                  onChange={(e) => handleChange('showProfitMargin', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="showProfitMargin" className="ml-2 block text-sm text-gray-700">
                  Show Profit Margins in Reports
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="salesUpdateFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Data Update Frequency
                </label>
                <select
                  id="salesUpdateFrequency"
                  value={settings.salesUpdateFrequency}
                  onChange={(e) => handleChange('salesUpdateFrequency', e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="comparisonPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Comparison Period
                </label>
                <select
                  id="comparisonPeriod"
                  value={settings.comparisonPeriod}
                  onChange={(e) => handleChange('comparisonPeriod', e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* API Integration Settings (placeholder) */}
        <div className="border-t border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">API Integration</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <div className="flex">
                <input
                  type="password"
                  id="apiKey"
                  value="••••••••••••••••••••••"
                  disabled
                  className="flex-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-l-md"
                />
                <button
                  className="bg-gray-100 text-gray-700 py-2 px-4 border border-gray-300 rounded-r-md hover:bg-gray-200"
                >
                  Regenerate
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Use this key to access the API. For security reasons, we only show this once.
              </p>
            </div>
            
            <div>
              <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <input
                type="text"
                id="webhookUrl"
                placeholder="https://example.com/webhook"
                value=""
                onChange={() => {}}
                className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500">
                We'll send notifications to this URL when important events occur.
              </p>
            </div>
          </div>
        </div>
        
        {/* Save button and status */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-between">
          <span className={`text-sm ${saveStatus ? 'text-green-600' : 'text-transparent'}`}>
            {saveStatus || 'Placeholder'}
          </span>
          
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;