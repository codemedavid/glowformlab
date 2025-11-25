import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Package, TrendingUp, AlertTriangle, Search, Edit, Trash2, Plus, Download, RefreshCw, Layers } from 'lucide-react';
import type { Product } from '../types';
import { useMenu } from '../hooks/useMenu';
import { useCategories } from '../hooks/useCategories';
import { supabase } from '../lib/supabase';

interface PeptideInventoryManagerProps {
  onBack: () => void;
}

const PeptideInventoryManager: React.FC<PeptideInventoryManagerProps> = ({ onBack }) => {
  const { products, loading, refreshProducts } = useMenu();
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  // Load confirmed orders for sales calculation
  useEffect(() => {
    loadOrders();
    
    // Listen for order confirmation events to refresh sales data
    const handleOrderConfirmed = () => {
      loadOrders();
    };
    
    window.addEventListener('orderConfirmed', handleOrderConfirmed);
    
    return () => {
      window.removeEventListener('orderConfirmed', handleOrderConfirmed);
    };
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('total_price, shipping_fee, order_items, order_status')
        .in('order_status', ['confirmed', 'processing', 'shipped', 'delivered'])
        .eq('payment_status', 'paid');

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders for sales:', error);
      setOrders([]);
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    // Calculate total sales from confirmed/paid orders
    const totalSales = orders.reduce((sum, order) => {
      const orderTotal = Number(order.total_price) + (Number(order.shipping_fee) || 0);
      return sum + orderTotal;
    }, 0);

    // Calculate total vials sold from confirmed orders
    const totalVialsSold = orders.reduce((sum, order) => {
      if (order.order_items && Array.isArray(order.order_items)) {
        const vialsInOrder = order.order_items.reduce((itemSum: number, item: any) => {
          return itemSum + (item.quantity || 0);
        }, 0);
        return sum + vialsInOrder;
      }
      return sum;
    }, 0);

    const totalInventoryValue = products.reduce((sum, product) => {
      const price = product.discount_active && product.discount_price 
        ? product.discount_price 
        : product.base_price;
      
      // For products with variations, sum up variation stock values
      if (product.variations && product.variations.length > 0) {
        const variationValue = product.variations.reduce((vSum, variation) => {
          return vSum + (variation.stock_quantity * variation.price);
        }, 0);
        return sum + variationValue;
      }
      
      return sum + (product.stock_quantity * price);
    }, 0);

    const totalItems = products.length;
    
    const lowStockItems = products.filter(product => {
      if (product.variations && product.variations.length > 0) {
        // Check if any variation is low stock (less than 5)
        return product.variations.some(v => v.stock_quantity > 0 && v.stock_quantity < 5);
      }
      return product.stock_quantity > 0 && product.stock_quantity < 5;
    }).length;

    return {
      totalSales,
      totalVialsSold,
      totalInventoryValue,
      totalItems,
      lowStockItems
    };
  }, [products, orders]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Filter by stock status
    if (selectedFilter === 'low-stock') {
      filtered = filtered.filter(product => {
        if (product.variations && product.variations.length > 0) {
          return product.variations.some(v => v.stock_quantity > 0 && v.stock_quantity < 5);
        }
        return product.stock_quantity > 0 && product.stock_quantity < 5;
      });
    } else if (selectedFilter === 'out-of-stock') {
      filtered = filtered.filter(product => {
        if (product.variations && product.variations.length > 0) {
          return product.variations.every(v => v.stock_quantity === 0);
        }
        return product.stock_quantity === 0;
      });
    } else if (selectedFilter === 'in-stock') {
      filtered = filtered.filter(product => {
        if (product.variations && product.variations.length > 0) {
          return product.variations.some(v => v.stock_quantity > 0);
        }
        return product.stock_quantity > 0;
      });
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, selectedFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProducts();
    await loadOrders();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleUpdateStock = async (productId: string, variationId: string | null, newStock: number) => {
    try {
      if (variationId) {
        // Update variation stock
        const { error } = await supabase
          .from('product_variations')
          .update({ stock_quantity: newStock })
          .eq('id', variationId);
        
        if (error) throw error;
      } else {
        // Update product stock
        const { error } = await supabase
          .from('products')
          .update({ stock_quantity: newStock })
          .eq('id', productId);
        
        if (error) throw error;
      }
      
      await refreshProducts();
      alert('Stock updated successfully!');
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading inventory... ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b-2 border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-pink-600 hover:text-pink-700 transition-colors flex items-center gap-2 group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Dashboard
              </button>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Peptide Inventory
              </h1>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('peptide_admin_auth');
                window.location.reload();
              }}
              className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Total Sales Income */}
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Total Sales Income</h3>
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-3xl font-bold">₱{stats.totalSales.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-sm opacity-80 mt-1">Vials Sold: {stats.totalVialsSold}</p>
          </div>

          {/* Inventory Value */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Inventory Value</h3>
              <Package className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-3xl font-bold">₱{stats.totalInventoryValue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-sm opacity-80 mt-1">Total Items: {stats.totalItems}</p>
          </div>

          {/* Low Stock */}
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Low Stock</h3>
              <AlertTriangle className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-3xl font-bold">{stats.lowStockItems}</p>
            <p className="text-sm opacity-80 mt-1">Needs attention</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 mb-6 border-2 border-pink-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none bg-white transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none bg-white transition-colors"
            >
              <option value="all">All Items</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Inventory List */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border-2 border-pink-100">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium text-lg">No products found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <InventoryItemCard
                key={product.id}
                product={product}
                categories={categories}
                onUpdateStock={handleUpdateStock}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Inventory Item Card Component
interface InventoryItemCardProps {
  product: Product;
  categories: Array<{ id: string; name: string }>;
  onUpdateStock: (productId: string, variationId: string | null, newStock: number) => void;
}

const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ product, categories, onUpdateStock }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editStock, setEditStock] = useState<{ [key: string]: number }>({});

  // If product has variations, show each variation separately
  if (product.variations && product.variations.length > 0) {
    return (
      <>
        {product.variations.map((variation) => {
          const stockKey = `variation-${variation.id}`;
          const currentStock = editStock[stockKey] !== undefined 
            ? editStock[stockKey] 
            : variation.stock_quantity;
          
          return (
            <div
              key={variation.id}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6 border-2 border-pink-100 hover:border-pink-200 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {product.name} {variation.name}
                    </h3>
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                      {categories.find(c => c.id === product.category)?.name || product.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      variation.stock_quantity > 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {variation.stock_quantity > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Price per Vial</span>
                      <p className="font-semibold text-gray-900">₱{variation.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Quantity</span>
                      <p className="font-semibold text-gray-900">{variation.stock_quantity} vials</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Value</span>
                      <p className="font-semibold text-orange-600">
                        ₱{(variation.stock_quantity * variation.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Expiration</span>
                      <p className="font-semibold text-gray-900">N/A</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {isEditing && editStock[stockKey] !== undefined ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={currentStock}
                        onChange={(e) => setEditStock({ ...editStock, [stockKey]: parseInt(e.target.value) || 0 })}
                        className="w-20 px-2 py-1 border-2 border-pink-300 rounded text-center"
                        min="0"
                      />
                      <button
                        onClick={() => {
                          onUpdateStock(product.id, variation.id, currentStock);
                          setIsEditing(false);
                          setEditStock({});
                        }}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditStock({});
                        }}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setEditStock({ [stockKey]: variation.stock_quantity });
                        }}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  // Product without variations
  const stockKey = `product-${product.id}`;
  const currentStock = editStock[stockKey] !== undefined 
    ? editStock[stockKey] 
    : product.stock_quantity;
  
  const price = product.discount_active && product.discount_price 
    ? product.discount_price 
    : product.base_price;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6 border-2 border-pink-100 hover:border-pink-200 transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
              {categories.find(c => c.id === product.category)?.name || product.category}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              product.stock_quantity > 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {product.stock_quantity > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Price per Vial</span>
              <p className="font-semibold text-gray-900">₱{price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <span className="text-gray-500">Quantity</span>
              <p className="font-semibold text-gray-900">{product.stock_quantity} vials</p>
            </div>
            <div>
              <span className="text-gray-500">Total Value</span>
              <p className="font-semibold text-orange-600">
                ₱{(product.stock_quantity * price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Expiration</span>
              <p className="font-semibold text-gray-900">N/A</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {isEditing && editStock[stockKey] !== undefined ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={currentStock}
                onChange={(e) => setEditStock({ ...editStock, [stockKey]: parseInt(e.target.value) || 0 })}
                className="w-20 px-2 py-1 border-2 border-pink-300 rounded text-center"
                min="0"
              />
              <button
                onClick={() => {
                  onUpdateStock(product.id, null, currentStock);
                  setIsEditing(false);
                  setEditStock({});
                }}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditStock({});
                }}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditStock({ [stockKey]: product.stock_quantity });
              }}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeptideInventoryManager;
