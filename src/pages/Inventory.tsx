import {
  Search, Plus, Trash2, Edit2,
  Package, LayoutGrid, List,
  TrendingUp, Clock, Tag, IndianRupee,
  Box, AlertTriangle, CheckCircle2, X, ShoppingCart,
  Power
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { clsx } from 'clsx';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

const CATEGORIES = ['All', 'Spices', 'Dry Fruits', 'Beverages', 'Essentials', 'Dairy', 'Snacks', 'Vegetables'];
const UNITS = ['kg', 'gm', 'pcs', 'litre', 'ml', 'box', 'packet'];
const OOS_REASONS = ['Supplier Delay', 'Quality Issue', 'Seasonal Unavailablity', 'Price Fluctuation', 'Other'];

const Inventory = () => {
  const { products, updateStock, deleteProduct, addProduct, updateProduct, createOrder, toggleProductAvailability } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'updated' | 'price'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSimulateModal, setShowSimulateModal] = useState(false);

  // States for Manual Availability Toggle
  const [showOOSModal, setShowOOSModal] = useState<{ id: string, name: string } | null>(null);
  const [selectedOOSReason, setSelectedOOSReason] = useState<string>(OOS_REASONS[0]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = products.length;
    const lowStock = products.filter(p => p.isAvailable && p.quantity > 0 && p.quantity < 10).length;
    const outOfStock = products.filter(p => !p.isAvailable || p.quantity === 0).length;
    const inventoryValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    return { total, lowStock, outOfStock, inventoryValue };
  }, [products]);

  // Filtering and Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
        else if (sortBy === 'stock') comparison = a.quantity - b.quantity;
        else if (sortBy === 'price') comparison = a.price - b.price;
        else if (sortBy === 'updated') comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();

        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

  const getStockStatus = (p: Product) => {
    if (!p.isAvailable) return { label: 'OOS (Manual)', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: <Power size={14} /> };
    if (p.quantity === 0) return { label: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: <X size={14} /> };
    if (p.quantity < 10) return { label: 'Low Stock', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: <AlertTriangle size={14} /> };
    return { label: 'In Stock', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: <CheckCircle2 size={14} /> };
  };

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData: Product = {
      id: editingProduct ? editingProduct.id : Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: Number(formData.get('price')),
      costPrice: Number(formData.get('costPrice')),
      quantity: Number(formData.get('quantity')),
      unit: formData.get('unit') as string,
      image: (formData.get('image') as string) || 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=200',
      lastUpdated: new Date().toISOString(),
      isAvailable: editingProduct ? editingProduct.isAvailable : true, // Preserve status or default true
      statusReason: editingProduct?.statusReason
    };

    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }

    setShowAddModal(false);
    setEditingProduct(null);
  };

  const handleSimulateOrder = (product: Product) => {
    if (product.quantity <= 0 || !product.isAvailable) return;

    createOrder({
      customerName: 'Quick Customer',
      customerPhone: '+91 99061 23456',
      customerAddress: 'Simulated Order, Srinagar',
      paymentType: 'COD',
      total: product.price,
      items: [{
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price
      }]
    });

    // Smooth toast notification would be nice, but simple alert for now
    alert(`Order simulated for ${product.name}. Stock reduced by 1.`);
  };

  const confirmToggleStatus = (id: string, currentStatus: boolean, name: string) => {
    if (currentStatus) {
      // If currently available, we are turning it OFF -> Show Modal
      setShowOOSModal({ id, name });
    } else {
      // If currently unavailable, we are turning it ON -> Direct Action
      toggleProductAvailability(id);
    }
  };

  const submitOOS = () => {
    if (showOOSModal) {
      toggleProductAvailability(showOOSModal.id, selectedOOSReason);
      setShowOOSModal(null);
      setSelectedOOSReason(OOS_REASONS[0]);
    }
  };

  return (
    <div className="p-1 sm:p-4 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Manage your mart products, prices and stock levels.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowSimulateModal(!showSimulateModal)}
            className={clsx(
              "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all font-semibold",
              showSimulateModal
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            <ShoppingCart size={20} />
            <span>Simulate Order</span>
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowAddModal(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-pine-600 text-white rounded-xl hover:bg-pine-700 transition-all shadow-lg shadow-pine-600/20"
          >
            <Plus size={20} />
            <span className="font-semibold">Add Product</span>
          </button>
        </div>
      </div>

      {showSimulateModal && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-amber-50 border border-amber-100 p-4 rounded-2xl"
        >
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h4 className="font-bold text-amber-900">Simulation Mode Active</h4>
              <p className="text-sm text-amber-700 mt-0.5">
                Click the cart icon on any product card to simulate an order.
                This will create a new order and <strong>automatically reduce stock</strong>.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: stats.total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Low Stock', value: stats.lowStock, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Out of Stock', value: stats.outOfStock, icon: Box, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Inventory Value', value: `₹${stats.inventoryValue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' }
        ].map((item, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={item.label}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3"
          >
            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", item.bg, item.color)}>
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{item.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions (Optional but Recommended) */}
      <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
        <button className="whitespace-nowrap px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
          Mark Low Stock as OOS
        </button>
        <button className="whitespace-nowrap px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
          Restock All
        </button>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or category..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pine-500/20 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 lg:flex-none px-4 py-2.5 bg-gray-50 border-none rounded-xl text-gray-600 focus:ring-2 focus:ring-pine-500/20 font-medium appearance-none"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
            {['name', 'stock', 'updated'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  if (sortBy === type) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  else { setSortBy(type as 'name' | 'stock' | 'updated' | 'price'); setSortOrder(type === 'updated' ? 'desc' : 'asc'); }
                }}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                  sortBy === type ? 'bg-white shadow-sm text-pine-600' : 'text-gray-500 hover:bg-white/50'
                )}
              >
                {type} {sortBy === type && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-gray-50 p-1 rounded-xl ml-2">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx("p-2 rounded-lg transition-all", viewMode === 'grid' ? 'bg-white shadow-sm text-pine-600' : 'text-gray-400 hover:text-gray-600')}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={clsx("p-2 rounded-lg transition-all", viewMode === 'table' ? 'bg-white shadow-sm text-pine-600' : 'text-gray-400 hover:text-gray-600')}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Product List Section */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => {
              const status = getStockStatus(product);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id}
                  className={clsx(
                    "group bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col",
                    !product.isAvailable ? "border-red-100 bg-red-50/10" : "border-gray-100"
                  )}
                >
                  <div className="relative h-48 overflow-hidden bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={clsx("w-full h-full object-cover transition-transform duration-500", !product.isAvailable && "grayscale opacity-60", "group-hover:scale-110")}
                    />
                    <div className={clsx(
                      "absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 backdrop-blur-md shadow-sm z-10",
                      status.color, status.bg, status.border
                    )}>
                      {status.icon}
                      {status.label}
                    </div>
                    {/* Manual Toggle Overlay */}
                    <div className="absolute top-3 left-3 z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); confirmToggleStatus(product.id, product.isAvailable, product.name); }}
                        className={clsx(
                          "w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-95",
                          product.isAvailable ? "bg-white/80 text-emerald-600 hover:bg-red-50 hover:text-red-600" : "bg-red-500 text-white"
                        )}
                        title={product.isAvailable ? "Mark Out of Stock" : "Mark In Stock"}
                      >
                        <Power size={14} />
                      </button>
                    </div>

                    {showSimulateModal && product.quantity > 0 && product.isAvailable && (
                      <button
                        onClick={() => handleSimulateOrder(product)}
                        className="absolute inset-0 bg-amber-600/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold z-20"
                      >
                        <div className="bg-amber-600 p-3 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform">
                          <ShoppingCart size={24} />
                        </div>
                      </button>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-end">
                      <span className="text-white text-xs font-medium flex items-center gap-1">
                        <Tag size={12} className="opacity-70" /> {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={clsx("font-bold line-clamp-1 flex-1 transition-colors", product.isAvailable ? "text-gray-900" : "text-gray-500")}>{product.name}</h3>
                      <div className="flex items-center text-xs text-gray-400 ml-2">
                        <Clock size={12} className="mr-1" />
                        {new Date(product.lastUpdated).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    {!product.isAvailable && product.statusReason && (
                      <div className="mb-2 px-2 py-1 bg-red-50 border border-red-100 rounded text-[10px] font-bold text-red-600 inline-block self-start">
                        Reason: {product.statusReason}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">
                        Unit: {product.unit}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Sell Price</span>
                        <span className="text-lg font-black text-pine-600">₹{product.price}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Cost Price</span>
                        <span className="text-lg font-black text-gray-400 line-through">₹{product.costPrice}</span>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateStock(product.id, Math.max(0, product.quantity - 1))}
                          disabled={product.quantity <= 0 || !product.isAvailable}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30"
                        >
                          -
                        </button>
                        <div className="min-w-[40px] text-center">
                          <span className={clsx("font-bold", product.quantity === 0 ? "text-red-500" : "text-gray-900", !product.isAvailable && "opacity-50")}>
                            {product.quantity}
                          </span>
                        </div>
                        <button
                          onClick={() => updateStock(product.id, product.quantity + 1)}
                          disabled={!product.isAvailable}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowAddModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this product?')) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Prices</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => {
                const status = getStockStatus(product);
                return (
                  <tr key={product.id} className={clsx("hover:bg-gray-50/50 transition-colors", !product.isAvailable && "bg-gray-50/50")}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} className={clsx("w-10 h-10 rounded-lg object-cover", !product.isAvailable && "grayscale opacity-50")} alt="" />
                        <div>
                          <p className={clsx("font-bold text-gray-900", !product.isAvailable && "text-gray-500")}>{product.name}</p>
                          <p className="text-xs text-gray-400">{product.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-pine-600">₹{product.price}</span>
                        <span className="text-[10px] text-gray-400">Cost: ₹{product.costPrice}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1">
                        {showSimulateModal && product.quantity > 0 && product.isAvailable ? (
                          <button
                            onClick={() => handleSimulateOrder(product)}
                            className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-200 transition-colors"
                          >
                            <ShoppingCart size={12} />
                            Order
                          </button>
                        ) : (
                          <span className={clsx("font-black", product.quantity === 0 ? "text-red-500" : "text-gray-900", !product.isAvailable && "opacity-50")}>
                            {product.quantity}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => confirmToggleStatus(product.id, product.isAvailable, product.name)}
                          className={clsx("w-8 h-5 rounded-full relative transition-colors", product.isAvailable ? "bg-emerald-500" : "bg-gray-300")}
                        >
                          <div className={clsx("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", product.isAvailable ? "right-1" : "left-1")} />
                        </button>
                        <span className={clsx("text-xs font-bold", status.color)}>{status.label}</span>
                      </div>
                      {!product.isAvailable && product.statusReason && <p className="text-[10px] text-red-400 mt-1 font-medium">{product.statusReason}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500">
                        <p className="font-medium">{new Date(product.lastUpdated).toLocaleDateString()}</p>
                        <p className="text-[10px] opacity-60">at {new Date(product.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowAddModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this product?')) deleteProduct(product.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="text-gray-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No products found</h3>
          <p className="text-gray-500 mt-2 max-w-xs mx-auto">Try adjusting your search filters or add a new product to your inventory.</p>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl shadow-gray-950/20 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Please fill in the product details below.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-6 space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Product Name</label>
                    <input
                      required
                      defaultValue={editingProduct?.name}
                      name="name"
                      type="text"
                      placeholder="e.g. Kashmiri Walnuts"
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pine-500/20 transition-all font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                      <select
                        name="category"
                        defaultValue={editingProduct?.category || 'Spices'}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pine-500/20 transition-all font-medium appearance-none"
                      >
                        {CATEGORIES.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Unit</label>
                      <select
                        name="unit"
                        defaultValue={editingProduct?.unit || 'kg'}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pine-500/20 transition-all font-medium appearance-none"
                      >
                        {UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Selling Price (₹)</label>
                      <div className="relative">
                        <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          required
                          name="price"
                          type="number"
                          defaultValue={editingProduct?.price}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pine-500/20 transition-all font-bold text-pine-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Cost Price (₹)</label>
                      <div className="relative">
                        <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          required
                          name="costPrice"
                          type="number"
                          defaultValue={editingProduct?.costPrice}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pine-500/20 transition-all font-bold text-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Stock Quantity</label>
                      <input
                        required
                        name="quantity"
                        type="number"
                        defaultValue={editingProduct?.quantity}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pine-500/20 transition-all font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Image URL</label>
                      <input
                        name="image"
                        type="text"
                        defaultValue={editingProduct?.image}
                        placeholder="https://images.unsplash..."
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pine-500/20 transition-all text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-pine-600 text-white rounded-2xl font-bold hover:bg-pine-700 transition-all shadow-lg shadow-pine-600/20"
                  >
                    {editingProduct ? 'Update Product' : 'Save Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual Out of Stock Modal */}
      <AnimatePresence>
        {showOOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowOOSModal(null)} className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-[32px] w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-600">
                <Power size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Mark as Out of Stock?</h3>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  "{showOOSModal.name}" will be hidden from the customer app immediately.
                </p>
              </div>

              <div className="text-left w-full bg-gray-50 p-4 rounded-2xl space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Reason for Unavailability</label>
                <select
                  value={selectedOOSReason}
                  onChange={(e) => setSelectedOOSReason(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-transparent focus:border-pine-500/20 rounded-xl text-sm font-bold text-gray-700 outline-none"
                >
                  {OOS_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => setShowOOSModal(null)} className="py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={submitOOS} className="py-3 bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">Confirm OOS</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
