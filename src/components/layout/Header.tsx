"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Menu, X, User, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Cart } from "@/components/cart/Cart";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { LoginSheet } from "@/components/auth/LoginSheet";
import { AccountSheet } from "@/components/auth/AccountSheet";
import { OrderHistorySheet } from "@/components/orders/OrderHistorySheet";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { getActiveBrands, Brand } from "@/lib/firebase/brands";
// Safe wrapper for useAuth to handle cases where AuthProvider might not be available
function useAuthSafe() {
    try {
        return useAuth();
    } catch {
        return { user: null, userData: null, signOut: async () => { }, loading: false };
    }
}

// --- Utility Components ---

function Magnetic({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        if (ref.current) {
            ref.current.style.transform = `translate(${middleX * 0.1}px, ${middleY * 0.1}px)`;
        }
    }

    function handleMouseLeave() {
        if (ref.current) {
            ref.current.style.transform = 'translate(0px, 0px)';
        }
    }

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transition: 'transform 0.2s ease-out' }}
        >
            {children}
        </div>
    );
}

function NavLink({ href, children, isLightTheme }: { href: string; children: string; isLightTheme: boolean }) {
    return (
        <Link href={href} className="relative group block px-5 py-2 overflow-hidden whitespace-nowrap">
            <div className="relative z-10 flex flex-col items-center">
                <motion.span
                    className="block font-medium text-lg transition-transform duration-500 group-hover:-translate-y-[150%]"
                    style={{ color: isLightTheme ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)" }}
                >
                    {children}
                </motion.span>
                <motion.span
                    className="absolute top-0 block font-medium text-lg transition-transform duration-500 translate-y-[150%] group-hover:translate-y-0"
                    style={{ color: isLightTheme ? "#000" : "#fff" }}
                >
                    {children}
                </motion.span>
            </div>
            {/* Hover Glow */}
            <span className="absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        </Link>
    );
}

// --- Mobile Promo Banner ---
function MobilePromoBanner() {
    const messages = [
        "Free Shipping over €99",
        "Rated 4.9/5 on Trustpilot", // Updated for Trust Signals
        "Fast Delivery ⚡️"
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute text-center w-full flex items-center justify-center gap-2"
            >
                {index === 1 && <Star className="w-3 h-3 fill-[#00b67a] text-[#00b67a]" />}
                {messages[index]}
            </motion.div>
        </AnimatePresence>
    );
}

// --- Main Header Component ---

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
    // Removed local isCartOpen state in favor of global store
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLightTheme, setIsLightTheme] = useState(false);
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user, userData, signOut } = useAuthSafe();
    const router = useRouter();

    const getTotalItems = useCartStore(state => state.getTotalItems);
    const isCartOpen = useCartStore(state => state.isCartOpen);
    const openCart = useCartStore(state => state.openCart);
    const closeCart = useCartStore(state => state.closeCart);

    const [mounted, setMounted] = useState(false);
    const [brands, setBrands] = useState<Brand[]>([]);

    // Fetch brands from Firebase
    useEffect(() => {
        const fetchBrands = async () => {
            const data = await getActiveBrands();
            setBrands(data);
        };
        fetchBrands();
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('[data-theme]');
            const navbarY = 60; // Approximate center of the navbar (24px top + 36px half-height)

            let currentTheme = 'light'; // Default to light (black text)

            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                // Check if the navbar center overlaps with this section
                if (rect.top <= navbarY && rect.bottom >= navbarY) {
                    currentTheme = section.getAttribute('data-theme') || 'light';
                }
            });

            setIsLightTheme(currentTheme === 'dark');
        };

        // Initial check
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const islandBaseClasses = "relative pointer-events-auto flex items-center backdrop-blur-[40px] border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-shadow group/island shrink-0";
    const islandBg = isLightTheme ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.65)";

    return (
        <>
            {/* Top Banner */}
            <div className="fixed top-0 left-0 right-0 z-[60] h-9 bg-[#0F0F0F] text-white/90 flex items-center justify-center px-4 md:px-8 text-[10px] md:text-xs font-semibold tracking-[0.15em] uppercase border-b border-white/5">
                {/* Desktop: Grid */}
                <div className="hidden md:grid grid-cols-3 w-full max-w-7xl mx-auto">
                    <div className="text-left flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Free Shipping over €99
                    </div>
                    {/* Center: Fast Delivery */}
                    <div className="text-center text-white/50 flex items-center justify-center gap-2">
                        Fast Delivery <span className="text-white/30">⚡️</span>
                    </div>
                    {/* Right: Trustpilot Integration */}
                    <div className="text-right flex items-center justify-end gap-2">
                        <span className="opacity-70">Excellent</span>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="bg-[#00b67a] p-[1px]">
                                    <Star className="w-2.5 h-2.5 fill-white text-white" />
                                </div>
                            ))}
                        </div>
                        <span>4.9 on Trustpilot</span>
                    </div>
                </div>

                {/* Mobile: Fading Slideshow */}
                <div className="md:hidden w-full relative h-full flex items-center justify-center overflow-hidden">
                    <MobilePromoBanner />
                </div>
            </div>

            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-14 left-0 right-0 z-50 flex justify-center items-start gap-4 px-4 pointer-events-none"
            >
                {/* Desktop Layout: Single Unified Island */}
                <div className="hidden md:flex items-center justify-center">
                    <motion.div
                        initial={false}
                        animate={{
                            backgroundColor: islandBg,
                            filter: isCartOpen ? "blur(2px)" : "blur(0px)"
                        }}
                        transition={{ duration: 0.4 }}
                        className={`${islandBaseClasses} px-6 py-2 h-[72px] gap-6`}
                    >
                        {/* Logo */}
                        <Link href="/" className="flex items-center z-50">
                            <Magnetic>
                                <motion.div
                                    animate={{
                                        filter: `brightness(0) saturate(100%) ${isLightTheme ? 'invert(0)' : 'invert(1)'}`,
                                        opacity: 0.9
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="relative w-32 h-10"
                                >
                                    <Image
                                        src="/snusidealogo.svg"
                                        alt="SnusIdea Logo"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </motion.div>
                            </Magnetic>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="flex items-center gap-1 relative z-10" onMouseLeave={() => setHoveredNav(null)}>
                            {[
                                { name: "Shop", href: "/shop" },
                                { name: "Categories", href: "#", isMega: true },
                                { name: "Brands", href: "#", isMega: true },
                                { name: "Help", href: "#", isMega: true },
                            ].map((item) => (
                                <div
                                    key={item.name}
                                    onMouseEnter={() => setHoveredNav(item.isMega ? item.name : null)}
                                    className="relative flex items-center"
                                >
                                    <NavLink href={item.href} isLightTheme={isLightTheme}>
                                        {item.name}
                                    </NavLink>
                                    {item.isMega && (
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform duration-300 ${hoveredNav === item.name ? 'rotate-180' : ''}`}
                                            style={{ color: isLightTheme ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)" }}
                                        />
                                    )}

                                    {/* Safe Hover Area Bridge */}
                                    {item.isMega && hoveredNav === item.name && (
                                        <div className="absolute top-full left-0 w-full h-8 bg-transparent z-40" />
                                    )}
                                </div>
                            ))}
                            {/* Mega Menu Overlay */}
                            <AnimatePresence>
                                {hoveredNav === "Categories" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                        onMouseEnter={() => setHoveredNav("Categories")}
                                        className={`absolute top-full left-0 -translate-x-1/6 mt-6 w-[700px] p-8 rounded-[2rem] border shadow-[0_30px_100px_-12px_rgba(0,0,0,0.25)] z-50 grid grid-cols-3 gap-10 pointer-events-auto ${isLightTheme
                                            ? "bg-white border-black/5"
                                            : "bg-[#0F0F0F] border-white/10"
                                            }`}
                                    >
                                        {/* Column 1: Flavors */}
                                        <div className="space-y-6">
                                            <div className={`flex items-center justify-between gap-2 pb-2 border-b ${isLightTheme ? 'border-black/5' : 'border-white/10'}`}>
                                                <h4 className={`font-bold text-xs uppercase tracking-[0.2em] ${isLightTheme ? 'text-neutral-500' : 'text-neutral-400'}`}>Flavors</h4>
                                            </div>
                                            <ul className="space-y-3">
                                                {['Spearmint', 'Ice Mint', 'Mint', 'Peppermint', 'Peppermint Menthol'].map((flavor) => (
                                                    <li key={flavor}>
                                                        <Link
                                                            href={`/shop?flavor=${flavor}`}
                                                            className="flex items-center gap-2 group cursor-pointer"
                                                        >
                                                            <div className={`w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${flavor.includes('Ice') || flavor.includes('Cool') ? 'bg-blue-400' : 'bg-green-500'
                                                                }`} />
                                                            <span className={`text-base font-medium transition-all group-hover:translate-x-1 ${isLightTheme ? 'text-neutral-700 group-hover:text-black' : 'text-neutral-300 group-hover:text-white'}`}>{flavor}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                            {/* View All Flavors Button */}
                                            <Link
                                                href="/shop?view=flavors"
                                                className={`group flex items-center justify-between w-full mt-4 px-4 py-3 rounded-xl transition-all duration-300 ${isLightTheme
                                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200/50'
                                                    : 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/20'
                                                    }`}
                                            >
                                                <span className={`text-sm font-semibold ${isLightTheme ? 'text-green-700' : 'text-green-400'}`}>
                                                    View All Flavors
                                                </span>
                                                <svg
                                                    className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${isLightTheme ? 'text-green-600' : 'text-green-400'}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </Link>
                                        </div>

                                        {/* Column 2: Latest */}
                                        <div className="space-y-6">
                                            <div className={`flex items-center gap-2 pb-2 border-b ${isLightTheme ? 'border-black/5' : 'border-white/10'}`}>
                                                <h4 className={`font-bold text-xs uppercase tracking-[0.2em] ${isLightTheme ? 'text-neutral-500' : 'text-neutral-400'}`}>Latest</h4>
                                            </div>
                                            <ul className="space-y-3">
                                                {[
                                                    { label: 'New Arrivals', href: '/shop?sort=newest' },
                                                    { label: 'Best Sellers', href: '/shop?sort=featured' },
                                                    { label: 'Limited Editions', href: '/shop?sort=featured' }, // Fallback
                                                    { label: 'Deals', href: '/shop?sort=price-asc' }
                                                ].map((item) => (
                                                    <li key={item.label}>
                                                        <Link
                                                            href={item.href}
                                                            className="flex items-center gap-2 group cursor-pointer"
                                                        >
                                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <span className={`text-base font-medium transition-all group-hover:translate-x-1 ${isLightTheme ? 'text-neutral-700 group-hover:text-black' : 'text-neutral-300 group-hover:text-white'}`}>{item.label}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Column 3: Strengths (Detailed) */}
                                        <div className="space-y-6">
                                            <div className={`flex items-center gap-2 pb-2 border-b ${isLightTheme ? 'border-black/5' : 'border-white/10'}`}>
                                                <h4 className={`font-bold text-xs uppercase tracking-[0.2em] ${isLightTheme ? 'text-neutral-500' : 'text-neutral-400'}`}>Strengths</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    { label: 'WEAK', range: '0-8 MG', color: 'group-hover:text-blue-500' },
                                                    { label: 'MEDIUM', range: '9-16 MG', color: 'group-hover:text-green-500' },
                                                    { label: 'STRONG', range: '17-32 MG', color: 'group-hover:text-orange-500' },
                                                    { label: 'EXTRA', range: '32-60 MG', color: 'group-hover:text-red-600' },
                                                    { label: 'EXTREME', range: '+60 MG', color: 'group-hover:text-purple-600' }
                                                ].map((strength) => (
                                                    <Link
                                                        key={strength.label}
                                                        href={`/shop?strength=${strength.label.toLowerCase()}`}
                                                        className={`block group cursor-pointer p-3 rounded-xl transition-colors ${isLightTheme ? 'hover:bg-neutral-100' : 'hover:bg-white/5'}`}
                                                    >
                                                        <div className={`font-bold text-sm mb-1 transition-colors ${strength.color} ${isLightTheme ? 'text-neutral-900' : 'text-white'}`}>{strength.label}</div>
                                                        <div className={`text-xs font-medium ${isLightTheme ? 'text-neutral-500' : 'text-neutral-400'}`}>{strength.range}</div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {hoveredNav === "Brands" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                        onMouseEnter={() => setHoveredNav("Brands")}
                                        className={`absolute top-full left-0 -translate-x-1/4 mt-6 w-[600px] p-8 rounded-[2rem] border shadow-[0_30px_100px_-12px_rgba(0,0,0,0.25)] z-50 pointer-events-auto ${isLightTheme
                                            ? "bg-white border-black/5"
                                            : "bg-[#0F0F0F] border-white/10"
                                            }`}
                                    >
                                        <div className={`flex items-center gap-2 pb-2 mb-6 border-b ${isLightTheme ? 'border-black/5' : 'border-white/10'}`}>
                                            <h4 className={`font-bold text-xs uppercase tracking-[0.2em] ${isLightTheme ? 'text-neutral-500' : 'text-neutral-400'}`}>Brands</h4>
                                        </div>
                                        {brands.length > 0 ? (
                                            <div className="space-y-6">
                                                {/* Featured Brands - First 2 */}
                                                <div>
                                                    <div className={`flex items-center gap-2 mb-4`}>
                                                        <svg className={`w-4 h-4 ${isLightTheme ? 'text-amber-500' : 'text-amber-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className={`text-xs font-bold uppercase tracking-wider ${isLightTheme ? 'text-amber-600' : 'text-amber-400'}`}>Featured</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {brands.slice(0, 2).map((brand) => (
                                                            <Link
                                                                href={`/shop?brand=${encodeURIComponent(brand.name.toLowerCase())}`}
                                                                key={brand.id}
                                                                className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${isLightTheme
                                                                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200/50'
                                                                        : 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/20'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className={`text-lg font-bold transition-transform group-hover:translate-x-1 ${isLightTheme ? 'text-amber-900' : 'text-amber-100'}`}>
                                                                        {brand.name}
                                                                    </span>
                                                                    <svg
                                                                        className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isLightTheme ? 'text-amber-600' : 'text-amber-400'}`}
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                    >
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                                    </svg>
                                                                </div>
                                                                {/* Shine effect on hover */}
                                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* All Brands - Rest of the list */}
                                                {brands.length > 2 && (
                                                    <div>
                                                        <div className={`flex items-center gap-2 pb-2 mb-4 border-b ${isLightTheme ? 'border-black/5' : 'border-white/10'}`}>
                                                            <span className={`text-xs font-bold uppercase tracking-wider ${isLightTheme ? 'text-neutral-400' : 'text-neutral-500'}`}>All Brands</span>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-y-3 gap-x-6">
                                                            {brands.slice(2).map((brand) => (
                                                                <Link href={`/shop?brand=${encodeURIComponent(brand.name.toLowerCase())}`} key={brand.id} className="flex items-center gap-2 group cursor-pointer">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    <span className={`text-sm font-medium transition-all group-hover:translate-x-1 ${isLightTheme ? 'text-neutral-600 group-hover:text-black' : 'text-neutral-400 group-hover:text-white'}`}>{brand.name}</span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className={`text-sm ${isLightTheme ? 'text-neutral-500' : 'text-neutral-400'}`}>No brands available yet.</p>
                                        )}
                                    </motion.div>
                                )}

                                {hoveredNav === "Help" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                        onMouseEnter={() => setHoveredNav("Help")}
                                        className={`absolute top-full right-0 mt-6 w-[300px] p-6 rounded-[2rem] border shadow-[0_30px_100px_-12px_rgba(0,0,0,0.25)] z-50 pointer-events-auto ${isLightTheme
                                            ? "bg-white border-black/5"
                                            : "bg-[#0F0F0F] border-white/10"
                                            }`}
                                    >
                                        <div className={`flex items-center gap-2 pb-2 mb-4 border-b ${isLightTheme ? 'border-black/5' : 'border-white/10'}`}>
                                            <h4 className={`font-bold text-xs uppercase tracking-[0.2em] ${isLightTheme ? 'text-neutral-500' : 'text-neutral-400'}`}>Customer Support</h4>
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                { name: "Contact Us", href: "/contact", color: "bg-blue-500" },
                                                { name: "FAQs", href: "/faqs", color: "bg-purple-500" },
                                                { name: "Shipping Information", href: "/shipping", color: "bg-green-500" },
                                                { name: "Track My Order", href: "/track-order", color: "bg-orange-500" }
                                            ].map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={`flex items-center gap-3 group cursor-pointer p-3 rounded-xl transition-all ${isLightTheme ? 'hover:bg-neutral-100' : 'hover:bg-white/5'}`}
                                                >
                                                    <div className={`w-1.5 h-1.5 rounded-full ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                                    <span className={`text-sm font-medium transition-all group-hover:translate-x-1 ${isLightTheme ? 'text-neutral-700 group-hover:text-black' : 'text-neutral-300 group-hover:text-white'}`}>
                                                        {item.name}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </nav>

                        {/* Divider - Slash */}
                        <span className={`mx-2 text-2xl font-light select-none ${isLightTheme ? 'text-black/10' : 'text-white/10'}`}>/</span>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            <Magnetic>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-white/10 w-12 h-12 transition-colors"
                                    onClick={() => setIsSearchOpen(true)}
                                >
                                    <Search className={`h-5 w-5 stroke-[1.5] ${isLightTheme ? 'text-black/70' : 'text-white/70'}`} />
                                </Button>
                            </Magnetic>

                            {/* Login/User Menu */}
                            {user ? (
                                <div
                                    className="relative flex items-center"
                                    onMouseEnter={() => setIsUserMenuOpen(true)}
                                    onMouseLeave={() => setIsUserMenuOpen(false)}
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full hover:bg-white/10 w-12 h-12 transition-colors"
                                    >
                                        <User className={`h-5 w-5 stroke-[1.5] ${isLightTheme ? 'text-black/70' : 'text-white/70'}`} />
                                    </Button>

                                    {/* Safe Hover Area Bridge */}
                                    {isUserMenuOpen && (
                                        <div className="absolute top-full right-0 w-full h-8 bg-transparent z-40" />
                                    )}

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                                transition={{ duration: 0.2 }}
                                                className={`absolute right-0 top-full mt-6 w-64 p-6 rounded-[2rem] border shadow-[0_30px_100px_-12px_rgba(0,0,0,0.25)] z-50 ${isLightTheme
                                                    ? "bg-white border-black/5"
                                                    : "bg-[#0F0F0F] border-white/10"
                                                    }`}
                                            >
                                                {/* User Info Section */}
                                                <div className={`space-y-4 pb-4 border-b ${isLightTheme ? 'border-black/5' : 'border-white/10'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLightTheme ? 'bg-neutral-100' : 'bg-white/5'}`}>
                                                            <User className={`h-5 w-5 ${isLightTheme ? 'text-neutral-600' : 'text-neutral-400'}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm font-semibold truncate ${isLightTheme ? 'text-neutral-900' : 'text-white'}`}>
                                                                {userData?.displayName || user.email?.split('@')[0] || 'User'}
                                                            </p>
                                                            <p className={`text-xs font-medium ${isLightTheme ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                                                {userData?.role === "seller" ? "Seller" : "Buyer"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="space-y-2 pt-4">
                                                    {userData?.role === "admin" && (
                                                        <Link
                                                            href="/admin"
                                                            className={`flex items-center gap-3 group cursor-pointer p-3 rounded-xl transition-all ${isLightTheme ? 'hover:bg-neutral-100' : 'hover:bg-white/5'}`}
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                        >
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <span className={`text-sm font-medium transition-all group-hover:translate-x-1 ${isLightTheme ? 'text-neutral-700 group-hover:text-black' : 'text-neutral-300 group-hover:text-white'}`}>
                                                                Dashboard
                                                            </span>
                                                        </Link>
                                                    )}
                                                    {userData?.role === "seller" && (
                                                        <Link
                                                            href="/seller/dashboard"
                                                            className={`flex items-center gap-3 group cursor-pointer p-3 rounded-xl transition-all ${isLightTheme ? 'hover:bg-neutral-100' : 'hover:bg-white/5'}`}
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                        >
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <span className={`text-sm font-medium transition-all group-hover:translate-x-1 ${isLightTheme ? 'text-neutral-700 group-hover:text-black' : 'text-neutral-300 group-hover:text-white'}`}>
                                                                Dashboard
                                                            </span>
                                                        </Link>
                                                    )}
                                                    <button
                                                        className="w-full flex items-center gap-3 group cursor-pointer p-3 rounded-xl transition-all text-left"
                                                        onClick={() => {
                                                            setIsUserMenuOpen(false);
                                                            setIsAccountOpen(true);
                                                        }}
                                                    >
                                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <span className={`text-sm font-medium transition-all group-hover:translate-x-1 ${isLightTheme ? 'text-neutral-700 group-hover:text-black' : 'text-neutral-300 group-hover:text-white'}`}>
                                                            My Account
                                                        </span>
                                                    </button>
                                                    <button
                                                        className="w-full flex items-center gap-3 group cursor-pointer p-3 rounded-xl transition-all text-left"
                                                        onClick={() => {
                                                            setIsUserMenuOpen(false);
                                                            setIsOrderHistoryOpen(true);
                                                        }}
                                                    >
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <span className={`text-sm font-medium transition-all group-hover:translate-x-1 ${isLightTheme ? 'text-neutral-700 group-hover:text-black' : 'text-neutral-300 group-hover:text-white'}`}>
                                                            Purchase History
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            await signOut();
                                                            router.push("/");
                                                            setIsUserMenuOpen(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 group cursor-pointer p-3 rounded-xl transition-all text-left"
                                                    >
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <span className="text-sm font-medium transition-all group-hover:translate-x-1 text-red-500 group-hover:text-red-600">
                                                            Sign Out
                                                        </span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-white/10 w-12 h-12 transition-colors"
                                    onClick={() => setIsLoginOpen(true)}
                                >
                                    <User className={`h-5 w-5 stroke-[1.5] ${isLightTheme ? 'text-black/70' : 'text-white/70'}`} />
                                </Button>
                            )}

                            {/* Cart */}
                            <Magnetic>
                                <div className="relative">
                                    <Button
                                        size="icon"
                                        className="rounded-full bg-foreground text-background hover:bg-foreground/90 w-12 h-12 transition-all shadow-lg hover:scale-105 active:scale-95"
                                        onClick={() => openCart()}
                                    >
                                        <ShoppingBag className="h-5 w-5 stroke-[2]" />
                                    </Button>
                                    {mounted && getTotalItems() > 0 && (
                                        <motion.span
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
                                            className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 border-2 border-white dark:border-black"
                                        />
                                    )}
                                </div>
                            </Magnetic>
                        </div>
                    </motion.div>
                </div>

                {/* Mobile Layout: Single Unified Island */}
                <motion.div
                    animate={{
                        backgroundColor: islandBg,
                    }}
                    className="md:hidden pointer-events-auto flex items-center justify-between w-full max-w-[90vw] px-6 py-3 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] h-[64px]"
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center z-50">
                        <motion.div
                            animate={{
                                filter: `brightness(0) saturate(100%) ${isLightTheme ? 'invert(0)' : 'invert(1)'}`,
                                opacity: 0.8
                            }}
                            className="relative w-28 h-8"
                        >
                            <Image
                                src="/snusidealogo.svg"
                                alt="SnusIdea Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                    </Link>

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-white/10 w-10 h-10 transition-colors"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search className={`h-5 w-5 stroke-[1.5] ${isLightTheme ? 'text-black/70' : 'text-white/70'}`} />
                        </Button>

                        <div className="relative">
                            <Button
                                size="icon"
                                className="rounded-full bg-foreground text-background hover:bg-foreground/90 w-10 h-10 transition-all shadow-md active:scale-95"
                                onClick={() => openCart()}
                            >
                                <ShoppingBag className="h-4 w-4 stroke-[2]" />
                            </Button>
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-black" />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-white/10 w-10 h-10"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <motion.div
                                animate={{ color: isLightTheme ? '#000' : '#fff' }}
                                transition={{ duration: 0.3 }}
                            >
                                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </motion.div>
                        </Button>
                    </div>
                </motion.div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                </AnimatePresence>
            </motion.header>

            {/* Cart Component */}
            <Cart isOpen={isCartOpen} onClose={closeCart} />

            {/* Login Component */}
            <LoginSheet isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

            {/* Account Component */}
            <AccountSheet isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />

            {/* Order History Component */}
            <OrderHistorySheet isOpen={isOrderHistoryOpen} onClose={() => setIsOrderHistoryOpen(false)} />

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                user={user}
                userData={userData}
                signOut={signOut}
                onOpenLogin={() => setIsLoginOpen(true)}
                onOpenAccount={() => setIsAccountOpen(true)}
                onOpenOrders={() => setIsOrderHistoryOpen(true)}
            />

            {/* Search Overlay */}
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
