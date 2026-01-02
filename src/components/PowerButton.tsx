import { Power } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

const PowerButton = () => {
    const { storeInfo, toggleStoreStatus } = useApp();
    const [showQuickToggle, setShowQuickToggle] = useState(false);
    const [pressTimer, setPressTimer] = useState<number | null>(null);

    const handleMouseDown = () => {
        // Start timer for long press (500ms)
        const timer = setTimeout(() => {
            // Long press detected - could open settings modal
            window.location.hash = '/store-settings';
        }, 500);
        setPressTimer(timer);
    };

    const handleMouseUp = () => {
        // Clear timer
        if (pressTimer) {
            clearTimeout(pressTimer);
            setPressTimer(null);
        }
    };

    const handleClick = () => {
        // Quick toggle
        toggleStoreStatus();
        setShowQuickToggle(true);
        setTimeout(() => setShowQuickToggle(false), 3000);
    };

    return (
        <>
            <button
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                className={`relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${storeInfo.isOpen
                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30'
                    : 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
                    }`}
                title={storeInfo.isOpen ? 'Store Open - Click to close' : 'Store Closed - Click to open'}
            >
                {/* Glow effect */}
                <div
                    className={`absolute inset-0 rounded-xl blur-md transition-opacity duration-300 ${storeInfo.isOpen
                        ? 'bg-emerald-400 opacity-50 group-hover:opacity-70'
                        : 'bg-red-400 opacity-50 group-hover:opacity-70'
                        }`}
                />

                {/* Power icon */}
                <Power
                    className={`relative z-10 text-white transition-transform duration-200 group-hover:scale-110 ${storeInfo.isOpen ? 'animate-pulse' : ''
                        }`}
                    size={24}
                    strokeWidth={2.5}
                />

                {/* Ripple effect on click */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150" />
                </div>
            </button>

            {/* Quick toast notification */}
            {showQuickToggle && (
                <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
                    <div
                        className={`px-6 py-3 rounded-2xl shadow-2xl border-2 flex items-center gap-3 ${storeInfo.isOpen
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-red-50 border-red-200'
                            }`}
                    >
                        <div
                            className={`w-2 h-2 rounded-full ${storeInfo.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                                }`}
                        />
                        <p
                            className={`font-bold text-sm ${storeInfo.isOpen ? 'text-emerald-700' : 'text-red-700'
                                }`}
                        >
                            {storeInfo.isOpen ? '🟢 Store is now Open' : '🔴 Store is now Closed'}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default PowerButton;
