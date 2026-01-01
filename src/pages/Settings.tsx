import { useState } from 'react';
import {
  Save, Store, Clock, MapPin,
  Phone, Bell, Shield, LogOut,
  ChevronRight, Camera, Power, Package,
  CreditCard, HelpCircle, Settings2, Sliders,
  Check, Info, FileText, Smartphone,
  Lock, Calendar, Download, Image as ImageIcon,
  Briefcase, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

type Tab = 'store' | 'inventory' | 'payments' | 'notifications' | 'account' | 'support' | 'advanced';

const Settings = () => {
  const [storeStatus, setStoreStatus] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('store');

  const navItems = [
    { id: 'store', label: 'Store Profile', icon: Store, color: 'text-pine-600', bg: 'bg-pine-50' },
    { id: 'inventory', label: 'Inventory & Orders', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'payments', label: 'Payments', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'account', label: 'Security & Account', icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'support', label: 'Legal & Support', icon: HelpCircle, color: 'text-copper-600', bg: 'bg-copper-50' },
    { id: 'advanced', label: 'Advanced Tools', icon: Settings2, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-1 sm:p-4 max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header with High-Visibility Status Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 opacity-50" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">KashCart Settings</h1>
          <p className="text-gray-500 font-medium tracking-tight">Manage your Srinagar mart operation from one place.</p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className={clsx(
            "px-6 py-4 rounded-[24px] border flex flex-col gap-1 transition-all min-w-[160px]",
            storeStatus ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
          )}>
            <div className="flex items-center gap-2">
              <div className={clsx("w-2.5 h-2.5 rounded-full", storeStatus ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
              <span className={clsx("text-[10px] font-black uppercase tracking-widest", storeStatus ? "text-emerald-700" : "text-red-700")}>
                {storeStatus ? 'Store is Open' : 'Store is Closed'}
              </span>
            </div>
            <p className="text-[10px] font-bold text-gray-400">Accepting orders right now</p>
          </div>

          <button
            onClick={() => setStoreStatus(!storeStatus)}
            className={clsx(
              "p-5 rounded-[24px] border transition-all hover:shadow-xl active:scale-95 group",
              storeStatus ? "bg-white border-gray-100 text-red-500 hover:bg-red-50" : "bg-white border-gray-100 text-emerald-500 hover:bg-emerald-50"
            )}
          >
            <Power size={24} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-white p-3 rounded-[32px] border border-gray-100 shadow-sm space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={clsx(
                  "w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all text-left group",
                  activeTab === item.id
                    ? "bg-pine-600 text-white shadow-lg shadow-pine-600/20 translate-x-1"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon size={20} className={clsx("transition-transform group-hover:scale-110", activeTab === item.id ? "text-white" : item.color)} />
                <span className="text-sm">{item.label}</span>
                {activeTab === item.id && <ChevronRight size={16} className="ml-auto" />}
              </button>
            ))}
          </div>

          <div className="pt-4 space-y-2">
            <button className="w-full flex items-center gap-3 px-6 py-4 rounded-[24px] font-bold text-red-400 hover:bg-red-50 transition-all text-left border border-transparent hover:border-red-100">
              <LogOut size={20} />
              <span className="text-sm">Logout Session</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 sm:p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10"
            >
              {/* 1️⃣ Store Profile Settings */}
              {activeTab === 'store' && (
                <div className="space-y-10">
                  <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                    <div className="relative group self-center sm:self-auto">
                      <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl ring-1 ring-gray-100 bg-gray-50 flex items-center justify-center relative">
                        <img src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=300" alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon size={24} className="text-white" />
                        </div>
                      </div>
                      <button className="absolute -bottom-2 -right-2 p-3 bg-pine-600 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
                        <Camera size={18} />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-2xl font-black text-gray-900 leading-tight">Store Profile</h2>
                      <p className="text-sm text-gray-400 font-medium">This identity is visible to customers in Srinagar.</p>
                      <div className="flex gap-2 pt-2">
                        <span className="px-3 py-1 bg-pine-50 text-pine-600 text-[10px] font-black uppercase rounded-full border border-pine-100">Super Mart</span>
                        <span className="px-3 py-1 bg-copper-50 text-copper-600 text-[10px] font-black uppercase rounded-full border border-copper-100">Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Store Name</label>
                      <div className="relative">
                        <Store size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input type="text" defaultValue="Kashmiri Spice Mart" className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pine-500/10 transition-all font-bold text-gray-700" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Business Category</label>
                      <div className="relative">
                        <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <select className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pine-500/10 transition-all font-bold text-gray-700 appearance-none">
                          <option>Grocery & Essentials</option>
                          <option>Bakery & Confectionery</option>
                          <option>Fresh Meat & Fish</option>
                          <option>Pharmacy & Healthcare</option>
                        </select>
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Store Description</label>
                      <textarea rows={2} defaultValue="Specializing in authentic Kashmiri spices, dry fruits, and daily essentials from the heart of Srinagar." className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pine-500/10 transition-all font-bold text-gray-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Contact Number</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input type="tel" defaultValue="+91 99061 23456" className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pine-500/10 transition-all font-bold text-gray-700" />
                      </div>
                    </div>
                    <div className="space-y-2 text-right">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pr-1">Operational Times</label>
                      <div className="flex gap-2">
                        <input type="time" defaultValue="08:00" className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-center font-black text-gray-700" />
                        <input type="time" defaultValue="22:00" className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl text-center font-black text-gray-700" />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Store Address</label>
                      <div className="relative group">
                        <MapPin size={18} className="absolute left-4 top-5 text-gray-300" />
                        <textarea
                          rows={2}
                          defaultValue="Shop No. 45, Polo View Market, Residency Road, Srinagar, J&K"
                          className="w-full pl-11 pr-32 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pine-500/10 transition-all font-medium text-gray-700 leading-relaxed"
                        />
                        <button className="absolute right-3 top-3 px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase text-pine-600 shadow-sm hover:shadow-md transition-all">
                          Auto-Locate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2️⃣ Inventory & Order Settings */}
              {activeTab === 'inventory' && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 leading-tight">Order & Stock Control</h2>
                    <p className="text-sm text-gray-400 font-medium">Control how your mart handles stock and new orders.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><Sliders size={18} /></div>
                        <h3 className="font-black text-gray-900 leading-tight">Quantities</h3>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Low Stock Alert (Units)</label>
                        <input type="number" defaultValue={10} className="w-full px-5 py-3 bg-white border-2 border-transparent focus:border-amber-500/20 rounded-2xl font-black text-gray-700 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Orders Per Hour</label>
                        <input type="number" defaultValue={15} className="w-full px-5 py-3 bg-white border-2 border-transparent focus:border-amber-500/20 rounded-2xl font-black text-gray-700 outline-none transition-all" />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Clock size={18} /></div>
                        <h3 className="font-black text-gray-900 leading-tight">Automation</h3>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auto-Cancel Timeout (Mins)</label>
                        <input type="number" defaultValue={5} className="w-full px-5 py-3 bg-white border-2 border-transparent focus:border-blue-500/20 rounded-2xl font-black text-gray-700 outline-none transition-all" />
                      </div>
                      <div className="pt-2">
                        {[
                          { id: 'auto_oos', label: 'Toggle Out-of-Stock Automatically', active: true },
                          { id: 'allow_accept', label: 'Allow Manual Acceptance', active: true },
                        ].map(n => (
                          <div key={n.id} className="flex items-center justify-between py-2">
                            <span className="text-xs font-bold text-gray-600">{n.label}</span>
                            <div className={clsx("w-10 h-5 rounded-full relative transition-colors cursor-pointer", n.active ? "bg-pine-600" : "bg-gray-300")}>
                              <div className={clsx("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", n.active ? "right-1" : "left-1")} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3️⃣ Payment Settings */}
              {activeTab === 'payments' && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 leading-tight">Financial & Payouts</h2>
                    <p className="text-sm text-gray-400 font-medium tracking-tight">Manage gateways and settlement details.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-1 p-6 rounded-3xl border-2 border-emerald-100 bg-emerald-50/30 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <CreditCard className="text-emerald-600" size={24} />
                          <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                            <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full" />
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Online Payments</p>
                          <p className="text-xs text-gray-500 mt-1">UPI, Credit/Debit cards & Wallets</p>
                        </div>
                      </div>
                      <div className="flex-1 p-6 rounded-3xl border-2 border-pine-100 bg-pine-50/30 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <Smartphone className="text-pine-600" size={24} />
                          <div className="w-10 h-5 bg-pine-500 rounded-full relative">
                            <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full" />
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-pine-600 uppercase tracking-widest">Cash on Delivery</p>
                          <p className="text-xs text-gray-500 mt-1">Accept cash at the doorstep</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 space-y-6">
                      <h3 className="flex items-center gap-2 font-black text-gray-900">
                        <Check size={18} className="text-pine-600" />
                        Settlement Bank Account
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bank Name</label>
                          <input type="text" defaultValue="Jammu & Kashmir Bank" className="w-full px-5 py-3 bg-white rounded-xl font-bold text-gray-700 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Acc Holder</label>
                          <input type="text" defaultValue="HASSAN QURESHI" className="w-full px-5 py-3 bg-white rounded-xl font-bold text-gray-700 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Number</label>
                          <input type="password" defaultValue="************3456" className="w-full px-5 py-3 bg-white rounded-xl font-bold text-gray-700 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">IFSC Code</label>
                          <input type="text" defaultValue="JAKA0Srinagar" className="w-full px-5 py-3 bg-white rounded-xl font-bold text-gray-700 outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><FileText size={20} /></div>
                        <div>
                          <p className="font-black text-gray-900">Settlement Policy</p>
                          <p className="text-xs text-gray-500">Platform Commission: <strong className="text-gray-900">5%</strong> | Tax: <strong className="text-gray-900">GST 18%</strong></p>
                        </div>
                      </div>
                      <button className="px-5 py-2.5 bg-gray-50 text-gray-600 text-[10px] font-black uppercase rounded-xl hover:bg-gray-100 transition-all">View History</button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4️⃣ Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 leading-tight">Interaction Alerts</h2>
                    <p className="text-sm text-gray-400 font-medium">Configure alert triggers and channels.</p>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: 'New Orders', desc: 'Instant alert for every new purchase', active: true },
                        { title: 'Order Cancellations', desc: 'When a customer cancels within timeout', active: true },
                        { title: 'Low Stock Alerts', desc: 'When products hit your threshold', active: true },
                        { title: 'Settlement Alerts', desc: 'Daily payout confirmations', active: false },
                      ].map((n, i) => (
                        <div key={i} className="p-5 bg-gray-50 rounded-3xl flex items-center justify-between border border-transparent hover:border-blue-100 transition-all group">
                          <div>
                            <p className="font-bold text-gray-900">{n.title}</p>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">{n.desc}</p>
                          </div>
                          <div className={clsx("w-10 h-5 rounded-full relative transition-colors cursor-pointer transition-all active:scale-90", n.active ? "bg-pine-600 shadow-sm" : "bg-gray-300")}>
                            <div className={clsx("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", n.active ? "right-1" : "left-1")} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-gray-50">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 mb-4 block">Notification Channels</label>
                      <div className="flex flex-wrap gap-4">
                        {['Mobile App', 'SMS Alerts', 'WhatsApp Business'].map(c => (
                          <div key={c} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer hover:bg-gray-50 transition-all">
                            <div className="w-5 h-5 rounded border-2 border-pine-200 flex items-center justify-center text-pine-600 group">
                              <Check size={14} />
                            </div>
                            <span className="text-xs font-bold text-gray-700">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5️⃣ Security & Account Settings */}
              {activeTab === 'account' && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 leading-tight">Security & Privacy</h2>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">Keep your store and account access safe.</p>
                  </div>

                  <div className="space-y-8">
                    <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-red-500"><Lock size={28} /></div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">Change Mart Password</p>
                        <p className="text-xs text-red-600/60 font-medium">Last changed 45 days ago</p>
                      </div>
                      <button className="px-6 py-3 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">Reset</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                          <Shield size={18} className="text-pine-600" /> Active Sessions
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex flex-col">
                              <span className="font-bold">iPhone 15 Pro, Srinagar</span>
                              <span className="text-[10px] text-gray-400">Current Device</span>
                            </div>
                            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                          </div>
                          <div className="flex items-center justify-between text-xs px-4 py-3 bg-white rounded-xl border border-gray-100 opacity-60">
                            <div className="flex flex-col">
                              <span className="font-bold">Chrome Windows, Mart PC</span>
                              <span className="text-[10px] text-gray-400">Active 2h ago</span>
                            </div>
                            <button className="text-red-500 hover:underline">Revoke</button>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                          <Smartphone size={18} className="text-indigo-600" /> Multi-Factor Auth
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">Secure your logins by requiring an OTP from your phone every time someone tries to access your mart dashboard.</p>
                        <button className="w-full py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase text-indigo-600 hover:bg-gray-50 transition-all">Enable 2FA Securely</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6️⃣ Legal & Support */}
              {activeTab === 'support' && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 leading-tight">Help & Documentation</h2>
                    <p className="text-sm text-gray-500 font-medium">Resources for running a smooth mart operation.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {[
                        { title: 'Terms of Service', icon: FileText },
                        { title: 'Privacy Policy', icon: Shield },
                        { title: 'Mart Operations Guide', icon: Info },
                      ].map((l, i) => (
                        <button key={i} className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl hover:bg-gray-50 transition-all shadow-sm">
                          <div className="flex items-center gap-3 font-bold text-gray-900">
                            <l.icon size={20} className="text-gray-400" />
                            <span className="text-sm">{l.title}</span>
                          </div>
                          <ChevronRight size={18} className="text-gray-300" />
                        </button>
                      ))}
                    </div>

                    <div className="bg-copper-600 p-8 rounded-[40px] text-white space-y-6 relative overflow-hidden shadow-xl shadow-copper-600/20">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                      <div className="relative z-10 space-y-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><HelpCircle size={28} /></div>
                        <div>
                          <h3 className="text-xl font-black leading-tight">Emergency Support</h3>
                          <p className="text-sm font-medium opacity-80 mt-1">Available 24/7 for order resolution and technical issues.</p>
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                          <button className="w-full py-4 bg-white text-copper-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-copper-50 transition-all">Chat with Support</button>
                          <button className="w-full py-4 bg-copper-500/30 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/20 hover:bg-copper-500/50 transition-all">Report Issue</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 7️⃣ Advanced Settings */}
              {activeTab === 'advanced' && (
                <div className="space-y-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 leading-tight">Advanced Controls</h2>
                      <p className="text-sm text-gray-500 font-medium tracking-tight">Powerful tools for experienced mart owners.</p>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100">
                      <Sliders size={24} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 rounded-3xl space-y-6">
                      <h3 className="font-black text-gray-900 flex items-center gap-2 px-1">
                        <TrendingUp size={18} className="text-purple-600" /> Smart Pricing
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-gray-900">Dynamic Pricing</p>
                            <p className="text-[10px] text-gray-400 font-medium tracking-tight">Adjust prices based on demand shifts</p>
                          </div>
                          <div className="w-10 h-5 bg-gray-300 rounded-full relative"><div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full" /></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-gray-900">Radius Visibility</p>
                            <p className="text-[10px] text-gray-400 font-medium tracking-tight">Show store only in 5km radius</p>
                          </div>
                          <div className="w-10 h-5 bg-pine-600 rounded-full relative"><div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full" /></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-3xl space-y-6">
                      <h3 className="font-black text-gray-900 flex items-center gap-2 px-1">
                        <Calendar size={18} className="text-amber-600" /> Scheduling
                      </h3>
                      <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 group group-hover:bg-gray-50 transition-all">
                        <div className="text-left">
                          <p className="text-xs font-bold text-gray-900">Holiday Closure</p>
                          <p className="text-[10px] text-gray-400 font-medium">Plan upcoming store breaks</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-300" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 group">
                        <div className="text-left">
                          <p className="text-xs font-bold text-gray-900">Product Time-Slots</p>
                          <p className="text-[10px] text-gray-400 font-medium">Set hour availability for specific items</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-300" />
                      </button>
                    </div>

                    <div className="md:col-span-2 bg-gradient-to-r from-pine-600 to-pine-800 p-10 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                      <div className="space-y-2 relative z-10">
                        <h3 className="text-2xl font-black">Data Exports</h3>
                        <p className="text-sm font-medium opacity-80 max-w-sm">Download comprehensive sales, revenue and inventory reports for your accounting.</p>
                      </div>
                      <div className="flex gap-4 relative z-10">
                        <button className="px-8 py-4 bg-white text-pine-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-pine-50 transition-all flex items-center gap-2 shadow-xl">
                          <Download size={18} /> Excel Report
                        </button>
                        <button className="px-8 py-4 bg-pine-500/30 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/20 hover:bg-pine-500/50 transition-all flex items-center gap-2">
                          <FileText size={18} /> PDF Export
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shared Save & Reset Actions */}
              <div className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-gray-400">
                  <Info size={16} />
                  <p className="text-xs font-medium tracking-tight">Changes are synced to the cloud instantly once saved.</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <button className="flex-1 sm:px-10 py-5 bg-gray-50 text-gray-500 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 active:scale-[0.98] transition-all">
                    Discard
                  </button>
                  <button className="flex-1 sm:px-12 py-5 bg-pine-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-pine-700 active:scale-[0.98] transition-all shadow-2xl shadow-pine-600/30 flex items-center justify-center gap-2">
                    <Save size={18} />
                    <span>Save All Changes</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Settings;
