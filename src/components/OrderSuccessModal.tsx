import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface OrderSuccessModalProps {
    isOpen: boolean;
    orderId: string;
    onClose: () => void;
}

const OrderSuccessModal = ({ isOpen, orderId, onClose }: OrderSuccessModalProps) => {
    if (!isOpen) return null;

    // Auto-close after 2 seconds
    setTimeout(() => {
        onClose();
    }, 2000);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Success Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                className="relative bg-white rounded-[32px] w-full max-w-sm shadow-2xl overflow-hidden"
            >
                <div className="p-10 text-center space-y-6">
                    {/* Animated Checkmark Circle */}
                    <div className="relative mx-auto w-24 h-24">
                        {/* Outer ring animation */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="absolute inset-0 rounded-full bg-emerald-100"
                        />

                        {/* Middle ring */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="absolute inset-2 rounded-full bg-emerald-200"
                        />

                        {/* Inner circle with icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, duration: 0.5, type: "spring", bounce: 0.5 }}
                            className="absolute inset-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.3, type: "spring", bounce: 0.6 }}
                            >
                                <CheckCircle className="text-white" size={32} strokeWidth={3} />
                            </motion.div>
                        </motion.div>

                        {/* Pulsing glow effect */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: [0.8, 1.2, 0.8],
                                opacity: [0, 0.5, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 rounded-full bg-emerald-400 blur-xl"
                        />
                    </div>

                    {/* Success Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="space-y-2"
                    >
                        <h2 className="text-2xl font-black text-gray-900">
                            Order Accepted!
                        </h2>
                        <p className="text-gray-500 font-medium">
                            Order <span className="font-bold text-pine-600">#{orderId}</span> has been successfully accepted
                        </p>
                    </motion.div>

                    {/* Success indicator */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.3 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border-2 border-emerald-200"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                            Processing Order
                        </span>
                    </motion.div>
                </div>

                {/* Bottom accent */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"
                />
            </motion.div>
        </div>
    );
};

export default OrderSuccessModal;
