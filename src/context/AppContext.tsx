import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, SalesData, Notification, StoreInfo, StoreStatusLog, StoreSchedule, ChangeType, InventoryLog, InventoryActionType, StockStatus } from '../types';
import * as InventoryManager from '../utils/inventoryManager';

interface AppContextType {
  products: Product[];
  orders: Order[];
  salesData: SalesData[];
  notifications: Notification[];
  storeInfo: StoreInfo;
  inventoryLogs: InventoryLog[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  updateStock: (id: string, newQuantity: number, reason?: string, performedBy?: string) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string, reason?: string) => void;
  updateOrderStatus: (id: string, status: Order['status'], reason?: string) => void;
  createOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  validateOrderStock: (items: { productId: string; quantity: number }[]) => { valid: boolean; errors: string[] };
  handlePaymentFailure: (orderId: string) => void;
  markAllNotificationsAsRead: () => void;
  toggleStoreStatus: (reason?: string, reasonType?: string) => void;
  updateStoreSchedule: (schedule: StoreSchedule) => void;
  forceStoreStatus: (isOpen: boolean, reason?: string, adminName?: string) => void;
  stats: {
    todayOrders: number;
    todayRevenue: number;
    stockCount: number;
    pendingOrders: number;
    unreadNotifications: number;
    lowStockProducts: number;
    outOfStockProducts: number;
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
  { id: '1', name: 'Kashmiri Saffron', category: 'Spices', quantity: 45, price: 250, costPrice: 180, unit: '1g', image: 'https://images.unsplash.com/photo-1629196914168-3a964433827c?auto=format&fit=crop&q=80&w=200', lastUpdated: new Date().toISOString(), isAvailable: true, stockStatus: 'in_stock', lowStockThreshold: 10, reservedQuantity: 0 },
  { id: '2', name: 'Walnuts', category: 'Dry Fruits', quantity: 12, price: 850, costPrice: 650, unit: '1kg', image: 'https://images.unsplash.com/photo-1574738686233-1c3358c54583?auto=format&fit=crop&q=80&w=200', lastUpdated: new Date().toISOString(), isAvailable: true, stockStatus: 'in_stock', lowStockThreshold: 5, reservedQuantity: 0 },
  { id: '3', name: 'Almonds (Mamra)', category: 'Dry Fruits', quantity: 0, price: 1200, costPrice: 950, unit: '500g', image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=200', lastUpdated: new Date().toISOString(), isAvailable: true, stockStatus: 'out_of_stock', lowStockThreshold: 5, reservedQuantity: 0 },
  { id: '4', name: 'Kahwa Mix', category: 'Beverages', quantity: 8, price: 350, costPrice: 240, unit: '250g', image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7c1f?auto=format&fit=crop&q=80&w=200', lastUpdated: new Date().toISOString(), isAvailable: true, stockStatus: 'low_stock', lowStockThreshold: 10, reservedQuantity: 0 },
  { id: '5', name: 'Honey (Local)', category: 'Essentials', quantity: 150, price: 500, costPrice: 380, unit: '1L', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=200', lastUpdated: new Date().toISOString(), isAvailable: true, stockStatus: 'in_stock', lowStockThreshold: 20, reservedQuantity: 0 },
  { id: '6', name: 'Pure Gir Cow Ghee', category: 'Dairy', quantity: 5, price: 1200, costPrice: 900, unit: '500ml', image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=200', lastUpdated: new Date().toISOString(), isAvailable: true, stockStatus: 'low_stock', lowStockThreshold: 10, reservedQuantity: 0 },
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

const INITIAL_STORE_INFO: StoreInfo = {
  isOpen: true,
  lastStatusChange: new Date().toISOString(),
  schedule: {
    enabled: false,
    openTime: '09:00',
    closeTime: '21:00',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // All days
  },
  statusLogs: [],
};

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

  const [storeInfo, setStoreInfo] = useState<StoreInfo>(() => {
    const saved = localStorage.getItem('mart_store_info');
    return saved ? JSON.parse(saved) : INITIAL_STORE_INFO;
  });

  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => {
    const saved = localStorage.getItem('mart_inventory_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('mart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mart_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mart_store_info', JSON.stringify(storeInfo));
  }, [storeInfo]);

  useEffect(() => {
    localStorage.setItem('mart_inventory_logs', JSON.stringify(inventoryLogs));
  }, [inventoryLogs]);

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

  const updateStock = (id: string, newQuantity: number, reason?: string, performedBy?: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const previousQuantity = product.quantity;
    const quantityChanged = newQuantity - previousQuantity;

    // Update product with new quantity and recalculated stock status
    const updatedProduct = InventoryManager.updateProductQuantity(product, newQuantity);

    // Create inventory log
    const log = InventoryManager.createInventoryLog(
      product,
      performedBy ? 'admin_override' : 'manual_adjustment',
      quantityChanged,
      previousQuantity,
      newQuantity,
      undefined,
      reason,
      performedBy
    );

    setProducts(products.map(p => p.id === id ? updatedProduct : p));
    setInventoryLogs(prev => [log, ...prev].slice(0, 500)); // Keep last 500 logs

    // Send notification for stock status changes
    const statusMessage = InventoryManager.getStockStatusMessage(updatedProduct);
    if (statusMessage) {
      addNotification('Stock Alert', statusMessage, 'alert');
    }
  };

  // Validate if order can be fulfilled
  const validateOrderStock = (items: { productId: string; quantity: number }[]) => {
    return InventoryManager.validateStock(products, items);
  };

  // Handle payment failure - restore inventory
  const handlePaymentFailure = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Restore stock
    const restoredProducts = InventoryManager.restoreStock(products, order.items);

    // Release reserved stock
    const finalProducts = InventoryManager.releaseReservedStock(restoredProducts, order.items);

    // Create inventory logs for each item
    const logs: InventoryLog[] = order.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;

      return InventoryManager.createInventoryLog(
        product,
        'payment_failed',
        item.quantity,
        product.quantity,
        product.quantity + item.quantity,
        orderId,
        'Payment failed - stock restored'
      );
    }).filter(Boolean) as InventoryLog[];

    setProducts(finalProducts);
    setInventoryLogs(prev => [...logs, ...prev].slice(0, 500));

    // Update order status
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, paymentStatus: 'failed', status: 'Cancelled', cancellationReason: 'Payment failed' } : o
    ));

