"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Cart } from "@/components/cart/Cart";
import { SearchOverlay } from "@/components/search/SearchOverlay";

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

// --- Main Header Component ---

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLightTheme, setIsLightTheme] = useState(false);

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
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-6 left-0 right-0 z-50 flex justify-center items-start gap-4 px-4 pointer-events-none"
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
                        <nav className="flex items-center gap-1 relative z-10">
                            {[
                                { name: "Shop", href: "/shop" },
                                { name: "Our Story", href: "/about" },
                                { name: "Journal", href: "/blog" },
                            ].map((item) => (
                                <NavLink key={item.name} href={item.href} isLightTheme={isLightTheme}>
                                    {item.name}
                                </NavLink>
                            ))}
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

                            {/* Login */}
                            <Magnetic>
                                <Link href="/login">
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 w-12 h-12 transition-colors">
                                        <User className={`h-5 w-5 stroke-[1.5] ${isLightTheme ? 'text-black/70' : 'text-white/70'}`} />
                                    </Button>
                                </Link>
                            </Magnetic>

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
