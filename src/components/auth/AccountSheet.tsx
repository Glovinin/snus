"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, Phone, MapPin, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { updateUserData } from "@/lib/firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

interface AccountSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AccountSheet({ isOpen, onClose }: AccountSheetProps) {
    const { user, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Form State
    const [displayName, setDisplayName] = useState("");
    const [phone, setPhone] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("");

    // Initialize form with user data when sheet opens
    useEffect(() => {
        if (isOpen && userData) {
            setDisplayName(userData.displayName || "");
            setPhone(userData.phone || "");
            setStreet(userData.address?.street || "");
            setCity(userData.address?.city || "");
            setState(userData.address?.state || "");
            setZipCode(userData.address?.zipCode || "");
            setCountry(userData.address?.country || "");
        }
    }, [isOpen, userData]);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!mounted) return null;

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        try {
            await updateUserData(user.uid, {
                displayName,
                phone,
                address: { street, city, state, zipCode, country }
            });
            toast.success("Profile updated successfully!");
            onClose();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to update profile";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        onClick={onClose}
                    />

                    {/* Floating Panel */}
                    <motion.div
                        initial={isMobile ? { y: "100%" } : { x: "100%", opacity: 0.5 }}
                        animate={isMobile ? { y: 0 } : { x: 0, opacity: 1 }}
                        exit={isMobile ? { y: "100%" } : { x: "110%", opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                        className={`fixed z-[70] flex flex-col bg-background/95 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden
                            ${isMobile
                                ? "bottom-0 left-0 right-0 h-[85vh] rounded-t-[32px]"
                                : "top-4 right-4 bottom-4 w-[520px] rounded-[32px]"
                            }`}
                    >
                        {/* Noise Texture */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-difference" />

                        {/* Close Button */}
                        <div className="absolute top-6 right-6 z-20">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full hover:bg-foreground/5 w-10 h-10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 md:p-12 flex flex-col relative z-10 scrollbar-hide">
                            <div className="mb-8">
                                <h2 className="text-4xl font-bold tracking-tighter mb-4 text-foreground">
                                    My Account
                                </h2>
                                <p className="text-muted-foreground">
                                    Manage your profile details and delivery information.
                                </p>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Personal Info Section */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                        Personal Information
                                    </h3>

                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-foreground/[0.03] rounded-xl transition-colors group-focus-within:bg-foreground/[0.05]" />
                                        <User className="absolute left-4 top-4 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-base outline-none relative z-10 placeholder:text-muted-foreground/50 rounded-xl"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                        />
                                    </div>

                                    <div className="relative group opacity-60">
                                        <div className="absolute inset-0 bg-foreground/[0.03] rounded-xl" />
                                        <Mail className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="email"
                                            value={user?.email || ""}
                                            readOnly
                                            className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-base outline-none relative z-10 text-muted-foreground cursor-not-allowed rounded-xl"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-foreground/[0.03] rounded-xl transition-colors group-focus-within:bg-foreground/[0.05]" />
                                        <Phone className="absolute left-4 top-4 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                        <input
                                            type="tel"
                                            placeholder="Mobile Number"
                                            className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-base outline-none relative z-10 placeholder:text-muted-foreground/50 rounded-xl"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Delivery Info Section */}
                                <div className="space-y-4 pt-4 border-t border-foreground/5">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                        Delivery Address
                                    </h3>

                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-foreground/[0.03] rounded-xl transition-colors group-focus-within:bg-foreground/[0.05]" />
                                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Street Address"
                                            className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-base outline-none relative z-10 placeholder:text-muted-foreground/50 rounded-xl"
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-foreground/[0.03] rounded-xl transition-colors group-focus-within:bg-foreground/[0.05]" />
                                            <input
                                                type="text"
                                                placeholder="City"
                                                className="w-full bg-transparent border-none py-4 px-4 text-sm outline-none relative z-10 placeholder:text-muted-foreground/50 rounded-xl"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                            />
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-foreground/[0.03] rounded-xl transition-colors group-focus-within:bg-foreground/[0.05]" />
                                            <input
                                                type="text"
                                                placeholder="State/Province"
                                                className="w-full bg-transparent border-none py-4 px-4 text-sm outline-none relative z-10 placeholder:text-muted-foreground/50 rounded-xl"
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-foreground/[0.03] rounded-xl transition-colors group-focus-within:bg-foreground/[0.05]" />
                                            <input
                                                type="text"
                                                placeholder="Zip Code"
                                                className="w-full bg-transparent border-none py-4 px-4 text-sm outline-none relative z-10 placeholder:text-muted-foreground/50 rounded-xl"
                                                value={zipCode}
                                                onChange={(e) => setZipCode(e.target.value)}
                                            />
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-foreground/[0.03] rounded-xl transition-colors group-focus-within:bg-foreground/[0.05]" />
                                            <input
                                                type="text"
                                                placeholder="Country"
                                                className="w-full bg-transparent border-none py-4 px-4 text-sm outline-none relative z-10 placeholder:text-muted-foreground/50 rounded-xl"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full h-14 rounded-full text-lg font-medium bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="mr-2 w-5 h-5" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