    addNotification('Payment Failed', `Order ${orderId} payment failed. Inventory restored.`, 'alert');
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
    // Validate stock availability
    const validation = validateOrderStock(orderData.items);
    if (!validation.valid) {
      addNotification('Order Failed', validation.errors.join('. '), 'alert');
      return;
    }

    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString(),
      status: 'New',
      paymentStatus: orderData.paymentType === 'Online' ? 'pending' : 'success',
    };

    // Reduce stock immediately
    const reducedProducts = InventoryManager.reduceStock(products, newOrder.items);

    // Create inventory logs for each item
    const logs: InventoryLog[] = newOrder.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;

      return InventoryManager.createInventoryLog(
        product,
        'order_placed',
        -item.quantity,
        product.quantity,
        product.quantity - item.quantity,
        newOrder.id,
        `Order placed: ${newOrder.customerName}`
      );
    }).filter(Boolean) as InventoryLog[];

    setProducts(reducedProducts);
    setInventoryLogs(prev => [...logs, ...prev].slice(0, 500));
    setOrders([newOrder, ...orders]);

    // Check for low stock notifications
    reducedProducts.forEach(product => {
      const statusMessage = InventoryManager.getStockStatusMessage(product);
      if (statusMessage) {
        addNotification('Stock Alert', statusMessage, 'alert');
      }
    });

    addNotification('Order Created', `Order #${newOrder.id} placed successfully`, 'success');
  };

  const updateOrderStatus = (id: string, status: Order['status'], reason?: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    const isActuallyCancelled = (status === 'Cancelled' || status === 'Rejected') && (order.status !== 'Cancelled' && order.status !== 'Rejected');
    const wasCancelledBefore = (order.status === 'Cancelled' || order.status === 'Rejected') && (status !== 'Cancelled' && status !== 'Rejected');

    if (isActuallyCancelled) {
      // Restore stock on cancellation
      const restoredProducts = InventoryManager.restoreStock(products, order.items);

      // Create inventory logs
      const logs: InventoryLog[] = order.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return null;

        return InventoryManager.createInventoryLog(
          product,
          'order_cancelled',
          item.quantity,
          product.quantity,
          product.quantity + item.quantity,
          order.id,
          reason || 'Order cancelled'
        );
      }).filter(Boolean) as InventoryLog[];

      setProducts(restoredProducts);
      setInventoryLogs(prev => [...logs, ...prev].slice(0, 500));

      addNotification('Stock Restored', `Inventory restored for cancelled order #${id}`, 'info');
    } else if (wasCancelledBefore) {
      // Re-reduce stock if uncancelling
      const reducedProducts = InventoryManager.reduceStock(products, order.items);

      // Create inventory logs
      const logs: InventoryLog[] = order.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return null;

        return InventoryManager.createInventoryLog(
          product,
          'order_placed',
          -item.quantity,
          product.quantity,
          product.quantity - item.quantity,
          order.id,
          'Order reactivated'
        );
      }).filter(Boolean) as InventoryLog[];

      setProducts(reducedProducts);
      setInventoryLogs(prev => [...logs, ...prev].slice(0, 500));
    }

    setOrders(orders.map(o => o.id === id ? { ...o, status, cancellationReason: reason || o.cancellationReason } : o));
  };


  // Store Management Functions
  const createStatusLog = (status: 'open' | 'closed', changeType: ChangeType, reason?: string, reasonType?: string, changedBy?: string): StoreStatusLog => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      status,
      timestamp: new Date().toISOString(),
      changeType,
      reason,
      reasonType: reasonType as any,
      changedBy,
    };
  };

  const toggleStoreStatus = (reason?: string, reasonType?: string) => {
    const newStatus = !storeInfo.isOpen;
    const log = createStatusLog(newStatus ? 'open' : 'closed', 'manual', reason, reasonType);

    setStoreInfo(prev => ({
      ...prev,
      isOpen: newStatus,
      closeReason: newStatus ? undefined : reason,
      closeReasonType: newStatus ? undefined : (reasonType as any),
      lastStatusChange: new Date().toISOString(),
      statusLogs: [log, ...prev.statusLogs].slice(0, 50), // Keep last 50 logs
    }));

    addNotification(
      newStatus ? 'Store Opened' : 'Store Closed',
      newStatus ? 'Your store is now accepting orders' : `Store closed${reason ? `: ${reason}` : ''}`,
      newStatus ? 'success' : 'info'
    );
  };

  const updateStoreSchedule = (schedule: StoreSchedule) => {
    setStoreInfo(prev => ({
      ...prev,
      schedule,
    }));

    addNotification(
      'Schedule Updated',
      schedule.enabled ? 'Auto open/close schedule has been enabled' : 'Auto open/close schedule has been disabled',
      'success'
    );
  };

  const forceStoreStatus = (isOpen: boolean, reason?: string, adminName?: string) => {
    const log = createStatusLog(isOpen ? 'open' : 'closed', 'manual', reason, undefined, adminName);

    setStoreInfo(prev => ({
      ...prev,
      isOpen,
      closeReason: isOpen ? undefined : reason,
      lastStatusChange: new Date().toISOString(),
      statusLogs: [log, ...prev.statusLogs].slice(0, 50),
    }));

    addNotification(
      `Store ${isOpen ? 'Opened' : 'Closed'} by Admin`,
      adminName ? `${adminName} has ${isOpen ? 'opened' : 'closed'} your store` : `Admin has ${isOpen ? 'opened' : 'closed'} your store`,
      'alert'
    );
  };

  // Auto open/close based on schedule
  useEffect(() => {
    if (!storeInfo.schedule.enabled) return;

    const checkSchedule = () => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // Check if today is a working day
      if (!storeInfo.schedule.daysOfWeek.includes(currentDay)) {
        if (storeInfo.isOpen) {
          const log = createStatusLog('closed', 'automatic', 'Scheduled day off');
          setStoreInfo(prev => ({
            ...prev,
            isOpen: false,
            closeReason: 'Scheduled day off',
            lastStatusChange: new Date().toISOString(),
            statusLogs: [log, ...prev.statusLogs].slice(0, 50),
          }));
        }
        return;
      }

      // Check if it's time to open
      if (currentTime >= storeInfo.schedule.openTime && currentTime < storeInfo.schedule.closeTime) {
        if (!storeInfo.isOpen) {
          const log = createStatusLog('open', 'automatic', 'Scheduled opening');
          setStoreInfo(prev => ({
            ...prev,
            isOpen: true,
            closeReason: undefined,
            lastStatusChange: new Date().toISOString(),
            statusLogs: [log, ...prev.statusLogs].slice(0, 50),
          }));
          addNotification('Store Opened', 'Store automatically opened based on schedule', 'success');
        }
      } else {
        // It's outside working hours
        if (storeInfo.isOpen) {
          const log = createStatusLog('closed', 'automatic', 'Scheduled closing');
          setStoreInfo(prev => ({
            ...prev,
            isOpen: false,
            closeReason: 'Scheduled closing',
            lastStatusChange: new Date().toISOString(),
            statusLogs: [log, ...prev.statusLogs].slice(0, 50),
          }));
          addNotification('Store Closed', 'Store automatically closed based on schedule', 'info');
        }
      }
    };

    // Check immediately
    checkSchedule();

    // Check every minute
    const interval = setInterval(checkSchedule, 60000);

    return () => clearInterval(interval);
  }, [storeInfo.schedule, storeInfo.isOpen]);


  const stats = {
    todayOrders: orders.filter(o => new Date(o.date).toDateString() === new Date().toDateString()).length,
    todayRevenue: orders
      .filter(o => new Date(o.date).toDateString() === new Date().toDateString() && o.status !== 'Rejected' && o.status !== 'Cancelled')
      .reduce((acc, curr) => acc + curr.total, 0),
    stockCount: products.reduce((acc, curr) => acc + curr.quantity, 0),
    pendingOrders: orders.filter(o => o.status === 'New' || o.status === 'Accepted').length,
    unreadNotifications: notifications.filter(n => n.isUnread).length,
    lowStockProducts: products.filter(p => p.stockStatus === 'low_stock').length,
    outOfStockProducts: products.filter(p => p.stockStatus === 'out_of_stock').length,
  };

  return (
    <AppContext.Provider value={{
      products,
      orders,
      salesData,
      notifications,
      storeInfo,
      inventoryLogs,
      addProduct,
      updateProduct,
      updateStock,
      deleteProduct,
      toggleProductAvailability,
      updateOrderStatus,
      createOrder,
      validateOrderStock,
      handlePaymentFailure,
      markAllNotificationsAsRead,
      toggleStoreStatus,
      updateStoreSchedule,
      forceStoreStatus,
      stats
    }}>
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
