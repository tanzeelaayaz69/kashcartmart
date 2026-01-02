import { Product, InventoryLog, InventoryActionType, StockStatus } from '../types';

/**
 * Calculate stock status based on quantity and threshold
 */
export const calculateStockStatus = (quantity: number, lowStockThreshold: number): StockStatus => {
    if (quantity === 0) return 'out_of_stock';
    if (quantity <= lowStockThreshold) return 'low_stock';
    return 'in_stock';
};

/**
 * Create an inventory log entry
 */
export const createInventoryLog = (
    product: Product,
    actionType: InventoryActionType,
    quantityChanged: number,
    previousQuantity: number,
    newQuantity: number,
    orderId?: string,
    reason?: string,
    performedBy?: string
): InventoryLog => {
    return {
        id: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId: product.id,
        productName: product.name,
        orderId,
        actionType,
        quantityChanged,
        previousQuantity,
        newQuantity,
        timestamp: new Date().toISOString(),
        reason,
        performedBy,
    };
};

/**
 * Update product with new quantity and recalculate stock status
 */
export const updateProductQuantity = (
    product: Product,
    newQuantity: number
): Product => {
    const stockStatus = calculateStockStatus(newQuantity, product.lowStockThreshold);
    const isAvailable = stockStatus !== 'out_of_stock';

    return {
        ...product,
        quantity: newQuantity,
        stockStatus,
        isAvailable,
        lastUpdated: new Date().toISOString(),
    };
};

/**
 * Validate if order can be fulfilled with current stock
 */
export const validateStock = (
    products: Product[],
    orderItems: { productId: string; quantity: number }[]
): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    for (const item of orderItems) {
        const product = products.find(p => p.id === item.productId);

        if (!product) {
            errors.push(`Product not found: ${item.productId}`);
            continue;
        }

        const availableQuantity = product.quantity - product.reservedQuantity;

        if (availableQuantity < item.quantity) {
            errors.push(
                `Insufficient stock for ${product.name}. Available: ${availableQuantity}, Requested: ${item.quantity}`
            );
        }

        if (product.stockStatus === 'out_of_stock') {
            errors.push(`${product.name} is currently out of stock`);
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

/**
 * Reserve stock for pending orders (prevents overselling)
 */
export const reserveStock = (
    products: Product[],
    orderItems: { productId: string; quantity: number }[]
): Product[] => {
    return products.map(product => {
        const orderItem = orderItems.find(item => item.productId === product.id);
        if (orderItem) {
            return {
                ...product,
                reservedQuantity: product.reservedQuantity + orderItem.quantity,
                lastUpdated: new Date().toISOString(),
            };
        }
        return product;
    });
};

/**
 * Release reserved stock (on order cancellation or completion)
 */
export const releaseReservedStock = (
    products: Product[],
    orderItems: { productId: string; quantity: number }[]
): Product[] => {
    return products.map(product => {
        const orderItem = orderItems.find(item => item.productId === product.id);
        if (orderItem) {
            return {
                ...product,
                reservedQuantity: Math.max(0, product.reservedQuantity - orderItem.quantity),
                lastUpdated: new Date().toISOString(),
            };
        }
        return product;
    });
};

/**
 * Reduce stock after order confirmation
 */
export const reduceStock = (
    products: Product[],
    orderItems: { productId: string; quantity: number }[]
): Product[] => {
    return products.map(product => {
        const orderItem = orderItems.find(item => item.productId === product.id);
        if (orderItem) {
            const newQuantity = Math.max(0, product.quantity - orderItem.quantity);
            return updateProductQuantity(product, newQuantity);
        }
        return product;
    });
};

/**
 * Restore stock after order cancellation/failure
 */
export const restoreStock = (
    products: Product[],
    orderItems: { productId: string; quantity: number }[]
): Product[] => {
    return products.map(product => {
        const orderItem = orderItems.find(item => item.productId === product.id);
        if (orderItem) {
            const newQuantity = product.quantity + orderItem.quantity;
            return updateProductQuantity(product, newQuantity);
        }
        return product;
    });
};

/**
 * Get stock status message for notifications
 */
export const getStockStatusMessage = (product: Product): string | null => {
    if (product.stockStatus === 'out_of_stock') {
        return `${product.name} is now OUT OF STOCK`;
    }
    if (product.stockStatus === 'low_stock') {
        return `${product.name} is running LOW (${product.quantity} units remaining)`;
    }
    return null;
};
