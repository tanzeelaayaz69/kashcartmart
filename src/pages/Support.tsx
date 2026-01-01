import { useState } from 'react';
import {
    Search, MessageCircle, Phone, Mail,
    ChevronRight, ChevronDown, Plus, FileText,
    Clock, Send, HelpCircle, Package,
    CreditCard, Shield, Smartphone, Camera, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
type TicketPriority = 'Low' | 'Medium' | 'High';

interface Ticket {
    id: string;
    category: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    date: string;
    lastUpdate: string;
}

const FAQ_CATEGORIES = [
    { id: 'orders', label: 'Orders & Delivery', icon: Package, color: 'text-pine-600', bg: 'bg-pine-50' },
    { id: 'payments', label: 'Payments & Settlement', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'inventory', label: 'Inventory & Stock', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'account', label: 'Account & Login', icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'app', label: 'App Features', icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const FAQS: Record<string, { q: string, a: string }[]> = {
    orders: [
        { q: "How do I accept a new order?", a: "Go to the 'New Orders' tab in the Orders dashboard and click the 'Accept' button. Ensure you have the stock available before accepting." },
        { q: "What if a rider is delayed?", a: "You can track the rider status in the 'Ongoing' orders tab. If the delay is significant, use the 'Report Issue' button on the order card." },
    ],
    payments: [
        { q: "When are settlements processed?", a: "Settlements are processed daily at 11:00 PM for all completed orders. Funds usually reflect in your J&K Bank account by the next morning." },
        { q: "How to check my commission rates?", a: "Go to Settings > Payments to view the current platform commission and tax breakdown." },
    ],
    inventory: [
        { q: "How to bulk update stock?", a: "Currently, you can update stock individually. We are working on a bulk upload feature using Excel sheets." },
    ],
    account: [
        { q: "I forgot my password.", a: "Use the 'Forgot Password' link on the login screen. An OTP will be sent to your registered mobile number." },
    ],
    app: [
        { q: "Is there a dark mode?", a: "Yes, the app automatically adjusts to your system settings, or you can toggle it in Settings." },
    ]
};

const MOCK_TICKETS: Ticket[] = [
    {
        id: 'TKT-9021',
        category: 'Payments',
        title: 'Settlement Amount Mismatch',
        description: 'The settlement for Order #4590 was less than expected.',
        status: 'In Progress',
        priority: 'High',
        date: '2025-06-15',
        lastUpdate: '2 hours ago'
    },
    {
        id: 'TKT-8804',
        category: 'Inventory',
        title: 'Unable to update Saffron price',
        description: 'Getting an error when trying to change the price of 1gm Saffron pack.',
        status: 'Resolved',
        priority: 'Medium',
        date: '2025-06-10',
        lastUpdate: '3 days ago'
    }
];

const Support = () => {
    const [activeTab, setActiveTab] = useState<'help' | 'tickets' | 'contact'>('help');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
    const [showNewTicketModal, setShowNewTicketModal] = useState(false);
    const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
    const [selectedCategory, setSelectedCategory] = useState('orders');

    const filteredFaqs = FAQS[selectedCategory]?.filter(f =>
        f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.a.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleCreateTicket = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would submit to backend
        const newTicket: Ticket = {
            id: `TKT-${Math.floor(Math.random() * 10000)}`,
            category: 'Orders',
            title: 'New Support Request',
            description: 'Automatically generated ticket description.',
            status: 'Open',
            priority: 'Medium',
            date: new Date().toISOString().split('T')[0],
            lastUpdate: 'Just now'
        };
        setTickets([newTicket, ...tickets]);
        setShowNewTicketModal(false);
    };

    return (
        <div className="p-1 sm:p-4 max-w-6xl mx-auto space-y-6 pb-12">
            {/* Header */}
            {/* Header */}
            <div className="bg-pine-50 rounded-[40px] p-8 sm:p-12 text-pine-900 relative overflow-hidden border border-pine-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pine-100/50 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-100/50 rounded-full blur-3xl -ml-10 -mb-10" />

                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-pine-900">Hello, Hassan. <br />How can we help you today?</h1>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pine-400" />
                        <input
                            type="text"
                            placeholder="Search for help, articles, or issues..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-pine-100 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 transition-all font-medium outline-none focus:ring-4 focus:ring-pine-500/10 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-white rounded-2xl border border-gray-100 shadow-sm w-full sm:w-fit overflow-x-auto">
                <button
                    onClick={() => setActiveTab('help')}
                    className={clsx(
                        "px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        activeTab === 'help' ? "bg-pine-600 text-white shadow-lg shadow-pine-600/20" : "text-gray-400 hover:text-pine-600"
                    )}
                >
                    Knowledge Base
                </button>
                <button
                    onClick={() => setActiveTab('tickets')}
                    className={clsx(
                        "px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        activeTab === 'tickets' ? "bg-pine-600 text-white shadow-lg shadow-pine-600/20" : "text-gray-400 hover:text-pine-600"
                    )}
                >
                    My Tickets
                </button>
                <button
                    onClick={() => setActiveTab('contact')}
                    className={clsx(
                        "px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        activeTab === 'contact' ? "bg-pine-600 text-white shadow-lg shadow-pine-600/20" : "text-gray-400 hover:text-pine-600"
                    )}
                >
                    Contact Us
                </button>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* 1️⃣ Knowledge Base */}
                    {activeTab === 'help' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-3">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2 mb-2">Categories</h3>
                                {FAQ_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={clsx(
                                            "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                                            selectedCategory === cat.id
                                                ? "bg-white border-pine-200 shadow-md ring-1 ring-pine-100"
                                                : "bg-gray-50 border-transparent hover:bg-white hover:border-gray-200"
                                        )}
                                    >
                                        <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", cat.bg, cat.color)}>
                                            <cat.icon size={20} />
                                        </div>
                                        <span className={clsx("font-bold", selectedCategory === cat.id ? "text-gray-900" : "text-gray-500")}>
                                            {cat.label}
                                        </span>
                                        {selectedCategory === cat.id && <ChevronRight size={18} className="ml-auto text-pine-600" />}
                                    </button>
                                ))}
                            </div>

                            <div className="lg:col-span-2 space-y-4">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 px-2">Common Questions</h3>
                                {filteredFaqs.length > 0 ? filteredFaqs.map((faq, idx) => (
                                    <div key={idx} className="bg-white border border-gray-100 rounded-3xl overflow-hidden active:scale-[0.99] transition-transform">
                                        <button
                                            onClick={() => setExpandedFaq(expandedFaq === faq.q ? null : faq.q)}
                                            className="w-full flex items-center justify-between p-6 text-left font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                                        >
                                            {faq.q}
                                            <ChevronDown
                                                size={20}
                                                className={clsx("text-gray-400 transition-transform duration-300", expandedFaq === faq.q ? "rotate-180" : "")}
                                            />
                                        </button>
                                        <AnimatePresence>
                                            {expandedFaq === faq.q && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="bg-gray-50 px-6 pb-6 text-sm text-gray-600 font-medium leading-relaxed"
                                                >
                                                    {faq.a}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )) : (
                                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                        <HelpCircle className="mx-auto text-gray-300 mb-2" size={32} />
                                        <p className="text-gray-500 font-bold">No articles found matching "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 2️⃣ Ticket System */}
                    {activeTab === 'tickets' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Support Tickets</h2>
                                    <p className="text-gray-500 font-medium">Track and manage your support requests.</p>
                                </div>
                                <button
                                    onClick={() => setShowNewTicketModal(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-pine-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-pine-700 transition-all shadow-lg shadow-pine-600/20"
                                >
                                    <Plus size={16} /> Raise Ticket
                                </button>
                            </div>

                            <div className="grid gap-4">
                                {tickets.map(ticket => (
                                    <div key={ticket.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className={clsx(
                                                        "px-3 py-1 text-[10px] font-black uppercase rounded-full border",
                                                        ticket.status === 'Open' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                            ticket.status === 'In Progress' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                                "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    )}>
                                                        {ticket.status}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-400">#{ticket.id}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900">{ticket.title}</h3>
                                                <p className="text-sm text-gray-500 font-medium">{ticket.description}</p>
                                            </div>

                                            <div className="flex items-center gap-6 mt-4 md:mt-0">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Update</p>
                                                    <p className="text-xs font-bold text-gray-700 flex items-center gap-1"><Clock size={12} /> {ticket.lastUpdate}</p>
                                                </div>
                                                <ChevronRight className="text-gray-300 group-hover:text-pine-600 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 3️⃣ Contact Options */}
                    {activeTab === 'contact' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { title: 'Call Support', subtitle: 'Available 9AM - 9PM', icon: Phone, action: 'Call Now', color: 'bg-emerald-500', href: 'tel:+919906123456' },
                                { title: 'WhatsApp', subtitle: 'Average response: 5 mins', icon: MessageCircle, action: 'Chat', color: 'bg-green-600', href: 'https://wa.me/919906123456' },
                                { title: 'Email Us', subtitle: 'Detailed queries', icon: Mail, action: 'Send Email', color: 'bg-indigo-500', href: 'mailto:support@kashcart.in' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center space-y-6 hover:shadow-xl transition-all">
                                    <div className={clsx("w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white shadow-xl shadow-gray-200", item.color)}>
                                        <item.icon size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">{item.title}</h3>
                                        <p className="text-sm text-gray-500 font-medium">{item.subtitle}</p>
                                    </div>
                                    <a href={item.href} className={clsx("block w-full py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg transition-transform active:scale-95", item.color)}>
                                        {item.action}
                                    </a>
                                </div>
                            ))}

                            <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-gray-900 to-gray-800 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black">Live Agent Support</h3>
                                    <p className="text-gray-400 font-medium max-w-md">Our specialized mart support team is online and ready to assist you with order cancellations, payment disputes and app issues.</p>
                                </div>
                                <button className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl flex items-center gap-2">
                                    <MessageCircle size={18} /> Start Live Chat
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* New Ticket Modal */}
            <AnimatePresence>
                {showNewTicketModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowNewTicketModal(false)}
                            className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-2xl font-black text-gray-900">New Ticket</h3>
                                <button onClick={() => setShowNewTicketModal(false)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                    <X size={24} className="text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateTicket} className="p-8 space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 mb-1.5 block">Issue Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Orders', 'Payments', 'Inventory', 'Other'].map(type => (
                                            <label key={type} className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 has-[:checked]:bg-pine-50 has-[:checked]:border-pine-200 has-[:checked]:text-pine-700 transition-all font-bold text-sm text-gray-600">
                                                <input type="radio" name="type" className="accent-pine-600" /> {type}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Subject</label>
                                    <input type="text" placeholder="Briefly describe the issue..." className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-pine-500/20" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Description</label>
                                    <textarea rows={4} placeholder="Please provide more details..." className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl font-medium text-gray-900 focus:ring-2 focus:ring-pine-500/20 resize-none" />
                                </div>

                                <div className="flex items-center gap-3">
                                    <button type="button" className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors">
                                        <Camera size={20} />
                                    </button>
                                    <span className="text-xs font-bold text-gray-400">Attach screenshot (Optional)</span>
                                </div>

                                <button type="submit" className="w-full py-4 bg-pine-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-pine-700 transition-all shadow-xl shadow-pine-600/20 flex items-center justify-center gap-2">
                                    <Send size={16} /> Submit Ticket
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Support;
