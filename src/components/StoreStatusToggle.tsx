import { Power, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface CloseReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string, reasonType: string) => void;
}

const CloseReasonModal = ({ isOpen, onClose, onConfirm }: CloseReasonModalProps) => {
    const [selectedReason, setSelectedReason] = useState('closed_for_day');
    const [customReason, setCustomReason] = useState('');

    const reasons = [
        { value: 'out_of_stock', label: 'Out of Stock', icon: '📦' },
        { value: 'staff_unavailable', label: 'Staff Unavailable', icon: '👥' },
        { value: 'closed_for_day', label: 'Closed for the Day', icon: '🌙' },
        { value: 'custom', label: 'Custom Reason', icon: '✏️' },
    ];

    const handleConfirm = () => {
        const reason = selectedReason === 'custom' ? customReason : reasons.find(r => r.value === selectedReason)?.label || '';
        onConfirm(reason, selectedReason);
        setCustomReason('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                        <AlertCircle className="text-red-600" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900">Close Store</h3>
                        <p className="text-sm text-gray-500">Select a reason for closing</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {reasons.map((reason) => (
                        <label
                            key={reason.value}
                            className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedReason === reason.value
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                                }`}
                        >
                            <input
                                type="radio"
                                name="closeReason"
                                value={reason.value}
                                checked={selectedReason === reason.value}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                className="w-5 h-5 text-red-600"
                            />
                            <span className="text-2xl">{reason.icon}</span>
                            <span className="font-bold text-gray-900">{reason.label}</span>
                        </label>
                    ))}
                </div>

                {selectedReason === 'custom' && (
                    <input
                        type="text"
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Enter custom reason..."
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none font-medium"
                    />
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={selectedReason === 'custom' && !customReason.trim()}
                        className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Close Store
                    </button>
                </div>
            </div>
        </div>
    );
};

const StoreStatusToggle = () => {
    const { storeInfo, toggleStoreStatus } = useApp();
    const [showCloseModal, setShowCloseModal] = useState(false);

    const handleToggle = () => {
        if (storeInfo.isOpen) {
            // Store is open - show modal for close reason
            setShowCloseModal(true);
        } else {
            // Store is closed - just open it
            toggleStoreStatus();
        }
    };

    const handleConfirmClose = (reason: string, reasonType: string) => {
        toggleStoreStatus(reason, reasonType);
    };

    return (
        <>
            {storeInfo.isOpen ? (
                // Store is OPEN - Green theme
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-3xl border-2 border-emerald-200 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg">
                                <Power className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900">Store Status</h3>
                                <p className="text-sm text-gray-600 font-medium">Control your store availability</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                            <div>
                                <p className="font-black text-lg text-emerald-600">Store Open</p>
                                {storeInfo.lastStatusChange && (
                                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                                        <Clock size={10} />
                                        Last changed: {new Date(storeInfo.lastStatusChange).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleToggle}
                            className="relative inline-flex h-12 w-24 items-center rounded-full transition-all duration-300 shadow-inner bg-emerald-500"
                        >
                            <span className="inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform duration-300 translate-x-12" />
                        </button>
                    </div>

                    <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <p className="text-xs font-bold text-emerald-700 text-center">
                            ✅ Customers can browse and place orders
                        </p>
                    </div>
                </div>
            ) : (
                // Store is CLOSED - Red theme
                <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-6 rounded-3xl border-2 border-red-200 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg">
                                <Power className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900">Store Status</h3>
                                <p className="text-sm text-gray-600 font-medium">Control your store availability</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div>
                                <p className="font-black text-lg text-red-600">Store Closed</p>
                                {storeInfo.closeReason && (
                                    <p className="text-xs text-gray-500 font-medium">{storeInfo.closeReason}</p>
                                )}
                                {storeInfo.lastStatusChange && (
                                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                                        <Clock size={10} />
                                        Last changed: {new Date(storeInfo.lastStatusChange).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleToggle}
                            className="relative inline-flex h-12 w-24 items-center rounded-full transition-all duration-300 shadow-inner bg-red-500"
                        >
                            <span className="inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform duration-300 translate-x-1" />
                        </button>
                    </div>

                    <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-xs font-bold text-red-700 text-center">
                            🚫 New orders are disabled. Existing orders will continue processing.
                        </p>
                    </div>
                </div>
            )}

            <CloseReasonModal
                isOpen={showCloseModal}
                onClose={() => setShowCloseModal(false)}
                onConfirm={handleConfirmClose}
            />
        </>
    );
};

export default StoreStatusToggle;
