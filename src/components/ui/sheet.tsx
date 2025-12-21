"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

const SheetContext = React.createContext<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
} | null>(null);

export function Sheet({ open, onOpenChange, children }: SheetProps) {
    return (
        <SheetContext.Provider value={{ open, onOpenChange }}>
            {children}
        </SheetContext.Provider>
    );
}

export function SheetContent({
    children,
    className,
    side = "right",
    title
}: {
    children: React.ReactNode;
    className?: string;
    side?: "right" | "left";
    title?: string;
}) {
    const context = React.useContext(SheetContext);
    if (!context) throw new Error("SheetContent must be used within a Sheet");

    const { open, onOpenChange } = context;

    // Prevent body scroll when open
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);

    const variants = {
        closed: { x: side === "right" ? "100%" : "-100%", opacity: 0 },
        open: { x: 0, opacity: 1 },
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Sheet Panel */}
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        variants={variants}
                        className={cn(
                            "fixed z-50 h-full w-full max-w-md bg-zinc-950/80 backdrop-blur-xl border-l border-white/10 shadow-2xl p-6",
                            side === "right" ? "right-0 top-0" : "left-0 top-0 border-r border-l-0",
                            className
                        )}
                    >
                        <div className="flex items-center justify-between mb-6">
                            {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
                            <button
                                onClick={() => onOpenChange(false)}
                                className="rounded-full p-2 bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
