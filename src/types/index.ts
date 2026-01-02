export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type InventoryActionType = 'order_placed' | 'order_cancelled' | 'order_returned' | 'manual_adjustment' | 'admin_override' | 'payment_failed';

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  costPrice: number;
  unit: string;
  image: string;
  lastUpdated: string;
  isAvailable: boolean;
  statusReason?: string;
  stockStatus: StockStatus;
  lowStockThreshold: number; // Configurable threshold for low stock alerts
  reservedQuantity: number; // Quantity reserved for pending orders
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  orderId?: string;
  actionType: InventoryActionType;
  quantityChanged: number; // Positive for additions, negative for reductions
  previousQuantity: number;
  newQuantity: number;
  timestamp: string;
  reason?: string;
  performedBy?: string; // For admin/manual adjustments
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  total: number;
  status: 'New' | 'Accepted' | 'Packed' | 'Picked' | 'Delivered' | 'Cancelled' | 'Rejected';
  paymentType: 'COD' | 'Online';
  paymentStatus?: 'pending' | 'success' | 'failed';
  items: OrderItem[];
  cancellationReason?: string;
  isUrgent?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'order' | 'alert' | 'success' | 'info';
  isUnread: boolean;
  timestamp: number;
}

export type StoreStatus = 'open' | 'closed';
export type CloseReason = 'out_of_stock' | 'staff_unavailable' | 'closed_for_day' | 'custom';
export type ChangeType = 'manual' | 'automatic';

export interface StoreStatusLog {
  id: string;
  status: StoreStatus;
  timestamp: string;
  changeType: ChangeType;
  reason?: string;
  reasonType?: CloseReason;
  changedBy?: string; // For admin overrides
}

export interface StoreSchedule {
  enabled: boolean;
  openTime: string; // HH:mm format
  closeTime: string; // HH:mm format
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
}

export interface StoreInfo {
  isOpen: boolean;
  closeReason?: string;
  closeReasonType?: CloseReason;
  lastStatusChange: string;
  schedule: StoreSchedule;
  statusLogs: StoreStatusLog[];
}
