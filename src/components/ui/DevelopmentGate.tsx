"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, Construction, Sparkles } from "lucide-react";

const CORRECT_PASSWORD = "@snus222";
const STORAGE_KEY = "snus_dev_access";

export function DevelopmentGate({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        // Check if user has already authenticated
        const hasAccess = localStorage.getItem(STORAGE_KEY);
        setIsAuthenticated(hasAccess === "true");
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password === CORRECT_PASSWORD) {
            localStorage.setItem(STORAGE_KEY, "true");
            setIsAuthenticated(true);
            setError("");
        } else {
            setError("Incorrect password");
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        }
    };

    // Show nothing while checking authentication status
    if (isAuthenticated === null) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full"
                />
            </div>
        );
    }

    // If authenticated, show the actual content
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // Show the development gate
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center z-[9999] overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient orbs */}
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-500/10 to-orange-600/5 blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    style={{ top: "-20%", left: "-10%" }}
                />
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500/10 to-purple-600/5 blur-3xl"
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 60, 0],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    style={{ bottom: "-15%", right: "-5%" }}
                />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            {/* Main content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md px-6"
            >
                {/* Card */}
                <div className="relative">
                    {/* Glow effect behind card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-600/10 blur-2xl scale-110 rounded-3xl" />

                    <motion.div
                        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
                    >
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="relative">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                                    <Construction className="w-10 h-10 text-white" />
                                </div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="absolute -top-1 -right-1"
                                >
                                    <Sparkles className="w-5 h-5 text-amber-400" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-center mb-2"
                        >
                            <h1 className="text-2xl font-bold text-white mb-2">
                                Under Development
                            </h1>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Our website is currently under construction.
                                <br />
                                Enter the password to access.
                            </p>
                        </motion.div>

                        {/* Form */}
                        <motion.form
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            onSubmit={handleSubmit}
                            className="mt-8 space-y-4"
                        >
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="Password"
                                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-400 text-sm text-center"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300"
                            >
                                Access Website
                            </motion.button>
                        </motion.form>

                        {/* Footer */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-center text-zinc-600 text-xs mt-6"
                        >
                            © 2024 SnusIdea. All rights reserved.
                        </motion.p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
