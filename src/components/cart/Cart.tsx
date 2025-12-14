"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CartItem {
    id: string;
    name: string;
    variant: string;
    price: number;
    quantity: number;
    image: string;
    bgClass: string;
}

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

// Mock cart items
const mockCartItems: CartItem[] = [
    {
        id: "1",
        name: "Ice Cool",
        variant: "Arctic Freshness • 12mg",
        price: 9.99,
        quantity: 2,
        image: "/placeholder.jpg",
        bgClass: "bg-blue-500/10"
    },
    {
        id: "2",
        name: "Citrus Burst",
        variant: "Zesty Energy • 8mg",
        price: 9.99,
        quantity: 1,
        image: "/placeholder.jpg",
        bgClass: "bg-yellow-500/10"
    }
];

export function Cart({ isOpen, onClose }: CartProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingThreshold = 50;
    const remainingForFreeShipping = Math.max(0, shippingThreshold - subtotal);
    const progress = Math.min(100, (subtotal / shippingThreshold) * 100);

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

                    {/* Floating Cart Panel */}
                    <motion.div
                        initial={isMobile ? { y: "100%" } : { x: "100%", opacity: 0.5 }}
                        animate={isMobile ? { y: 0 } : { x: 0, opacity: 1 }}
                        exit={isMobile ? { y: "100%" } : { x: "110%", opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                        className={`fixed z-[70] flex flex-col bg-background/90 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden
                            ${isMobile
                                ? "bottom-0 left-0 right-0 h-[90vh] rounded-t-[32px]"
                                : "top-4 right-4 bottom-4 w-[480px] rounded-[32px]"
                            }`}
                    >
                        {/* Noise Texture */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-difference" />

                        {/* Header */}
                        <div className="relative z-10 p-8 pb-4">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-3xl font-bold tracking-tighter">Your Bag</h2>
                                    <span className="flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full bg-foreground text-background">
                                        {mockCartItems.reduce((sum, item) => sum + item.quantity, 0)}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="rounded-full hover:bg-foreground/5 w-10 h-10 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Free Shipping Progress */}
                            <div className="bg-foreground/5 rounded-2xl p-4 mb-2">
                                <div className="flex items-center gap-3 mb-3 text-sm font-medium">
                                    <div className="p-1.5 bg-foreground/10 rounded-full">
                                        <Truck className="w-4 h-4" />
                                    </div>
                                    {remainingForFreeShipping > 0 ? (
                                        <span>
                                            Add <span className="font-bold">${remainingForFreeShipping.toFixed(2)}</span> for free shipping
                                        </span>
                                    ) : (
                                        <span className="text-green-600 dark:text-green-400">You've unlocked free shipping!</span>
                                    )}
                                </div>
                                <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-foreground rounded-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="relative z-10 flex-1 overflow-y-auto px-8 py-2 space-y-4 scrollbar-hide">
                            {mockCartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                                    <ShoppingBag className="w-16 h-16 mb-4 stroke-[1.5]" />
                                    <p className="text-xl font-medium mb-2">Your bag is empty</p>
                                    <p className="text-sm">Time to start your collection.</p>
                                </div>
                            ) : (
                                mockCartItems.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative flex gap-5 p-4 rounded-3xl bg-foreground/[0.02] hover:bg-foreground/[0.04] border border-foreground/5 transition-colors"
                                    >
                                        {/* Product Image */}
                                        <div className={`w-24 h-28 rounded-2xl ${item.bgClass} flex items-center justify-center overflow-hidden shrink-0`}>
                                            <div className="w-full h-full opacity-60 mix-blend-multiply dark:mix-blend-overlay" />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 flex flex-col py-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                                                <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium mb-4">{item.variant}</p>

                                            <div className="mt-auto flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-1 bg-background rounded-full border border-foreground/10 p-1 shadow-sm">
                                                    <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors">
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="text-sm font-semibold w-6 text-center tabular-nums">
                                                        {item.quantity}
                                                    </span>
                                                    <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors">
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <button className="text-muted-foreground/50 hover:text-red-500 transition-colors p-2">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="relative z-10 p-8 pt-4 bg-gradient-to-t from-background via-background to-transparent space-y-6">
                            <div className="space-y-3 pt-4 border-t border-foreground/5">
                                <div className="flex justify-between text-base">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium tabular-nums">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                        {remainingForFreeShipping > 0 ? 'Calculated at checkout' : 'Free'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <span className="text-sm text-muted-foreground font-medium">Total</span>
                                <span className="text-3xl font-bold tracking-tighter tabular-nums">${subtotal.toFixed(2)}</span>
                            </div>

                            <Button
                                className="w-full h-16 rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold text-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between px-8 group"
                            >
                                <span>Checkout</span>
                                <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
