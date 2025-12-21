"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Clock, CheckCircle2, AlertCircle, ChevronRight, ShoppingBag, HelpCircle, Truck, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Order, OrderStatus } from "@/types/order";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

interface OrderHistorySheetProps {
    isOpen: boolean;
    onClose: () => void;
}

// Mock Data for demonstration since backend might be empty
const MOCK_ORDERS: Partial<Order>[] = [
    {
        id: "ORD-7782-XJ",
        orderNumber: "#7782",
        status: "shipped",
        total: 45.90,
        currency: "EUR",
        createdAt: { seconds: Date.now() / 1000 - 86400 * 2 } as Timestamp, // 2 days ago
        items: [
            { productId: "1", productName: "VELO Freeze X-Strong", quantity: 5, price: 5.50, imageUrl: "/products/velo-freeze.png" },
            { productId: "2", productName: "LYFT Ice Cool", quantity: 3, price: 5.90, imageUrl: "/products/lyft-ice.png" },
        ],
        trackingNumber: "TRK-99882211"
    },
    {
        id: "ORD-5521-MC",
        orderNumber: "#5521",
        status: "delivered",
        total: 120.50,
        currency: "EUR",
        createdAt: { seconds: Date.now() / 1000 - 86400 * 15 } as Timestamp, // 15 days ago
        items: [
            { productId: "3", productName: "Siberia Red", quantity: 10, price: 12.05, imageUrl: "/products/siberia.png" },
        ]
    }
];

export function OrderHistorySheet({ isOpen, onClose }: OrderHistorySheetProps) {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState<Partial<Order>[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isOpen) {
            // Simulate fetching orders
            setIsLoading(true);
            setTimeout(() => {
                setOrders(MOCK_ORDERS); // Replace with real fetch later
                setIsLoading(false);
            }, 800);
        }
    }, [isOpen]);

    if (!mounted) return null;

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case "processing": return "text-blue-500 bg-blue-500/10";
            case "shipped": return "text-purple-500 bg-purple-500/10";
            case "delivered": return "text-green-500 bg-green-500/10";
            case "cancelled": return "text-red-500 bg-red-500/10";
            default: return "text-gray-500 bg-gray-500/10";
        }
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case "processing": return <Clock className="w-4 h-4" />;
            case "shipped": return <Truck className="w-4 h-4" />;
            case "delivered": return <CheckCircle2 className="w-4 h-4" />;
            case "cancelled": return <AlertCircle className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    const handleTrackOrder = (trackingNumber?: string) => {
        if (!trackingNumber) {
            toast.error("Tracking info not available yet");
            return;
        }
        toast.success("Opening tracking details...");
        // window.open(`https://tracker.example.com/${trackingNumber}`, '_blank');
    };

    const handleSupport = (orderId: string) => {
        toast("Support chat opened for " + orderId);
        // Implement chat or support logic
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        onClick={onClose}
                    />

                    {/* Floating Panel */}
                    <motion.div
                        initial={isMobile ? { y: "100%" } : { x: "100%", opacity: 0.5 }}
                        animate={isMobile ? { y: 0 } : { x: 0, opacity: 1 }}
                        exit={isMobile ? { y: "100%" } : { x: "110%", opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                        className={`fixed z-[70] flex flex-col bg-background/95 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden
                            ${isMobile
                                ? "bottom-0 left-0 right-0 h-[90vh] rounded-t-[32px]"
                                : "top-4 right-4 bottom-4 w-[600px] rounded-[32px]"
                            }`}
                    >
                        {/* Noise Texture */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-difference" />

                        {/* Close Button */}
                        <div className="absolute top-6 right-6 z-20">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full hover:bg-foreground/5 w-10 h-10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Title Header */}
                        <div className="flex-none p-8 md:p-10 pb-4 relative z-10 border-b border-foreground/5">
                            <h2 className="text-3xl font-bold tracking-tighter mb-2 text-foreground flex items-center gap-3">
                                Order History
                                <span className="w-8 h-8 flex items-center justify-center text-lg font-normal text-muted-foreground bg-foreground/5 rounded-full">
                                    {orders.length}
                                </span>
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Track your packages and view past purchases.
                            </p>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 scrollbar-hide">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-48 space-y-4">
                                    <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                                    <p className="text-muted-foreground text-sm">Loading your orders...</p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 rounded-3xl bg-foreground/[0.02] border border-foreground/5 p-8 m-4">
                                    <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mb-2">
                                        <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
                                    </div>
                                    <h3 className="text-xl font-semibold">No orders yet</h3>
                                    <p className="text-muted-foreground max-w-xs">
                                        Looks like you haven't placed any orders yet. Start shopping to fill this page!
                                    </p>
                                    <Button onClick={onClose} className="rounded-full mt-4">
                                        Start Shopping
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="group bg-foreground/[0.02] hover:bg-foreground/[0.04] border border-foreground/5 hover:border-foreground/10 rounded-2xl p-5 transition-all duration-300"
                                        >
                                            {/* Order Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${getStatusColor(order.status!)}`}>
                                                            {getStatusIcon(order.status!)}
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date((order.createdAt as Timestamp).seconds * 1000).toLocaleDateString(undefined, {
                                                            year: 'numeric', month: 'long', day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-lg">€{order.total?.toFixed(2)}</p>
                                                    <p className="text-xs text-muted-foreground">{order.items?.length} items</p>
                                                </div>
                                            </div>

                                            {/* Items Preview */}
                                            <div className="flex items-center gap-3 mb-5 overflow-x-auto pb-2 scrollbar-hide">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="relative w-12 h-12 flex-shrink-0 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                                                        {/* Placeholder for product image if not loading */}
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-zinc-800 text-[10px] text-muted-foreground">
                                                            Product
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.items && order.items.length > 3 && (
                                                    <div className="w-12 h-12 flex-shrink-0 bg-foreground/5 rounded-lg flex items-center justify-center text-xs font-medium text-muted-foreground border border-white/5">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="rounded-xl h-10 text-xs font-medium border-foreground/10 hover:bg-foreground/5"
                                                    onClick={() => handleSupport(order.orderNumber!)}
                                                >
                                                    <HelpCircle className="w-3.5 h-3.5 mr-2" />
                                                    Get Help
                                                </Button>

                                                {order.status === 'shipped' || order.status === 'processing' ? (
                                                    <Button
                                                        className="rounded-xl h-10 text-xs font-medium bg-foreground text-background hover:bg-foreground/90"
                                                        onClick={() => handleTrackOrder(order.trackingNumber)}
                                                    >
                                                        <Truck className="w-3.5 h-3.5 mr-2" />
                                                        Track Order
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        className="rounded-xl h-10 text-xs font-medium border-foreground/10 hover:bg-foreground/5"
                                                    >
                                                        View Details
                                                        <ChevronRight className="w-3.5 h-3.5 ml-2 opacity-50" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Support Teaser */}
                            <div className="mt-8 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold mb-0.5">Need help with a recent order?</h4>
                                    <p className="text-xs text-muted-foreground">Our support team is available 24/7 to assist you.</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 rounded-full">
                                    Contact Us
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
