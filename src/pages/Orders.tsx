import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle, Truck, XCircle,
  Search, MoreVertical,
  ChevronRight, Package, Calendar,
  AlertCircle, Phone, MapPin, Check, Ban, PackageCheck,
  Zap
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '../types';

const STATUS_FLOW: Order['status'][] = ['New', 'Accepted', 'Packed', 'Picked', 'Delivered'];

const Orders = () => {
  const { orders, updateOrderStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'New' | 'Ongoing' | 'Completed' | 'Cancelled'>('New');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  const stats = useMemo(() => {
    return {
      new: orders.filter(o => o.status === 'New').length,
      ongoing: orders.filter(o => ['Accepted', 'Packed', 'Picked'].includes(o.status)).length,
      completed: orders.filter(o => o.status === 'Delivered').length,
      cancelled: orders.filter(o => o.status === 'Cancelled' || o.status === 'Rejected').length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesTab = false;
      if (activeTab === 'New') matchesTab = o.status === 'New';
      else if (activeTab === 'Ongoing') matchesTab = ['Accepted', 'Packed', 'Picked'].includes(o.status);
      else if (activeTab === 'Completed') matchesTab = o.status === 'Delivered';
      else if (activeTab === 'Cancelled') matchesTab = o.status === 'Cancelled' || o.status === 'Rejected';

      return matchesSearch && matchesTab;
    });
  }, [orders, searchTerm, activeTab]);

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'New': return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: <Zap size={14} /> };
      case 'Accepted': return { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: <Check size={14} /> };
      case 'Packed': return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: <PackageCheck size={14} /> };
      case 'Picked': return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: <Truck size={14} /> };
      case 'Delivered': return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: <CheckCircle size={14} /> };
      case 'Cancelled':
      case 'Rejected': return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: <XCircle size={14} /> };
      default: return { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100', icon: <Package size={14} /> };
    }
  };

  const handleNextStatus = (order: Order) => {
    const currentIndex = STATUS_FLOW.indexOf(order.status);
    if (currentIndex !== -1 && currentIndex < STATUS_FLOW.length - 1) {
      updateOrderStatus(order.id, STATUS_FLOW[currentIndex + 1]);
    }
  };

  return (
    <div className="p-1 sm:p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order Dashboard</h1>
            <p className="text-gray-500 font-medium">Manage and track your mart orders in real-time.</p>
          </div>
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pine-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by Order ID or Name..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-pine-500/10 focus:border-pine-500 transition-all font-medium shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm w-fit overflow-x-auto no-scrollbar">
          {(['New', 'Ongoing', 'Completed', 'Cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === tab
                  ? "bg-pine-600 text-white shadow-lg shadow-pine-600/20"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {tab}
              <span className={clsx(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black",
                activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              )}>
                {stats[tab.toLowerCase() as keyof typeof stats]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid/List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode='popLayout'>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <motion.div
                layout
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={clsx(
                  "relative group bg-white rounded-3xl border transition-all duration-300 overflow-hidden",
                  order.isUrgent && order.status === 'New' ? "border-red-200 shadow-xl shadow-red-500/5 ring-1 ring-red-100" : "border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50"
                )}
              >
                {/* Urgent Badge */}
                {order.isUrgent && order.status === 'New' && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl flex items-center gap-1.5 animate-pulse z-10">
                    <AlertCircle size={10} />
                    Urgent Order
                  </div>
                )}

                <div className="p-6 space-y-6">
                  {/* Card Header: ID, Date, Status */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-pine-600 bg-pine-50 px-2 py-0.5 rounded-lg border border-pine-100">#{order.id}</span>
                        <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(order.date).toLocaleDateString([], { day: 'numeric', month: 'short' })} at {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className={clsx(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                        getStatusConfig(order.status).color, getStatusConfig(order.status).bg, getStatusConfig(order.status).border
                      )}>
                        {getStatusConfig(order.status).icon}
                        {order.status}
                      </div>
                    </div>

                    <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</p>
                      <h4 className="text-sm font-bold text-gray-900">{order.customerName}</h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                        <Phone size={12} className="text-gray-400" />
                        {order.customerPhone}
                      </div>
                    </div>
                    <div className="space-y-1 border-l border-gray-200 pl-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</p>
                      <div className="flex items-start gap-1 text-xs text-gray-600 line-clamp-2 leading-relaxed font-medium">
                        <MapPin size={12} className="text-gray-400 mt-0.5 shrink-0" />
                        {order.customerAddress}
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Items ({order.items.length})</h5>
                      <span className="text-sm font-black text-pine-600 bg-pine-50 px-2 py-0.5 rounded-md">Total: ₹{order.total}</span>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm p-3 border border-gray-50 rounded-xl hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                              <Package size={14} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{item.productName}</p>
                              <p className="text-[10px] text-gray-400">₹{item.price} per unit</p>
                            </div>
                          </div>
                          <span className="font-black text-gray-700 bg-gray-100 px-2 py-1 rounded-lg text-xs">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cancellation Reason if any */}
                  {(order.status === 'Cancelled' || order.status === 'Rejected') && order.cancellationReason && (
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                        <Ban size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Cancellation Reason</p>
                        <p className="text-xs font-bold text-red-900 mt-0.5">{order.cancellationReason}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    {order.status === 'New' ? (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Accepted')}
                          className="flex-1 py-4 bg-pine-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-pine-700 transition-all shadow-lg shadow-pine-600/20 active:scale-[0.98]"
                        >
                          Accept Order
                        </button>
                        <button
                          onClick={() => setShowRejectModal(order.id)}
                          className="px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all active:scale-[0.98]"
                        >
                          Reject
                        </button>
                      </>
                    ) : (['Accepted', 'Packed', 'Picked'].includes(order.status)) ? (
                      <button
                        onClick={() => handleNextStatus(order)}
                        className="flex-1 py-4 bg-pine-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-pine-700 transition-all shadow-lg shadow-pine-600/20 flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        {order.status === 'Accepted' && 'Mark as Packed'}
                        {order.status === 'Packed' && 'Hand over to Rider'}
                        {order.status === 'Picked' && 'Mark as Delivered'}
                        <ChevronRight size={14} />
                      </button>
                    ) : (
                      <div className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center border border-gray-100">
                        Order Processed
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-2 text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="text-gray-300" size={40} />
              </div>
              <h3 className="text-xl font-black text-gray-900">No {activeTab} Orders</h3>
              <p className="text-gray-500 font-medium mt-2">When new orders arrive, they will appear here.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reject/Cancel Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRejectModal(null)}
              className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[32px] w-full max-w-md shadow-2xl shadow-gray-950/20 overflow-hidden"
            >
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto">
                  <Ban size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-gray-900">Cancel Order?</h2>
                  <p className="text-gray-500 font-medium">Please provide a reason for cancelling this order. This will be shared with the customer.</p>
                </div>

                <div className="space-y-3">
                  {['Items unavailable', 'Mart closing soon', 'Delivery range issue', 'Other'].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => {
                        updateOrderStatus(showRejectModal, 'Rejected', reason);
                        setShowRejectModal(null);
                      }}
                      className="w-full py-4 px-6 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-2xl transition-all text-left flex justify-between items-center group"
                    >
                      {reason}
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-600 transition-all" />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowRejectModal(null)}
                  className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                >
                  Changed my mind
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Real-time Update Indicator */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-gray-950/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl z-50">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        Live Updates Active
      </div>
    </div>
  );
};

export default Orders;
