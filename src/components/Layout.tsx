import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import StoreStatusBanner from './StoreStatusBanner';
import { Menu, Bell, Search, Globe, ChevronDown, User, Settings, LogOut, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { notifications, markAllNotificationsAsRead, stats } = useApp();

  return (
    <div className="flex min-h-screen bg-white selection:bg-pine-100 selection:text-pine-900 font-sans">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#FAFAFB]">
        {/* Store Status Banner */}
        <StoreStatusBanner />

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

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-2xl transition-colors"
              >
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-xs font-black text-gray-900 leading-none">Hassan Q.</span>
                  <span className="text-[9px] font-black text-pine-600 uppercase tracking-widest mt-1 opacity-70">Gold Partner</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-pine-100 flex items-center justify-center text-pine-600 font-black text-sm border border-pine-200/50 shadow-inner overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1614031679232-0dae72906163?auto=format&fit=crop&q=80&w=100" alt="" className="w-full h-full object-cover" />
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-white rounded-3xl shadow-2xl shadow-gray-200 border border-gray-100 z-50 overflow-hidden"
                  >
                    {/* Profile Header */}
                    <div className="p-6 bg-gradient-to-br from-pine-50 to-pine-100/50 border-b border-pine-100">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-pine-100 flex items-center justify-center text-pine-600 font-black text-lg border-2 border-pine-200 shadow-inner overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1614031679232-0dae72906163?auto=format&fit=crop&q=80&w=100" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-gray-900">Hassan Q.</h3>
                          <p className="text-xs font-bold text-pine-600 uppercase tracking-wider">Gold Partner</p>
                          <p className="text-xs text-gray-500 mt-1">+91 9906100000</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-3 space-y-1">
                      <Link
                        to="/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-pine-100 group-hover:text-pine-600 transition-colors">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">My Profile</p>
                          <p className="text-xs text-gray-400">View and edit profile</p>
                        </div>
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-pine-100 group-hover:text-pine-600 transition-colors">
                          <Settings size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Settings</p>
                          <p className="text-xs text-gray-400">Manage preferences</p>
                        </div>
                      </Link>

                      <Link
                        to="/store-settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-pine-100 group-hover:text-pine-600 transition-colors">
                          <Store size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Store Status</p>
                          <p className="text-xs text-gray-400">Manage store hours</p>
                        </div>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="p-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                          <LogOut size={18} />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-900 text-sm group-hover:text-red-600 transition-colors">Logout</p>
                          <p className="text-xs text-gray-400">Sign out of your account</p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
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
                <LogOut size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-900">Logout?</h2>
                <p className="text-gray-500 font-medium">
                  Are you sure you want to logout? You'll need to sign in again to access your mart.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-2xl transition-all text-sm uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    // Add actual logout logic here
                    alert('Logging out...');
                  }}
                  className="flex-1 py-4 px-6 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl transition-all text-sm uppercase tracking-widest shadow-lg shadow-red-500/30"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Layout;
