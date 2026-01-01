import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart,
  BarChart3, Settings, X, LogOut,
  HelpCircle, Star
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

import { useApp } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { stats } = useApp();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: BarChart3, label: 'Financials', path: '/sales' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside className={clsx(
        "fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-100 transition-all duration-500 ease-in-out lg:translate-x-0 lg:static flex flex-col shadow-2xl shadow-gray-200/50 lg:shadow-none font-sans",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand */}
        <div className="flex items-center justify-between p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pine-600 rounded-[14px] flex items-center justify-center text-white shadow-lg shadow-pine-600/30">
              <Star size={20} fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900 tracking-tight leading-none uppercase">KashCart</span>
              <span className="text-[10px] font-black text-pine-600 uppercase tracking-widest mt-1 opacity-70">Mart Owner</span>
            </div>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden p-2 bg-gray-50 rounded-xl text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
          <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold group",
                isActive
                  ? "bg-pine-600 text-white shadow-xl shadow-pine-600/20"
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <item.icon size={20} className={clsx("transition-transform group-hover:scale-110")} />
              <span className="text-sm tracking-tight">{item.label}</span>
              {item.label === 'Orders' && stats.pendingOrders > 0 && (
                <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-black animate-pulse shadow-lg shadow-red-500/20">
                  {stats.pendingOrders}
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-8">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Support</p>
            <NavLink
              to="/help"
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold group",
                isActive
                  ? "bg-pine-600 text-white shadow-xl shadow-pine-600/20"
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <HelpCircle size={20} className={clsx("transition-transform group-hover:scale-110")} />
              <span className="text-sm tracking-tight">Support Hub</span>
            </NavLink>
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className="p-6 border-t border-gray-50">
          <div className="p-5 bg-gray-50 rounded-[28px] flex items-center gap-4 border border-gray-100 group cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-pine-600 font-black text-sm border border-gray-100 overflow-hidden shrink-0">
              <img src="https://images.unsplash.com/photo-1614031679232-0dae72906163?auto=format&fit=crop&q=80&w=100" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 truncate">Hassan Qureshi</p>
              <p className="text-xs font-bold text-gray-400 truncate tracking-tight">Kashmiri Spice Mart</p>
            </div>
            <LogOut size={20} className="text-gray-300 group-hover:text-red-500 transition-colors shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
