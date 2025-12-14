"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Menu, X, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Cart } from "@/components/cart/Cart";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

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
        "Best Prices Worldwide",
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
                className="absolute text-center w-full"
            >
                {messages[index]}
            </motion.div>
        </AnimatePresence>
    );
}

// --- Main Header Component ---

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLightTheme, setIsLightTheme] = useState(false);
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user, userData, signOut } = useAuthSafe();
    const router = useRouter();

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
                    <div className="text-center text-white/50">Best Prices Worldwide</div>
                    <div className="text-right flex items-center justify-end gap-2">
                        Fast Delivery
                        <span className="text-white/30">⚡️</span>
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
                                    className="relative w-32 h-10 translate-y-[2px]"
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
                                { name: "Categories", href: "#", isMega: true },
                                { name: "Shop", href: "/shop" },
                                { name: "Marketplace", href: "/marketplace" },
                                { name: "Sellers", href: "/sellers" },
                                { name: "Blog", href: "/blog" },
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
                                        className={`absolute top-full left-0 -translate-x-1/6 mt-6 w-[700px] p-8 rounded-[2rem] border shadow-[0_30px_100px_-12px_rgba(0,0,0,0.25)] z-50 grid grid-cols-3 gap-10 ${isLightTheme
                                            ? "bg-white border-black/5"
                                            : "bg-[#0F0F0F] border-white/10"
                                            }`}
                                    >
                                        {/* Column 1: Flavors */}
                                        <div className="space-y-6">
                                            <div className={`flex items-center gap-2 pb-2 border-b ${isLightTheme ? 'border-black/5' : 'border-white/10'}`}>
                                                <h4 className={`font-bold text-xs uppercase tracking-[0.2em] ${isLightTheme ? 'text-neutral-500' : 'text-neutral-400'}`}>Flavors</h4>
                                            </div>
                                            <ul className="space-y-3">
                                                {['Mint', 'Berry', 'Citrus', 'Coffee', 'Tropical'].map((flavor) => (
                                                    <li key={flavor} className="flex items-center gap-2 group cursor-pointer">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <span className={`text-base font-medium transition-all group-hover:translate-x-1 ${isLightTheme ? 'text-neutral-700 group-hover:text-black' : 'text-neutral-300 group-hover:text-white'}`}>{flavor}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Column 2: Latest */}
                                        <div className="space-y-6">
                                            <div className={`flex items-center gap-2 pb-2 border-b ${isLightTheme ? 'border-black/5' : 'border-white/10'}`}>
                                                <h4 className={`font-bold text-xs uppercase tracking-[0.2em] ${isLightTheme ? 'text-neutral-500' : 'text-neutral-400'}`}>Latest</h4>
                                            </div>
                                            <ul className="space-y-3">
                                                {['New Arrivals', 'Best Sellers', 'Limited Editions', 'Deals'].map((item) => (
                                                    <li key={item} className="flex items-center gap-2 group cursor-pointer">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <span className={`text-base font-medium transition-all group-hover:translate-x-1 ${isLightTheme ? 'text-neutral-700 group-hover:text-black' : 'text-neutral-300 group-hover:text-white'}`}>{item}</span>
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
                                                    { label: 'EXTRA', range: '32-60 MG', color: 'group-hover:text-red-600' }
                                                ].map((strength) => (
                                                    <div key={strength.label} className={`group cursor-pointer p-3 rounded-xl transition-colors ${isLightTheme ? 'hover:bg-neutral-100' : 'hover:bg-white/5'}`}>
                                                        <div className={`font-bold text-sm mb-1 transition-colors ${strength.color} ${isLightTheme ? 'text-neutral-900' : 'text-white'}`}>{strength.label}</div>
                                                        <div className={`text-xs font-medium ${isLightTheme ? 'text-neutral-500' : 'text-neutral-400'}`}>{strength.range}</div>
                                                    </div>
                                                ))}
                                            </div>
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
                                                    {userData?.role === "seller" && (
                                                        <Link
                                                            href="/seller/dashboard"
                                                            className="flex items-center gap-3 group cursor-pointer p-3 rounded-xl transition-all"
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                        >
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <span className={`text-sm font-medium transition-all group-hover:translate-x-1 ${isLightTheme ? 'text-neutral-700 group-hover:text-black' : 'text-neutral-300 group-hover:text-white'}`}>
                                                                Dashboard
                                                            </span>
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href="/account"
                                                        className="flex items-center gap-3 group cursor-pointer p-3 rounded-xl transition-all"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <span className={`text-sm font-medium transition-all group-hover:translate-x-1 ${isLightTheme ? 'text-neutral-700 group-hover:text-black' : 'text-neutral-300 group-hover:text-white'}`}>
                                                            My Account
                                                        </span>
                                                    </Link>
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
                                <Link href="/login">
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 w-12 h-12 transition-colors">
                                        <User className={`h-5 w-5 stroke-[1.5] ${isLightTheme ? 'text-black/70' : 'text-white/70'}`} />
                                    </Button>
                                </Link>
                            )}

                            {/* Cart */}
                            <Magnetic>
                                <div className="relative">
                                    <Button
                                        size="icon"
                                        className="rounded-full bg-foreground text-background hover:bg-foreground/90 w-12 h-12 transition-all shadow-lg hover:scale-105 active:scale-95"
                                        onClick={() => setIsCartOpen(true)}
                                    >
                                        <ShoppingBag className="h-5 w-5 stroke-[2]" />
                                    </Button>
                                    <motion.span
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
                                        className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 border-2 border-white dark:border-black"
                                    />
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
                            className="relative w-28 h-8 translate-y-[1px]"
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
                                onClick={() => setIsCartOpen(true)}
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
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="absolute top-24 left-4 right-4 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 md:hidden pointer-events-auto z-[60]"
                        >
                            {[
                                { name: "Shop", href: "/shop" },
                                { name: "Our Story", href: "/about" },
                                { name: "Journal", href: "/blog" },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-lg font-medium p-4 text-white/90 hover:bg-white/10 rounded-2xl transition-colors focus:outline-none flex justify-between items-center group"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                    <span className="w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Cart Component */}
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* Search Overlay */}
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
