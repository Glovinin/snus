"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming this exists based on list_dir
import { ChevronRight, ShoppingBag, ArrowLeft, CreditCard, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
    const { items, getSubtotal } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState<'info' | 'shipping' | 'payment'>('info');

    // Form States
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const subtotal = getSubtotal();
    const shipping = subtotal > 50 ? 0 : 5.90;
    const total = subtotal + shipping;

    const navItems = [
        { id: 'cart', label: 'Cart', href: '/' }, // Link back to home/cart
        { id: 'info', label: 'Information' },
        { id: 'shipping', label: 'Shipping' },
        { id: 'payment', label: 'Payment' },
    ];

    const currentStepIndex = navItems.findIndex(i => i.id === step);

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <div className="lg:grid lg:grid-cols-12 h-full min-h-screen">

                {/* LEFT COLUMN - MAIN CONTENT */}
                <div className="lg:col-span-7 px-4 py-8 lg:px-12 lg:py-12 xl:px-20 order-2 lg:order-1 border-r border-gray-100">
                    <div className="max-w-xl mx-auto lg:mx-0 lg:ml-auto w-full">
                        {/* Header/Logo */}
                        <div className="mb-8">
                            <Link href="/" className="inline-block relative w-32 h-10">
                                <Image
                                    src="/snusidealogo.svg"
                                    alt="SnusIdea Logo"
                                    fill
                                    className="object-contain filter brightness-0"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Breadcrumbs */}
                        <nav className="flex items-center text-xs md:text-sm font-medium text-gray-500 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                            {navItems.map((item, index) => (
                                <div key={item.id} className="flex items-center">
                                    <span
                                        className={`${item.id === step ? "text-black" : ""} ${index < currentStepIndex ? "text-black" : ""}`}
                                    >
                                        {item.id === 'cart' ? (
                                            <Link href="/" className="hover:text-black transition-colors">{item.label}</Link>
                                        ) : (
                                            item.label
                                        )}
                                    </span>
                                    {index < navItems.length - 1 && (
                                        <ChevronRight className="w-3 h-3 mx-2 text-gray-400" />
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* STEPS CONTENT */}
                        <AnimatePresence mode="wait">
                            {step === 'info' && (
                                <motion.div
                                    key="info"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-xl font-semibold">Contact</h2>
                                        <div className="text-sm">
                                            Have an account? <Link href="#" className="underline text-black/70 hover:text-black">Log in</Link>
                                        </div>
                                    </div>
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 bg-white border-gray-200 focus:border-black focus:ring-black rounded-lg transition-all"
                                    />

                                    <div className="pt-6">
                                        <h2 className="text-xl font-semibold mb-4">Shipping address</h2>
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input
                                                    placeholder="First name"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="h-12 bg-white border-gray-200 focus:border-black focus:ring-black rounded-lg"
                                                />
                                                <Input
                                                    placeholder="Last name"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className="h-12 bg-white border-gray-200 focus:border-black focus:ring-black rounded-lg"
                                                />
                                            </div>
                                            <Input
                                                placeholder="Address"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="h-12 bg-white border-gray-200 focus:border-black focus:ring-black rounded-lg"
                                            />
                                            <Input
                                                placeholder="Apartment, suite, etc. (optional)"
                                                className="h-12 bg-white border-gray-200 focus:border-black focus:ring-black rounded-lg"
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input
                                                    placeholder="City"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    className="h-12 bg-white border-gray-200 focus:border-black focus:ring-black rounded-lg"
                                                />
                                                <Input
                                                    placeholder="Postal code"
                                                    value={postalCode}
                                                    onChange={(e) => setPostalCode(e.target.value)}
                                                    className="h-12 bg-white border-gray-200 focus:border-black focus:ring-black rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col-reverse md:flex-row items-center justify-between pt-8 gap-4">
                                        <Link href="/" className="flex items-center text-sm text-gray-500 hover:text-black transition-colors">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Return to cart
                                        </Link>
                                        <Button
                                            onClick={() => setStep('shipping')}
                                            className="w-full md:w-auto h-12 px-8 rounded-lg bg-black text-white hover:bg-black/90 font-medium"
                                        >
                                            Continue to shipping
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'shipping' && (
                                <motion.div
                                    key="shipping"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                >
                                    {/* Summary Card */}
                                    <div className="border border-gray-200 rounded-lg p-4 mb-8 text-sm">
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500 w-20">Contact</span>
                                            <span className="flex-1 truncate px-4 font-medium">{email || 'user@example.com'}</span>
                                            <button onClick={() => setStep('info')} className="text-black underline text-xs">Change</button>
                                        </div>
                                        <div className="flex justify-between py-2 pt-3">
                                            <span className="text-gray-500 w-20">Ship to</span>
                                            <span className="flex-1 truncate px-4 font-medium">{address}, {city}</span>
                                            <button onClick={() => setStep('info')} className="text-black underline text-xs">Change</button>
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-semibold mb-4">Shipping method</h2>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
                                        <div className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer bg-gray-50">
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 rounded-full border-[5px] border-black bg-white mr-4" />
                                                <span className="text-sm font-medium">Standard Shipping</span>
                                            </div>
                                            <span className="text-sm font-semibold">{shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 opacity-50 cursor-not-allowed">
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 rounded-full border border-gray-300 mr-4" />
                                                <span className="text-sm font-medium">Express (Next Day)</span>
                                            </div>
                                            <span className="text-sm font-semibold">€15.00</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col-reverse md:flex-row items-center justify-between pt-4 gap-4">
                                        <button onClick={() => setStep('info')} className="flex items-center text-sm text-gray-500 hover:text-black transition-colors">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Return to information
                                        </button>
                                        <Button
                                            onClick={() => setStep('payment')}
                                            className="w-full md:w-auto h-12 px-8 rounded-lg bg-black text-white hover:bg-black/90 font-medium"
                                        >
                                            Continue to payment
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'payment' && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                >
                                    {/* Summary Card */}
                                    <div className="border border-gray-200 rounded-lg p-4 mb-8 text-sm">
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500 w-20">Contact</span>
                                            <span className="flex-1 truncate px-4 font-medium">{email}</span>
                                            <button onClick={() => setStep('info')} className="text-black underline text-xs">Change</button>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500 w-20">Ship to</span>
                                            <span className="flex-1 truncate px-4 font-medium">{address}, {city}</span>
                                            <button onClick={() => setStep('info')} className="text-black underline text-xs">Change</button>
                                        </div>
                                        <div className="flex justify-between py-2 pt-3">
                                            <span className="text-gray-500 w-20">Method</span>
                                            <span className="flex-1 truncate px-4 font-medium">Standard - {shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}</span>
                                            <button onClick={() => setStep('shipping')} className="text-black underline text-xs">Change</button>
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-semibold mb-2">Payment</h2>
                                    <p className="text-sm text-gray-500 mb-4">All transactions are secure and encrypted.</p>

                                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
                                        {/* Credit Card Header */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 rounded-full border-[5px] border-black bg-white mr-4" />
                                                <span className="text-sm font-medium">Credit card</span>
                                            </div>
                                            <div className="flex gap-2 opacity-70">
                                                <div className="w-8 h-5 bg-gray-200 rounded" />
                                                <div className="w-8 h-5 bg-gray-200 rounded" />
                                                <div className="w-8 h-5 bg-gray-200 rounded" />
                                            </div>
                                        </div>

                                        {/* Simplified Credit Card Form */}
                                        <div className="p-4 bg-gray-50/50 space-y-3">
                                            <div className="relative">
                                                <Input placeholder="Card number" className="h-11 bg-white border-gray-200 pl-10" />
                                                <CreditCard className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input placeholder="Expiration date (MM / YY)" className="h-11 bg-white border-gray-200" />
                                                <Input placeholder="Security code" className="h-11 bg-white border-gray-200" />
                                            </div>
                                            <Input placeholder="Name on card" className="h-11 bg-white border-gray-200" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col-reverse md:flex-row items-center justify-between pt-4 gap-4">
                                        <button onClick={() => setStep('shipping')} className="flex items-center text-sm text-gray-500 hover:text-black transition-colors">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Return to shipping
                                        </button>
                                        <Button
                                            className="w-full md:w-auto h-12 px-8 rounded-lg bg-black text-white hover:bg-black/90 font-bold text-lg shadow-xl"
                                        >
                                            Pay now
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Footer Rights */}
                        <div className="mt-16 pt-6 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
                            <Link href="#" className="hover:text-black transition-colors">Refund policy</Link>
                            <Link href="#" className="hover:text-black transition-colors">Shipping policy</Link>
                            <Link href="#" className="hover:text-black transition-colors">Privacy policy</Link>
                            <Link href="#" className="hover:text-black transition-colors">Terms of service</Link>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - ORDER SUMMARY (Sticky Sidebar) */}
                <div className="hidden lg:block lg:col-span-5 bg-gray-50 order-1 lg:order-2 border-l border-gray-200 h-full min-h-screen">
                    <div className="sticky top-0 p-12 pr-20 max-w-lg">
                        <div className="space-y-4 mb-6">
                            {items.map((item, i) => (
                                <div key={`${item.id}-${item.variant}`} className="flex items-center justify-between gap-4">
                                    <div className="relative">
                                        <div className={`w-16 h-16 rounded-xl border border-gray-200 bg-white flex items-center justify-center overflow-hidden`}>
                                            <div className={`w-12 h-12 rounded-lg opacity-80 ${item.bgClass}`} />
                                            <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full z-10">
                                                {item.quantity}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold">{item.name}</h3>
                                        <p className="text-xs text-gray-500">{item.variant}</p>
                                    </div>
                                    <span className="text-sm font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-6 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">€{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">{shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 mt-6 pt-6 flex justify-between items-center">
                            <span className="text-base font-semibold text-gray-900">Total</span>
                            <div className="text-right">
                                <span className="text-xs text-gray-500 mr-2">EUR</span>
                                <span className="text-2xl font-bold tracking-tight">€{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
