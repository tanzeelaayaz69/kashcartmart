import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell, Search, Globe, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, markAllNotificationsAsRead, stats } = useApp();

  return (
    <div className="flex min-h-screen bg-white selection:bg-pine-100 selection:text-pine-900 font-sans">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#FAFAFB]">
        {/* Top Navigation Bar */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 lg:px-10 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm shadow-gray-200/5">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-gray-50 rounded-xl text-gray-900 shadow-sm border border-gray-100 transition-all active:scale-95"
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 group transition-all focus-within:ring-2 focus-within:ring-pine-500/10 focus-within:bg-white focus-within:border-pine-200">
              <Search size={16} className="text-gray-400 group-focus-within:text-pine-600 transition-colors" />
              <input
                type="text"
                placeholder="Ctrl + K to search..."
                className="bg-transparent border-none outline-none text-xs font-bold text-gray-700 w-48 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-3 lg:gap-6 relative">
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
              <Globe size={14} className="text-gray-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">English</span>
              <ChevronDown size={12} className="text-gray-400" />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 text-gray-500 hover:bg-gray-50 border border-transparent hover:border-gray-100 rounded-xl relative transition-all group"
              >
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                {stats.unreadNotifications > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                    <span className="text-[8px] font-black text-white">{stats.unreadNotifications}</span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl shadow-gray-200 border border-gray-100 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                      <button onClick={markAllNotificationsAsRead} className="text-[10px] font-black uppercase tracking-widest text-pine-600 hover:text-pine-700">Mark all read</button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length > 0 ? notifications.map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 flex gap-4 cursor-pointer">
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.isUnread ? 'bg-pine-500' : 'bg-transparent'}`} />
                          <div>
                            <p className="text-xs font-bold text-gray-900 mb-0.5">{notif.title}</p>
                            <p className="text-xs text-gray-500 font-medium mb-1.5 line-clamp-2">{notif.desc}</p>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-wider">{notif.time}</span>
                          </div>
                        </div>
                      )) : (
                        <div className="p-8 text-center">
                          <p className="text-xs text-gray-400 font-medium">No new notifications</p>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-gray-50 text-center border-t border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">View All Updates</span>
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            <div className="h-8 w-[1px] bg-gray-100 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-black text-gray-900 leading-none">Hassan Q.</span>
                <span className="text-[9px] font-black text-pine-600 uppercase tracking-widest mt-1 opacity-70">Gold Partner</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-pine-100 flex items-center justify-center text-pine-600 font-black text-sm border border-pine-200/50 shadow-inner overflow-hidden">
                <img src="https://images.unsplash.com/photo-1614031679232-0dae72906163?auto=format&fit=crop&q=80&w=100" alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
