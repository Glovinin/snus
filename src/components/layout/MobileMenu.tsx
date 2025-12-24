"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll"; // If needed, but mostly using Next Link
import Link from "next/link";
import { X, ChevronRight, User, LogOut, ShoppingBag, Package, HelpCircle, Star, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getActiveBrands, Brand } from "@/lib/firebase/brands";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    userData: any;
    signOut: () => Promise<void>;
    onOpenLogin: () => void;
    onOpenAccount: () => void;
    onOpenOrders: () => void;
}

const MENU_ITEMS = {
    flavors: ['Mint', 'Berry', 'Citrus', 'Coffee', 'Tropical'],
    strengths: [
        { label: 'WEAK', range: '0-8 MG' },
        { label: 'MEDIUM', range: '9-16 MG' },
        { label: 'STRONG', range: '17-32 MG' },
        { label: 'EXTRA', range: '32-60 MG' }
    ],
    support: [
        { name: "Contact Us", href: "/contact" },
        { name: "FAQs", href: "/faq" },
        { name: "Shipping Information", href: "/shipping" },
        { name: "Track My Order", href: "/track-order" }
    ]
};

export function MobileMenu({ isOpen, onClose, user, userData, signOut, onOpenLogin, onOpenAccount, onOpenOrders }: MobileMenuProps) {
    const router = useRouter();
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [brands, setBrands] = useState<Brand[]>([]);

    // Fetch brands from Firebase
    useEffect(() => {
        const fetchBrands = async () => {
            const data = await getActiveBrands();
            setBrands(data);
        };
        fetchBrands();
    }, []);

    const toggleExpand = (item: string) => {
        setExpandedItem(expandedItem === item ? null : item);
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
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
                        onClick={onClose}
                    />

                    {/* Menu Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#0F0F0F] border-l border-white/10 z-[90] flex flex-col overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <span className="text-xl font-bold tracking-tight text-white">Menu</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full hover:bg-white/10 text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                            {/* User Section (Mobile First UX) */}
                            <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/5">
                                {user ? (
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                                <User className="w-6 h-6 text-white/70" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">
                                                    {userData?.displayName || user.email?.split('@')[0]}
                                                </p>
                                                <p className="text-xs text-white/50">
                                                    {userData?.role === "seller" ? "Seller Account" : "Member"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                variant="secondary"
                                                className="w-full justify-start text-xs h-9 bg-white/10 hover:bg-white/20 text-white border-none"
                                                onClick={() => {
                                                    onClose();
                                                    onOpenAccount();
                                                }}
                                            >
                                                <User className="w-3 h-3 mr-2 opacity-70" />
                                                Profile
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                className="w-full justify-start text-xs h-9 bg-white/10 hover:bg-white/20 text-white border-none"
                                                onClick={() => {
                                                    onClose();
                                                    onOpenOrders();
                                                }}
                                            >
                                                <Package className="w-3 h-3 mr-2 opacity-70" />
                                                Orders
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-xs h-8 mt-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 p-0 px-2"
                                            onClick={() => {
                                                signOut();
                                                onClose();
                                            }}
                                        >
                                            <LogOut className="w-3 h-3 mr-2" />
                                            Sign Out
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl p-4 text-center">
                                        <h3 className="text-lg font-bold text-white mb-1">Welcome Club</h3>
                                        <p className="text-xs text-white/60 mb-4">Join for exclusive rewards & faster checkout.</p>
                                        <Button
                                            className="w-full rounded-full bg-white text-black hover:bg-white/90"
                                            onClick={() => {
                                                onClose();
                                                onOpenLogin();
                                            }}
                                        >
                                            Sign In / Register
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Links */}
                            <nav className="space-y-1">
                                <Link
                                    href="/shop"
                                    className="flex items-center justify-between p-4 rounded-xl text-lg font-medium text-white hover:bg-white/5 transition-colors"
                                    onClick={onClose}
                                >
                                    Shop All
                                    <ChevronRight className="w-5 h-5 opacity-30" />
                                </Link>

                                {/* Categories Accordion */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => toggleExpand('categories')}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl text-lg font-medium transition-colors ${expandedItem === 'categories' ? 'bg-white/5 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        Categories
                                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedItem === 'categories' ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {expandedItem === 'categories' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 pb-4 space-y-6">
                                                    {/* Flavors */}
                                                    <div>
                                                        <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3 mt-2">By Flavor</h4>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {MENU_ITEMS.flavors.map(flavor => (
                                                                <Link
                                                                    key={flavor}
                                                                    href={`/shop?flavor=${flavor.toLowerCase()}`}
                                                                    onClick={onClose}
                                                                    className="text-sm p-2 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                                                                >
                                                                    {flavor}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                        {/* View All Flavors Button */}
                                                        <Link
                                                            href="/shop?view=flavors"
                                                            onClick={onClose}
                                                            className="group flex items-center justify-between w-full mt-4 px-4 py-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/20"
                                                        >
                                                            <span className="text-sm font-semibold text-green-400">
                                                                View All Flavors
                                                            </span>
                                                            <svg
                                                                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-green-400"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                    {/* Strengths */}
                                                    <div>
                                                        <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">By Strength</h4>
                                                        <div className="space-y-2">
                                                            {MENU_ITEMS.strengths.map(strength => (
                                                                <Link
                                                                    key={strength.label}
                                                                    href={`/shop?strength=${strength.label.split(' ')[0].toLowerCase()}`}
                                                                    onClick={onClose}
                                                                    className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors group"
                                                                >
                                                                    <span>{strength.label}</span>
                                                                    <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/40 group-hover:text-white/60">{strength.range}</span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Brands Accordion */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => toggleExpand('brands')}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl text-lg font-medium transition-colors ${expandedItem === 'brands' ? 'bg-white/5 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        Brands
                                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedItem === 'brands' ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {expandedItem === 'brands' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 pb-4">
                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        {brands.map(brand => (
                                                            <Link
                                                                key={brand.id}
                                                                href={`/shop?brand=${encodeURIComponent(brand.name.toLowerCase())}`}
                                                                onClick={onClose}
                                                                className="text-sm p-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors text-center border border-white/5"
                                                            >
                                                                {brand.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Help Accordion */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => toggleExpand('help')}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl text-lg font-medium transition-colors ${expandedItem === 'help' ? 'bg-white/5 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        Help & Support
                                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedItem === 'help' ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {expandedItem === 'help' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 pb-4 space-y-1 mt-1">
                                                    {MENU_ITEMS.support.map(item => (
                                                        <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            onClick={onClose}
                                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors"
                                                        >
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                            <span className="text-sm">{item.name}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </nav>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/5 bg-black/20">
                            <div className="flex items-center justify-center gap-6">
                                <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">Instagram</a>
                                <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">TikTok</a>
                                <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">Twitter</a>
                            </div>
                            <p className="text-[10px] text-center text-white/20 mt-4">
                                © 2025 SnusIdea. All rights reserved.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
