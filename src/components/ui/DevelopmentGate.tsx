"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const CORRECT_PASSWORD = "@snus222";
const STORAGE_KEY = "snus_dev_access";

export function DevelopmentGate({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const hasAccess = localStorage.getItem(STORAGE_KEY);
        setIsAuthenticated(hasAccess === "true");
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === CORRECT_PASSWORD) {
            setIsUnlocking(true);
            setTimeout(() => {
                localStorage.setItem(STORAGE_KEY, "true");
                setIsAuthenticated(true);
            }, 600);
        } else {
            setError("×");
            setPassword("");
            setTimeout(() => setError(""), 1500);
        }
    };

    // Loading - ultra minimal
    if (isAuthenticated === null) {
        return (
            <div className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[9999]">
                <motion.div
                    className="w-8 h-8 rounded-full border border-white/5 border-t-white/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </div>
        );
    }

    if (isAuthenticated) return <>{children}</>;

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isUnlocking ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[9999] overflow-hidden"
            onClick={() => inputRef.current?.focus()}
        >
            {/* Subtle ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.02] blur-[120px] rounded-full" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-8">

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    {/* brightness-0 invert forces the image to be pure white regardless of original color */}
                    <Image
                        src="/snusidealogo.svg"
                        alt="SnusIdea"
                        width={160}
                        height={45}
                        className="brightness-0 invert opacity-100"
                        priority
                    />
                </motion.div>

                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-2xl md:text-3xl font-light text-white tracking-wide mb-4">
                        Site Under Development
                    </h1>
                    <p className="text-white/40 text-sm font-light leading-relaxed max-w-xs mx-auto">
                        We are currently crafting a new premium experience.<br />
                        Please enter your access code below.
                    </p>
                </motion.div>

                {/* Input */}
                <motion.form
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="w-full"
                >
                    <div
                        className={`relative rounded-full transition-all duration-300 ${isFocused
                            ? 'bg-white/[0.04] ring-1 ring-white/10'
                            : 'bg-white/[0.02] ring-1 ring-white/[0.05]'
                            }`}
                    >
                        <input
                            ref={inputRef}
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(""); }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Password"
                            className="w-full bg-transparent py-4 px-6 pr-14 text-white text-sm tracking-wider placeholder:text-white/20 focus:outline-none"
                            autoComplete="off"
                            autoFocus
                        />

                        <AnimatePresence>
                            {password && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors"
                                >
                                    <ArrowRight className="w-4 h-4 text-white/70" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-red-400/50 text-xs text-center mt-4 tracking-wide"
                            >
                                Invalid password
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.form>
            </div>

            {/* Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 text-white/10 text-[10px] tracking-widest uppercase"
            >
                © 2025
            </motion.p>
        </motion.div>
    );
}
