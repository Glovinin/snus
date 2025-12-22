"use client";

import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ChevronRight, Home, Search, Package, Truck, CheckCircle2, Clock, MapPin, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

// Demo tracking data
const DEMO_TRACKING = {
    orderNumber: "SNS-2024-78543",
    status: "In Transit",
    estimatedDelivery: "December 23, 2024",
    carrier: "DHL Express",
    origin: "Lisbon, Portugal",
    destination: "Amsterdam, Netherlands",
    timeline: [
        {
            status: "Order Placed",
            date: "Dec 18, 2024 - 14:32",
            description: "Your order has been confirmed and is being prepared.",
            completed: true
        },
        {
            status: "Processing",
            date: "Dec 18, 2024 - 16:45",
            description: "Order is being packed at our warehouse.",
            completed: true
        },
        {
            status: "Shipped",
            date: "Dec 19, 2024 - 09:12",
            description: "Package picked up by carrier and on its way.",
            completed: true
        },
        {
            status: "In Transit",
            date: "Dec 20, 2024 - 11:30",
            description: "Package in transit through sorting facility.",
            completed: true,
            current: true
        },
        {
            status: "Out for Delivery",
            date: "Pending",
            description: "Package will be delivered to your address.",
            completed: false
        },
        {
            status: "Delivered",
            date: "Pending",
            description: "Package delivered successfully.",
            completed: false
        }
    ]
};

export default function TrackOrderPage() {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [trackingResult, setTrackingResult] = useState<typeof DEMO_TRACKING | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!trackingNumber.trim()) {
            setError("Please enter an order number");
            return;
        }

        setLoading(true);
        setError("");

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // For demo, show tracking result for any input
        setTrackingResult({
            ...DEMO_TRACKING,
            orderNumber: trackingNumber.toUpperCase()
        });
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <main className="flex-1 pt-32 pb-20">
                <div className="container px-4 mx-auto max-w-7xl">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
                        <Link href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                            <Search className="w-4 h-4" />
                            <span>Track My Order</span>
                        </span>
                    </nav>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center mx-auto mb-6">
                            <Truck className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                            Track Your Order
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Enter your order number to track your package in real-time.
                        </p>
                    </motion.div>

                    {/* Search Form */}
                    <motion.form
                        onSubmit={handleTrack}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-12"
                    >
                        <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-6 border border-black/5 dark:border-white/5">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="Enter order number (e.g., SNS-2024-12345)"
                                        className="h-14 pl-12 bg-neutral-100 dark:bg-zinc-800 border-0 rounded-xl text-base"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-14 px-8 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:opacity-90"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Tracking...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Search className="w-4 h-4" />
                                            Track Order
                                        </span>
                                    )}
                                </Button>
                            </div>
                            {error && (
                                <p className="mt-3 text-red-500 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </p>
                            )}
                        </div>
                    </motion.form>

                    {/* Tracking Result */}
                    {trackingResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Order Summary */}
                            <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-6 border border-black/5 dark:border-white/5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                                        <h2 className="text-xl font-bold">{trackingResult.orderNumber}</h2>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-500/10 rounded-full">
                                        <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span className="font-medium text-blue-700 dark:text-blue-400">{trackingResult.status}</span>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div className="p-4 bg-neutral-100 dark:bg-zinc-800 rounded-xl">
                                        <p className="text-sm text-muted-foreground mb-1">Carrier</p>
                                        <p className="font-medium">{trackingResult.carrier}</p>
                                    </div>
                                    <div className="p-4 bg-neutral-100 dark:bg-zinc-800 rounded-xl">
                                        <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                                        <p className="font-medium">{trackingResult.estimatedDelivery}</p>
                                    </div>
                                    <div className="p-4 bg-neutral-100 dark:bg-zinc-800 rounded-xl">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            Destination
                                        </div>
                                        <p className="font-medium">{trackingResult.destination}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-6 border border-black/5 dark:border-white/5">
                                <h3 className="text-lg font-bold mb-6">Shipment Progress</h3>

                                <div className="relative">
                                    {trackingResult.timeline.map((step, index) => (
                                        <div key={step.status} className="flex gap-4 pb-8 last:pb-0">
                                            {/* Line */}
                                            {index < trackingResult.timeline.length - 1 && (
                                                <div className={`absolute left-[15px] top-8 w-0.5 h-[calc(100%-2rem)] ${step.completed ? 'bg-green-500' : 'bg-neutral-200 dark:bg-zinc-700'
                                                    }`} style={{ top: `${index * 72 + 32}px`, height: '40px' }} />
                                            )}

                                            {/* Icon */}
                                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.completed
                                                ? step.current
                                                    ? 'bg-blue-500 text-white animate-pulse'
                                                    : 'bg-green-500 text-white'
                                                : 'bg-neutral-200 dark:bg-zinc-700 text-muted-foreground'
                                                }`}>
                                                {step.completed ? (
                                                    step.current ? <Truck className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />
                                                ) : (
                                                    <Clock className="w-4 h-4" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h4 className={`font-semibold ${step.current ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                                                            {step.status}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{step.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Help Text */}
                    {!trackingResult && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center text-muted-foreground"
                        >
                            <p className="mb-2">You can find your order number in your confirmation email.</p>
                            <p>
                                Need help? <Link href="/contact" className="text-foreground underline hover:no-underline">Contact us</Link>
                            </p>
                        </motion.div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
