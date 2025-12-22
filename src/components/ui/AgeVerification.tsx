"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AgeVerification() {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check if user has already verified
        const hasVerified = localStorage.getItem("age-verified");
        if (!hasVerified) {
            // Small delay to prevent flash
            const timer = setTimeout(() => setIsVisible(true), 100);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleVerify = () => {
        localStorage.setItem("age-verified", "true");
        setIsVisible(false);
    };

    const handleDeny = () => {
        window.location.href = "https://www.google.com";
    };

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center"
                    >
                        {/* Background Noise & Glow */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-difference" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-inner">
                                <ShieldAlert className="w-10 h-10 text-white" />
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                                Age Verification
                            </h2>

                            <p className="text-lg text-white/60 mb-10 leading-relaxed">
                                You must be <span className="text-white font-semibold">18 years or older</span> to enter this site.
                                We sell nicotine products which are intended for adult use only.
                            </p>

                            <div className="w-full grid gap-4">
                                <Button
                                    onClick={handleVerify}
                                    className="w-full h-14 bg-white text-black hover:bg-white/90 rounded-xl text-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10"
                                >
                                    <Check className="w-5 h-5 mr-2" />
                                    I am 18 or older
                                </Button>

                                <Button
                                    onClick={handleDeny}
                                    variant="outline"
                                    className="w-full h-14 bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white rounded-xl text-lg font-medium transition-all"
                                >
                                    <XCircle className="w-5 h-5 mr-2 text-white/50" />
                                    I am under 18
                                </Button>
                            </div>

                            <p className="mt-8 text-xs text-white/30">
                                By entering, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
