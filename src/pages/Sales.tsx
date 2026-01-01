import { useMemo, useState } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';
import { useApp } from '../context/AppContext';
import {
  TrendingUp, DollarSign, ShoppingBag,
  CheckCircle, XCircle, CreditCard,
  ArrowUpRight, ArrowDownRight, Award,
  ArrowRight, Info
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const Sales = () => {
  const { orders, products, salesData } = useApp();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');

  const analytics = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const getFilteredOrders = (start: Date) => orders.filter(o => new Date(o.date) >= start);

    const todayOrders = getFilteredOrders(startOfToday);
    const weekOrders = getFilteredOrders(startOfWeek);
    const monthOrders = getFilteredOrders(startOfMonth);

    const calculateMetrics = (orderList: typeof orders) => {
      const successful = orderList.filter(o => o.status === 'Delivered');
      const revenue = successful.reduce((sum, o) => sum + o.total, 0);

      let totalCost = 0;
      successful.forEach(o => {
        o.items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) totalCost += product.costPrice * item.quantity;
        });
      });

      const codRevenue = successful.filter(o => o.paymentType === 'COD').reduce((sum, o) => sum + o.total, 0);
      const onlineRevenue = successful.filter(o => o.paymentType === 'Online').reduce((sum, o) => sum + o.total, 0);
      const completedCount = successful.length;
      const cancelledCount = orderList.filter(o => o.status === 'Cancelled' || o.status === 'Rejected').length;

      // Best sellers
      const productSales: Record<string, { count: number, revenue: number, name: string, image: string }> = {};
      successful.forEach(o => {
        o.items.forEach(item => {
          if (!productSales[item.productId]) {
            const p = products.find(prod => prod.id === item.productId);
            productSales[item.productId] = {
              count: 0,
              revenue: 0,
              name: item.productName,
              image: p?.image || ''
            };
          }
          productSales[item.productId].count += item.quantity;
          productSales[item.productId].revenue += item.price * item.quantity;
        });
      });

      const bestSellers = Object.values(productSales).sort((a, b) => b.count - a.count).slice(0, 3);

      return {
        revenue,
        profit: revenue - totalCost,
        codRevenue,
        onlineRevenue,
        completedCount,
        cancelledCount,
        bestSellers
      };
    };

    return {
      today: calculateMetrics(todayOrders),
      week: calculateMetrics(weekOrders),
      month: calculateMetrics(monthOrders),
    };
  }, [orders, products]);

  const currentData = analytics[timeRange];

  const pieData = [
    { name: 'COD', value: currentData.codRevenue },
    { name: 'Online', value: currentData.onlineRevenue },
  ];

  const COLORS = ['#b87333', '#4a7c59']; // Copper and Pine


  return (
    <div className="p-1 sm:p-4 space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Analytics</h1>
          <p className="text-gray-500 font-medium">Detailed revenue and profit insights for your KashCart mart.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
          {(['today', 'week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={clsx(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                timeRange === range
                  ? "bg-pine-600 text-white shadow-lg shadow-pine-600/20"
                  : "text-gray-400 hover:bg-gray-50"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `₹${currentData.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-pine-600', bg: 'bg-pine-50', trend: '+14% vs last period' },
          { label: 'Estimated Profit', value: `₹${currentData.profit.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+8.2%' },
          { label: 'Completed Orders', value: currentData.completedCount, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Healthy volume' },
          { label: 'Cancelled Orders', value: currentData.cancelledCount, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', trend: 'Investigation needed' },
        ].map((item, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={item.label}
            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all"
          >
            <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", item.bg, item.color)}>
              <item.icon size={24} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{item.value}</h3>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
              <ArrowUpRight size={12} className={clsx(item.label.includes('Cancelled') ? 'text-red-500 rotate-90' : 'text-emerald-500')} />
              {item.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-900">Revenue Performance</h2>
              <p className="text-sm text-gray-500 font-medium">Daily income trends across the mart.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <span className="w-3 h-3 rounded-full bg-pine-500"></span> Revenue
              <span className="ml-2 w-3 h-3 rounded-full bg-copper-500"></span> Profit
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4a7c59" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#4a7c59" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b87333" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#b87333" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                  itemStyle={{ fontWeight: 800 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4a7c59" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="revenue" stroke="#b87333" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Breakdown & Order Health */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center justify-center gap-2">
              <CreditCard size={20} className="text-pine-600" />
              Payments
            </h2>
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Digital Share</span>
                <span className="text-2xl font-black text-gray-900">
                  {currentData.revenue > 0 ? Math.round((currentData.onlineRevenue / currentData.revenue) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gray-50 rounded-2xl text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Online</p>
                <p className="text-lg font-black text-pine-600">₹{currentData.onlineRevenue.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Cash (COD)</p>
                <p className="text-lg font-black text-copper-600">₹{currentData.codRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-pine-600 p-8 rounded-[40px] shadow-xl shadow-pine-600/20 text-white flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Avg Order Value</p>
              <h3 className="text-3xl font-black">₹{currentData.completedCount > 0 ? Math.round(currentData.revenue / currentData.completedCount) : 0}</h3>
              <p className="text-[10px] font-bold opacity-80 flex items-center gap-1">
                <ArrowDownRight size={12} className="rotate-90" /> Healthy basket size
              </p>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center">
              <ShoppingBag size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Best Sellers & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Best Selling Products</h2>
              <p className="text-sm text-gray-500 font-medium tracking-tight">Top products by consumption volume.</p>
            </div>
            <Award size={32} className="text-amber-500 bg-amber-50 p-1.5 rounded-xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentData.bestSellers.length > 0 ? currentData.bestSellers.map((item, i) => (
              <div key={item.name} className="relative group p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-pine-100 hover:bg-white hover:shadow-xl transition-all">
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-black text-pine-600 z-10">
                  #{i + 1}
                </div>
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-white shadow-sm">
                  <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Sales</p>
                    <p className="text-lg font-black text-pine-600">{item.count} units</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Revenue</p>
                    <p className="text-xs font-bold text-gray-700">₹{item.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12 text-gray-400 font-medium">
                No successful sales recorded for this period.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Info size={20} className="text-blue-500" />
              Insights
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-pine-500 mt-1.5 shrink-0" />
                <p className="text-sm font-medium text-gray-600">Your average profit margin is approximately <strong className="text-gray-900">{currentData.revenue > 0 ? Math.round((currentData.profit / currentData.revenue) * 100) : 0}%</strong>.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <p className="text-sm font-medium text-gray-600">Digital payments are preferred by users in <strong className="text-gray-900">Srinagar Central</strong>.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <p className="text-sm font-medium text-gray-600">Restock <strong className="text-gray-900">Saffron</strong> by Monday to avoid missing sales.</p>
              </div>
            </div>
          </div>

          <button className="w-full mt-8 py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 group">
            Download PDF Report
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;
