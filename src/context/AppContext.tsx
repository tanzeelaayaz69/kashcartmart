import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, SalesData, Notification } from '../types';

interface AppContextType {
  products: Product[];
  orders: Order[];
  salesData: SalesData[];
  notifications: Notification[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  updateStock: (id: string, newQuantity: number) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string, reason?: string) => void;
  updateOrderStatus: (id: string, status: Order['status'], reason?: string) => void;
  createOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  markAllNotificationsAsRead: () => void;
  stats: {
    todayOrders: number;
    todayRevenue: number;
    stockCount: number;
    pendingOrders: number;
    unreadNotifications: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper for dates
const today = new Date();
const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today); lastWeek.setDate(lastWeek.getDate() - 7);
const twoWeeksAgo = new Date(today); twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

// Mock Data
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Kashmiri Saffron', category: 'Spices', quantity: 45, price: 250, costPrice: 180, unit: '1g', image: 'https://images.unsplash.com/photo-1629196914168-3a964433827c?auto=format&fit=crop&q=80&w=200', lastUpdated: new Date().toISOString(), isAvailable: true },
  { id: '2', name: 'Walnuts', category: 'Dry Fruits', quantity: 12, price: 850, costPrice: 650, unit: '1kg', image: 'https://images.unsplash.com/photo-1574738686233-1c3358c54583?auto=format&fit=crop&q=80&w=200', lastUpdated: new Date().toISOString(), isAvailable: true },
  { id: '3', name: 'Almonds (Mamra)', category: 'Dry Fruits', quantity: 0, price: 1200, costPrice: 950, unit: '500g', image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=200', lastUpdated: new Date().toISOString(), isAvailable: true },
  { id: '4', name: 'Kahwa Mix', category: 'Beverages', quantity: 8, price: 350, costPrice: 240, unit: '250g', image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7c1f?auto=format&fit=crop&q=80&w=200', lastUpdated: new Date().toISOString(), isAvailable: true },
  { id: '5', name: 'Honey (Local)', category: 'Essentials', quantity: 150, price: 500, costPrice: 380, unit: '1L', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=200', lastUpdated: new Date().toISOString(), isAvailable: true },
  { id: '6', name: 'Pure Gir Cow Ghee', category: 'Dairy', quantity: 5, price: 1200, costPrice: 900, unit: '500ml', image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=200', lastUpdated: new Date().toISOString(), isAvailable: true },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8241', customerName: 'Aamir Khan', customerPhone: '+91 9906100000', customerAddress: 'House No. 12, Rajbagh, Srinagar',
    date: today.toISOString(), total: 1200, status: 'New', paymentType: 'COD', isUrgent: true,
    items: [{ productId: '1', productName: 'Kashmiri Saffron', quantity: 2, price: 250 }]
  },
  {
    id: 'ORD-7521', customerName: 'Sara Ali', customerPhone: '+91 7006888222', customerAddress: 'Gulgasht Colony, Budgam',
    date: yesterday.toISOString(), total: 850, status: 'Accepted', paymentType: 'Online',
    items: [{ productId: '2', productName: 'Walnuts', quantity: 1, price: 850 }]
  },
  {
    id: 'ORD-1092', customerName: 'Bilal Ahmed', customerPhone: '+91 6005111333', customerAddress: 'Lal Chowk, Srinagar',
    date: lastWeek.toISOString(), total: 2400, status: 'Delivered', paymentType: 'COD',
    items: [{ productId: '3', productName: 'Almonds', quantity: 2, price: 1200 }]
  },
  {
    id: 'ORD-4432', customerName: 'Zoya Bhat', customerPhone: '+91 9906555444', customerAddress: 'Srinagar North',
    date: twoWeeksAgo.toISOString(), total: 500, status: 'Delivered', paymentType: 'Online',
    items: [{ productId: '5', productName: 'Honey (Local)', quantity: 1, price: 500 }]
  },
  {
    id: 'ORD-5561', customerName: 'Ishfaq Mir', customerPhone: '+91 7006111222', customerAddress: 'Baramulla',
    date: today.toISOString(), total: 1700, status: 'Delivered', paymentType: 'Online',
    items: [{ productId: '2', productName: 'Walnuts', quantity: 2, price: 850 }]
  },
  {
    id: 'ORD-2210', customerName: 'Tariq Lone', customerPhone: '+91 6005999888', customerAddress: 'Pulwama',
    date: yesterday.toISOString(), total: 350, status: 'Rejected', paymentType: 'COD', cancellationReason: 'Out of stock',
    items: [{ productId: '4', productName: 'Kahwa Mix', quantity: 1, price: 350 }]
  },
];

const INITIAL_SALES: SalesData[] = [
  { date: 'Mon', revenue: 4500, orders: 12 },
  { date: 'Tue', revenue: 5200, orders: 15 },
  { date: 'Wed', revenue: 3800, orders: 10 },
  { date: 'Thu', revenue: 6500, orders: 18 },
  { date: 'Fri', revenue: 4900, orders: 14 },
  { date: 'Sat', revenue: 7200, orders: 22 },
  { date: 'Sun', revenue: 6100, orders: 19 },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or fall back to mock data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mart_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mart_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [salesData] = useState<SalesData[]>(INITIAL_SALES);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('mart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mart_orders', JSON.stringify(orders));
  }, [orders]);

  const addNotification = (title: string, desc: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      desc,
      time: 'Just now',
      type,
      isUnread: true,
      timestamp: Date.now()
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 10)); // Keep last 10
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  // Dynamic Simulation Effect
  useEffect(() => {
    // 1. Simulate Incoming Orders every 45-90 seconds
    const orderInterval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to create order
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        if (randomProduct.quantity > 0 && randomProduct.isAvailable) {
          const newOrder: Order = {
            id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
            customerName: ['Rameez Raja', 'Iqra Jan', 'Umar Farooq', 'Sana Mir'][Math.floor(Math.random() * 4)],
            customerPhone: '+91 9906xxxxxx',
            customerAddress: ['Srinagar', 'Budgam', 'Ganderbal'][Math.floor(Math.random() * 3)],
            date: new Date().toISOString(),
            total: randomProduct.price,
            status: 'New',
            paymentType: Math.random() > 0.5 ? 'COD' : 'Online',
            items: [{
              productId: randomProduct.id,
              productName: randomProduct.name,
              quantity: 1,
              price: randomProduct.price
            }]
          };

          setOrders(prev => [newOrder, ...prev]);
          setProducts(prev => prev.map(p => p.id === randomProduct.id ? { ...p, quantity: Math.max(0, p.quantity - 1) } : p));
          addNotification('New Order Received', `Order #${newOrder.id} from ${newOrder.customerName}`, 'order');
        }
      }
    }, 45000);

    // 2. Simulate Random Sales (Stock depletion) every 20 seconds
    const stockInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        const randomIdx = Math.floor(Math.random() * products.length);
        const prod = products[randomIdx];
        if (prod.quantity > 0) {
          setProducts(prev => {
            const newProds = [...prev];
            const newQty = prod.quantity - 1;
            newProds[randomIdx] = { ...newProds[randomIdx], quantity: newQty, lastUpdated: new Date().toISOString() };

            if (newQty < 5 && newQty > 0) {
              addNotification('Low Stock Alert', `${prod.name} is running low (${newQty} left)`, 'alert');
            } else if (newQty === 0) {
              addNotification('Out of Stock', `${prod.name} has sold out!`, 'alert');
            }
            return newProds;
          });
        }
      }
    }, 20000);

    return () => {
      clearInterval(orderInterval);
      clearInterval(stockInterval);
    };
  }, [products]); // Re-bind when products change to keep simulation current

  const addProduct = (product: Product) => {
    setProducts([...products, { ...product, id: product.id || Math.random().toString(36).substr(2, 9), lastUpdated: new Date().toISOString(), isAvailable: true }]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p =>
      p.id === updatedProduct.id ? { ...updatedProduct, lastUpdated: new Date().toISOString() } : p
    ));
  };

  const updateStock = (id: string, newQuantity: number) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, quantity: newQuantity, lastUpdated: new Date().toISOString() } : p
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const toggleProductAvailability = (id: string, reason?: string) => {
    setProducts(products.map(p =>
      p.id === id ? {
        ...p,
        isAvailable: !p.isAvailable,
        statusReason: !p.isAvailable ? undefined : reason,
        lastUpdated: new Date().toISOString()
      } : p
    ));
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString(),
      status: 'New'
    };

    setProducts(prev => prev.map(p => {
      const item = newOrder.items.find(i => i.productId === p.id);
      return item ? { ...p, quantity: Math.max(0, p.quantity - item.quantity), lastUpdated: new Date().toISOString() } : p;
    }));

    setOrders([newOrder, ...orders]);
    addNotification('Order Created', `You manually created Order #${newOrder.id}`, 'success');
  };

  const updateOrderStatus = (id: string, status: Order['status'], reason?: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    const isActuallyCancelled = (status === 'Cancelled' || status === 'Rejected') && (order.status !== 'Cancelled' && order.status !== 'Rejected');
    const wasCancelledBefore = (order.status === 'Cancelled' || order.status === 'Rejected') && (status !== 'Cancelled' && status !== 'Rejected');

    if (isActuallyCancelled) {
      setProducts(prev => prev.map(p => {
        const item = order.items.find(i => i.productId === p.id);
        return item ? { ...p, quantity: p.quantity + item.quantity, lastUpdated: new Date().toISOString() } : p;
      }));
    } else if (wasCancelledBefore) {
      setProducts(prev => prev.map(p => {
        const item = order.items.find(i => i.productId === p.id);
        return item ? { ...p, quantity: Math.max(0, p.quantity - item.quantity), lastUpdated: new Date().toISOString() } : p;
      }));
    }

    setOrders(orders.map(o => o.id === id ? { ...o, status, cancellationReason: reason || o.cancellationReason } : o));
  };

  const stats = {
    todayOrders: orders.filter(o => new Date(o.date).toDateString() === new Date().toDateString()).length,
    todayRevenue: orders
      .filter(o => new Date(o.date).toDateString() === new Date().toDateString() && o.status !== 'Rejected' && o.status !== 'Cancelled')
      .reduce((acc, curr) => acc + curr.total, 0),
    stockCount: products.reduce((acc, curr) => acc + curr.quantity, 0),
    pendingOrders: orders.filter(o => o.status === 'New' || o.status === 'Accepted').length,
    unreadNotifications: notifications.filter(n => n.isUnread).length
  };

  return (
    <AppContext.Provider value={{ products, orders, salesData, notifications, addProduct, updateProduct, updateStock, deleteProduct, toggleProductAvailability, updateOrderStatus, createOrder, markAllNotificationsAsRead, stats }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
