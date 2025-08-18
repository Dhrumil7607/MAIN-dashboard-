import React, { useState, useEffect } from 'react';
import { products, updateProduct, addProduct, removeProduct } from '../data/dataStore';

const ProductManager = () => {
  const [productList, setProductList] = useState(products);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sales: 0,
    image: '',
    price: 0,
    growth: 0,
    category: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter products based on search term
  const filteredProducts = productList.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEditClick = (product) => {
    setEditingProduct({...product});
    setShowAddForm(false);
  };
  
  const handleEditChange = (field, value) => {
    setEditingProduct(prev => ({
      ...prev,
      [field]: field === 'sales' || field === 'price' || field === 'growth' ? 
        parseFloat(value) : value
    }));
  };
  
  const handleAddChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: field === 'sales' || field === 'price' || field === 'growth' ? 
        parseFloat(value) : value
    }));
  };
  
  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    
    if (!editingProduct.name) {
      alert('Product name is required');
      return;
    }
    
    if (editingProduct.price <= 0) {
      alert('Product price must be greater than 0');
      return;
    }
    
    if (editingProduct.sales < 0) {
      alert('Product sales cannot be negative');
      return;
    }
    
    if (editingProduct.growth < -100 || editingProduct.growth > 100) {
      alert('Product growth must be between -100 and 100');
      return;
    }
    
    const updatedProduct = updateProduct(editingProduct.id, editingProduct);
    
    // Update local state
    setProductList(productList.map(p =>
      p.id === updatedProduct.id ? updatedProduct : p
    ));
    
    setEditingProduct(null);
  };
  
  const handleAddProduct = (e) => {
    e.preventDefault();
    
    if (!newProduct.name) {
      alert('Product name is required');
      return;
    }
    
    if (newProduct.price <= 0) {
      alert('Product price must be greater than 0');
      return;
    }
    
    if (newProduct.sales < 0) {
      alert('Product sales cannot be negative');
      return;
    }
    
    if (newProduct.growth < -100 || newProduct.growth > 100) {
      alert('Product growth must be between -100 and 100');
      return;
    }
    
    const createdProduct = addProduct(newProduct);
    
    // Update local state
    setProductList([createdProduct, ...productList]);
    
    // Reset form
    setNewProduct({
      name: '',
      sales: 0,
      image: '',
      price: 0,
      growth: 0,
      category: ''
    });
    
    setShowAddForm(false);
  };
  
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      removeProduct(productId);
      
      // Update local state
      setProductList(productList.filter(p => p.id !== productId));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Product Manager</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingProduct(null);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {showAddForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>
      
      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name*
                </label>
                <input
                  type="text"
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => handleAddChange('name', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={newProduct.category}
                  onChange={(e) => handleAddChange('category', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  min="0.01"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => handleAddChange('price', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="sales" className="block text-sm font-medium text-gray-700 mb-1">
                  Sales
                </label>
                <input
                  type="number"
                  id="sales"
                  min="0"
                  value={newProduct.sales}
                  onChange={(e) => handleAddChange('sales', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="growth" className="block text-sm font-medium text-gray-700 mb-1">
                  Growth (%)
                </label>
                <input
                  type="number"
                  id="growth"
                  min="-100"
                  max="100"
                  value={newProduct.growth}
                  onChange={(e) => handleAddChange('growth', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                id="image"
                value={newProduct.image}
                onChange={(e) => handleAddChange('image', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Edit Product Form */}
      {editingProduct && (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Edit Product</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  id="edit-category"
                  value={editingProduct.category || ''}
                  onChange={(e) => handleEditChange('category', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  id="edit-price"
                  min="0.01"
                  step="0.01"
                  value={editingProduct.price || 0}
                  onChange={(e) => handleEditChange('price', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-sales" className="block text-sm font-medium text-gray-700 mb-1">
                  Sales
                </label>
                <input
                  type="number"
                  id="edit-sales"
                  min="0"
                  value={editingProduct.sales}
                  onChange={(e) => handleEditChange('sales', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-growth" className="block text-sm font-medium text-gray-700 mb-1">
                  Growth (%)
                </label>
                <input
                  type="number"
                  id="edit-growth"
                  min="-100"
                  max="100"
                  value={editingProduct.growth}
                  onChange={(e) => handleEditChange('growth', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                id="edit-image"
                value={editingProduct.image || ''}
                onChange={(e) => handleEditChange('image', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Products List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sales
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Growth
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {product.image && (
                      <div className="flex-shrink-0 h-10 w-10 mr-4">
                        <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt="" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">ID: {product.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.category || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ₹{typeof product.price === 'number' ?
                      product.price.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }) : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.sales.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${product.growth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.growth >= 0 ? '+' : ''}{product.growth}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
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
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManager;