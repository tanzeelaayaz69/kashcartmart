import { Power } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

const StoreStatusBanner = () => {
    const { storeInfo } = useApp();

    if (storeInfo.isOpen) {
        return null; // Don't show banner when store is open
    }

    return (
        <Link
            to="/store-settings"
            className="block bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 hover:from-red-600 hover:to-red-700 transition-all"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
                <Power size={16} className="animate-pulse" />
                <p className="text-sm font-bold">
                    🚫 Store is currently closed
                    {storeInfo.closeReason && ` - ${storeInfo.closeReason}`}
                </p>
                <span className="text-xs opacity-75">Click to manage →</span>
            </div>
        </Link>
    );
};

export default StoreStatusBanner;
