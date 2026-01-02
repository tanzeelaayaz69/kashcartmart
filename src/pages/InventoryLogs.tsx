import { History, Package, TrendingDown, TrendingUp, AlertCircle, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InventoryActionType } from '../types';

const InventoryLogsPage = () => {
    const { inventoryLogs, products } = useApp();

    const getActionIcon = (actionType: InventoryActionType) => {
        switch (actionType) {
            case 'order_placed':
                return <TrendingDown className="text-red-500" size={16} />;
            case 'order_cancelled':
            case 'order_returned':
            case 'payment_failed':
                return <TrendingUp className="text-emerald-500" size={16} />;
            case 'manual_adjustment':
                return <Package className="text-blue-500" size={16} />;
            case 'admin_override':
                return <User className="text-purple-500" size={16} />;
            default:
                return <AlertCircle className="text-gray-500" size={16} />;
        }
    };

    const getActionLabel = (actionType: InventoryActionType) => {
        const labels: Record<InventoryActionType, string> = {
            order_placed: 'Order Placed',
            order_cancelled: 'Order Cancelled',
            order_returned: 'Order Returned',
            manual_adjustment: 'Manual Adjustment',
            admin_override: 'Admin Override',
            payment_failed: 'Payment Failed',
        };
        return labels[actionType];
    };

    const getActionColor = (actionType: InventoryActionType) => {
        switch (actionType) {
            case 'order_placed':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'order_cancelled':
            case 'order_returned':
            case 'payment_failed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'manual_adjustment':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'admin_override':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const lowStockCount = products.filter(p => p.stockStatus === 'low_stock').length;
    const outOfStockCount = products.filter(p => p.stockStatus === 'out_of_stock').length;

    return (
        <div className="p-1 sm:p-4 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Inventory Logs</h1>
                    <p className="text-gray-500 font-medium">Complete audit trail of all inventory changes</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <History className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Logs</p>
                            <p className="text-2xl font-black text-gray-900">{inventoryLogs.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                            <AlertCircle className="text-amber-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Low Stock Items</p>
                            <p className="text-2xl font-black text-gray-900">{lowStockCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                            <Package className="text-red-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Out of Stock</p>
                            <p className="text-2xl font-black text-gray-900">{outOfStockCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventory Logs Table */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <History size={20} className="text-blue-500" />
                    Inventory Change History
                </h2>

                <div className="overflow-x-auto">
                    {inventoryLogs.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs font-black uppercase tracking-widest text-gray-400">
                                    <th className="pb-4 font-bold">Timestamp</th>
                                    <th className="pb-4 font-bold">Product</th>
                                    <th className="pb-4 font-bold">Action</th>
                                    <th className="pb-4 font-bold text-center">Quantity Change</th>
                                    <th className="pb-4 font-bold text-center">Previous</th>
                                    <th className="pb-4 font-bold text-center">New</th>
                                    <th className="pb-4 font-bold">Order ID</th>
                                    <th className="pb-4 font-bold">Reason</th>
                                    <th className="pb-4 font-bold">Performed By</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-50">
                                {inventoryLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 text-xs text-gray-500">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="py-4">
                                            <p className="font-bold text-gray-900">{log.productName}</p>
                                            <p className="text-xs text-gray-400">ID: {log.productId}</p>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border flex items-center gap-2 w-fit ${getActionColor(log.actionType)}`}>
                                                {getActionIcon(log.actionType)}
                                                {getActionLabel(log.actionType)}
                                            </span>
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className={`font-black text-lg ${log.quantityChanged > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {log.quantityChanged > 0 ? '+' : ''}{log.quantityChanged}
                                            </span>
                                        </td>
                                        <td className="py-4 text-center font-bold text-gray-600">
                                            {log.previousQuantity}
                                        </td>
                                        <td className="py-4 text-center font-bold text-gray-900">
                                            {log.newQuantity}
                                        </td>
                                        <td className="py-4">
                                            {log.orderId ? (
                                                <span className="text-xs font-bold text-blue-600">#{log.orderId}</span>
                                            ) : (
                                                <span className="text-xs text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 text-sm text-gray-600 max-w-xs truncate">
                                            {log.reason || '-'}
                                        </td>
                                        <td className="py-4 text-sm text-gray-600">
                                            {log.performedBy || 'System'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl">
                            <History className="mx-auto text-gray-200 mb-3" size={48} />
                            <p className="text-gray-400 font-medium">No inventory changes recorded yet</p>
                            <p className="text-xs text-gray-300 mt-1">Logs will appear here as inventory is updated</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryLogsPage;
