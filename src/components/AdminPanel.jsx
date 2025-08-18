import React, { useState, useEffect, useCallback } from 'react';
import {
  updateSalesFigures,
  getSalesFigures,
  updateProduct,
  addProduct,
  removeProduct,
  products as storeProducts
} from '../data/dataStore';
import { debounce } from '../utils/debounce';

const AdminPanel = () => {
  const [salesFigures, setSalesFigures] = useState(getSalesFigures());
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    sales: '',
    growth: '',
    category: '',
    image: ''
  });

  // Create debounced save functions
  const debouncedSaveSalesFigures = useCallback(
    debounce((figures) => {
      updateSalesFigures(
        parseFloat(figures.totalSales),
        parseFloat(figures.salesGrowth),
        parseInt(figures.totalOrders),
        parseFloat(figures.ordersGrowth),
        parseInt(figures.totalCustomers),
        parseFloat(figures.customersGrowth),
        parseFloat(figures.balance)
      );
      // Create a storage event to notify other components
      window.dispatchEvent(new Event('storage'));
    }, 1000),
    []
  );

  const debouncedSaveProduct = useCallback(
    debounce((product) => {
      if (product.id) {
        updateProduct(product.id, product);
        setProducts(storeProducts); // Refresh products list
      }
    }, 1000),
    []
  );

  const debouncedSaveNewProduct = useCallback(
    debounce((productData) => {
      // Only save if all required fields are filled
      if (productData.name && productData.price && productData.category) {
        addProduct(productData);
        setProducts(storeProducts); // Refresh products list
      }
    }, 1000),
    []
  );

  // Load initial data
  useEffect(() => {
    setSalesFigures(getSalesFigures());
    setProducts(storeProducts);
  }, []);

  // Refresh products when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setProducts(storeProducts);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle update of sales figures
  const handleSalesUpdate = (e) => {
    e.preventDefault();
    const updatedFigures = updateSalesFigures(
      parseFloat(salesFigures.totalSales),
      parseFloat(salesFigures.salesGrowth),
      parseInt(salesFigures.totalOrders),
      parseFloat(salesFigures.ordersGrowth),
      parseInt(salesFigures.totalCustomers),
      parseFloat(salesFigures.customersGrowth),
      parseFloat(salesFigures.balance)
    );
    
    setSalesFigures(updatedFigures);
    
    // Create a storage event to notify other components
    window.dispatchEvent(new Event('storage'));
    
    alert('Sales figures updated successfully!');
  };

  // Handle sales figures input changes with auto-save
  const handleSalesInputChange = (field, value) => {
    const updatedFigures = {
      ...salesFigures,
      [field]: value
    };
    setSalesFigures(updatedFigures);
    debouncedSaveSalesFigures(updatedFigures);
  };

  // Handle product form changes
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    if (selectedProduct) {
      const updatedProduct = {
        ...selectedProduct,
        [name]: name === 'price' || name === 'sales' ? parseFloat(value) :
                name === 'growth' ? parseFloat(value) : value
      };
      setSelectedProduct(updatedProduct);
      debouncedSaveProduct(updatedProduct);
    }
  };

  // Handle new product form changes
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    const updatedNewProduct = {
      ...newProduct,
      [name]: name === 'price' || name === 'sales' ? parseFloat(value) :
              name === 'growth' ? parseFloat(value) : value
    };
    setNewProduct(updatedNewProduct);
    debouncedSaveNewProduct(updatedNewProduct);
  };

  // Update existing product
  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    // Product is already auto-saved, just close the form
    setSelectedProduct(null);
    alert('Product updated successfully!');
  };

  // Add new product
  const handleAddProduct = (e) => {
    e.preventDefault();
    
    // Product is already auto-saved, just reset the form
    setNewProduct({
      name: '',
      price: '',
      sales: '',
      growth: '',
      category: '',
      image: ''
    });
    setShowNewProductForm(false);
    alert('Product added successfully!');
  };

  // Delete product
  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      removeProduct(id);
      setProducts(storeProducts.filter(p => p.id !== id)); // Refresh products list
      alert('Product deleted successfully!');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-800">Admin Panel</h1>
      
      {/* Sales Figures Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Edit Sales Figures</h2>
        
        <form onSubmit={handleSalesUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="totalSales" className="block text-sm font-medium text-gray-700">
                Total Sales (INR)
              </label>
              <input
                type="number"
                id="totalSales"
                value={salesFigures.totalSales}
                onChange={(e) => handleSalesInputChange('totalSales', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="salesGrowth" className="block text-sm font-medium text-gray-700">
                Sales Growth (%)
              </label>
              <input
                type="number"
                step="0.1"
                id="salesGrowth"
                value={salesFigures.salesGrowth}
                onChange={(e) => handleSalesInputChange('salesGrowth', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="totalOrders" className="block text-sm font-medium text-gray-700">
                Total Orders
              </label>
              <input
                type="number"
                id="totalOrders"
                value={salesFigures.totalOrders}
                onChange={(e) => handleSalesInputChange('totalOrders', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="ordersGrowth" className="block text-sm font-medium text-gray-700">
                Orders Growth (%)
              </label>
              <input
                type="number"
                step="0.1"
                id="ordersGrowth"
                value={salesFigures.ordersGrowth}
                onChange={(e) => handleSalesInputChange('ordersGrowth', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="totalCustomers" className="block text-sm font-medium text-gray-700">
                Total Customers
              </label>
              <input
                type="number"
                id="totalCustomers"
                value={salesFigures.totalCustomers}
                onChange={(e) => handleSalesInputChange('totalCustomers', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="customersGrowth" className="block text-sm font-medium text-gray-700">
                Customers Growth (%)
              </label>
              <input
                type="number"
                step="0.1"
                id="customersGrowth"
                value={salesFigures.customersGrowth}
                onChange={(e) => handleSalesInputChange('customersGrowth', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
                Available Balance (INR)
              </label>
              <input
                type="number"
                id="balance"
                value={salesFigures.balance}
                onChange={(e) => handleSalesInputChange('balance', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Update Sales Figures
            </button>
          </div>
        </form>
      </div>
      
      {/* Products Management Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Manage Products</h2>
          <button
            onClick={() => setShowNewProductForm(!showNewProductForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {showNewProductForm ? 'Cancel' : 'Add New Product'}
          </button>
        </div>
        
        {/* New Product Form */}
        {showNewProductForm && (
          <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-md font-medium text-gray-700 mb-3">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleNewProductChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (INR)*
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleNewProductChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="sales" className="block text-sm font-medium text-gray-700">
                    Sales
                  </label>
                  <input
                    type="number"
                    id="sales"
                    name="sales"
                    value={newProduct.sales}
                    onChange={handleNewProductChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="growth" className="block text-sm font-medium text-gray-700">
                    Growth (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="growth"
                    name="growth"
                    value={newProduct.growth}
                    onChange={handleNewProductChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={newProduct.category}
                    onChange={handleNewProductChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={newProduct.image}
                    onChange={handleNewProductChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Edit Product Form */}
        {selectedProduct && (
          <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-md font-medium text-gray-700 mb-3">Edit Product</h3>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={selectedProduct.name}
                    onChange={handleProductChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">
                    Price (INR)
                  </label>
                  <input
                    type="number"
                    id="edit-price"
                    name="price"
                    value={selectedProduct.price}
                    onChange={handleProductChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-sales" className="block text-sm font-medium text-gray-700">
                    Sales
                  </label>
                  <input
                    type="number"
                    id="edit-sales"
                    name="sales"
                    value={selectedProduct.sales}
                    onChange={handleProductChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="edit-growth" className="block text-sm font-medium text-gray-700">
                    Growth (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="edit-growth"
                    name="growth"
                    value={selectedProduct.growth}
                    onChange={handleProductChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="edit-category"
                    name="category"
                    value={selectedProduct.category}
                    onChange={handleProductChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="edit-image"
                    name="image"
                    value={selectedProduct.image}
                    onChange={handleProductChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price (INR)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-md object-cover" 
                          src={product.image} 
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/40?text=N/A";
                          }} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.price ? product.price.toLocaleString('en-IN') : '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.growth >= 0 ? '+' : ''}{product.growth}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;