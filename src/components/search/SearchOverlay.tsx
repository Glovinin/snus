"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    // Mock suggestions
    const suggestions = ["Ice Cool", "Citrus Burst", "Mint", "Strong", "Berry", "Limited Edition"];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-3xl flex flex-col"
                >
                    {/* Noise Texture */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-difference" />

                    {/* Header */}
                    <div className="flex justify-end p-8 relative z-10">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="w-14 h-14 rounded-full hover:bg-foreground/5 transition-colors"
                        >
                            <X className="w-8 h-8 stroke-[1.5]" />
                        </Button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-6 -mt-20 relative z-10">

                        {/* Input Container */}
                        <div className="w-full relative group mb-16">
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground origin-left"
                            />

                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 text-muted-foreground group-focus-within:text-foreground transition-colors duration-300" />

                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="What are you looking for?"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-transparent border-none py-8 pl-16 pr-4 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/20 focus:placeholder:text-muted-foreground/10 transition-all"
                            />
                        </div>

                        {/* Results / Suggestions */}
                        <div className="w-full pl-0 md:pl-16">
                            {!query ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> Trending Now
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {suggestions.map((item, i) => (
                                            <motion.button
                                                key={item}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.4 + (i * 0.05) }}
                                                className="px-8 py-4 rounded-full border border-foreground/10 hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300 text-lg md:text-xl font-medium"
                                            >
                                                {item}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-2"
                                >
                                    <p className="text-sm text-muted-foreground mb-6">Search results for "{query}"</p>

                                    {/* Mock Result Items */}
                                    {[1, 2, 3].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center justify-between p-6 hover:bg-foreground/5 rounded-3xl transition-all cursor-pointer group border border-transparent hover:border-foreground/5"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center">
                                                    <div className="w-8 h-8 rounded-full bg-foreground/20" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-2xl mb-1 group-hover:text-blue-500 transition-colors">Velvet Ice {query}</p>
                                                    <p className="text-muted-foreground font-medium">Nicotine Pouches • 12mg</p>
                                                </div>
                                            </div>
                                            <div className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
                                                <ArrowRight className="w-5 h-5 -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
