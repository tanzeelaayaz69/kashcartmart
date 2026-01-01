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
