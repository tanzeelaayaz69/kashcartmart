import {
  ShoppingBag, TrendingUp, Package, Clock,
  Plus, RefreshCw, FileText, ChevronRight,
  Box, AlertTriangle, Zap, CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import StoreStatusToggle from '../components/StoreStatusToggle';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { stats, orders, products } = useApp();

  const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity < 10);
  const outOfStockProducts = products.filter(p => p.quantity === 0);
  const newOrders = orders.filter(o => o.status === 'New');

  return (
    <div className="p-1 sm:p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Mart Dashboard</h1>
          <p className="text-gray-500 font-medium">Monitoring your Srinagar mart's performance.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/inventory"
            className="flex items-center gap-2 px-6 py-2.5 bg-pine-600 text-white rounded-xl hover:bg-pine-700 transition-all shadow-lg shadow-pine-600/20 font-bold"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Revenue"
          value={`₹${stats.todayRevenue.toLocaleString()}`}
          icon={TrendingUp}
          color="pine"
          trend="+12%"
        />
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Total Stock"
          value={stats.stockCount}
          icon={Package}
          color="copper"
        />
        <StatCard
          title="Active Orders"
          value={stats.pendingOrders}
          icon={Clock}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts & Inventory Status */}
        <div className="lg:col-span-1 space-y-6">
          {/* Store Status Toggle - Prominent Position */}
          <StoreStatusToggle />

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-amber-500" />
              Critical Alerts
            </h2>
            <div className="space-y-4">
              {newOrders.length > 0 && (
                <Link to="/orders" className="block p-4 bg-blue-50 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-700 flex items-center gap-2">
                      <Zap size={14} className="animate-pulse" />
                      {newOrders.length} New Orders Pending
                    </span>
                    <ChevronRight size={14} className="text-blue-400" />
                  </div>
                </Link>
              )}
              {outOfStockProducts.length > 0 && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-red-700 flex items-center gap-2">
                      <Box size={14} />
                      {outOfStockProducts.length} Items Out of Stock
                    </span>
                    <Link to="/inventory" className="text-xs font-black uppercase text-red-600 hover:underline">Restock</Link>
                  </div>
                </div>
              )}
              {lowStockProducts.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-amber-700 flex items-center gap-2">
                      <AlertTriangle size={14} />
                      {lowStockProducts.length} Items Low Stock
                    </span>
                    <Link to="/inventory" className="text-xs font-black uppercase text-amber-600 hover:underline">View</Link>
                  </div>
                </div>
              )}
              {newOrders.length === 0 && outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                  <CheckCircle className="mx-auto text-emerald-200 mb-2" size={32} />
                  <p className="text-sm text-gray-400 font-medium">System healthy. No alerts.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <Link to="/inventory" className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <RefreshCw size={20} />
                  </div>
                  <span className="font-bold text-gray-700">Update Stock</span>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </Link>
              <Link to="/sales" className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-copper-100 flex items-center justify-center text-copper-600">
                    <FileText size={20} />
                  </div>
                  <span className="font-bold text-gray-700">Sales Report</span>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            <Link to="/orders" className="text-sm font-bold text-pine-600 hover:text-pine-700 flex items-center gap-1 group">
              Dashboard <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="overflow-x-auto -mx-2 sm:-mx-0">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <th className="pb-4 font-bold px-2">Order ID</th>
                  <th className="pb-4 font-bold px-2">Customer</th>
                  <th className="pb-4 font-bold px-2">Status</th>
                  <th className="pb-4 font-bold px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {orders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-2 font-bold text-pine-600 text-xs">#{order.id}</td>
                    <td className="py-4 px-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{order.customerName}</span>
                        <span className="text-[10px] text-gray-400">{new Date(order.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        order.status === 'New' ? 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse' :
                          order.status === 'Cancelled' || order.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right font-black text-gray-900">₹{order.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
