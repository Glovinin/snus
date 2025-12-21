"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Chrome, User, Phone, MapPin, Building, Globe, Hash, ArrowRight, ArrowLeft, CheckCircle2, Zap, Gift, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { signIn, signInWithGoogle, signUp, getUserData, updateUserData } from "@/lib/firebase/auth";
import { auth } from "@/lib/firebase/config";
import Link from "next/link";
import toast from "react-hot-toast";

interface LoginSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginSheet({ isOpen, onClose }: LoginSheetProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [signupStep, setSignupStep] = useState(1);
    const [isGoogleCompleting, setIsGoogleCompleting] = useState(false);

    // Login State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Sign Up / Completion State
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [phone, setPhone] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("");

    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setRegisterEmail("");
        setRegisterPassword("");
        setConfirmPassword("");
        setDisplayName("");
        setPhone("");
        setStreet("");
        setCity("");
        setState("");
        setZipCode("");
        setCountry("");
        setSignupStep(1);
        setIsGoogleCompleting(false);
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        resetForm();
    };

    if (!mounted) return null;

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signIn(email, password);
            toast.success("Welcome back!");
            onClose();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to sign in";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isGoogleCompleting) {
                const user = auth.currentUser;
                if (!user) throw new Error("No user found");

                await updateUserData(user.uid, {
                    displayName,
                    phone,
                    address: { street, city, state, zipCode, country }
                });
                toast.success("Profile updated successfully!");
                onClose();
            } else {
                await signUp(
                    registerEmail,
                    registerPassword,
                    displayName,
                    "buyer",
                    phone,
                    { street, city, state, zipCode, country }
                );
                toast.success("Account created successfully!");
                onClose();
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to sign up";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleGoogleSignIn() {
        setIsLoading(true);
        try {
            const user = await signInWithGoogle("buyer");

            // Check if user has complete profile
            const userData = await getUserData(user.uid);

            if (userData && (!userData.phone || !userData.address)) {
                // Determine missing data and switch to completion mode
                setIsGoogleCompleting(true);
                setIsLogin(false);
                setRegisterEmail(user.email || "");
                setDisplayName(user.displayName || "");
                setSignupStep(1); // Start at Identity to confirm Name
                toast("Please complete your profile for delivery.");
            } else {
                toast.success("Welcome!");
                onClose();
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to sign in with Google";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    const nextStep = () => {
        if (signupStep === 1) {
            if (!displayName || !registerEmail) {
                toast.error("Please fill in all fields");
                return;
            }
            // Skip password step if completing Profile from Google
            if (isGoogleCompleting) {
                setSignupStep(3);
                return;
            }
        }
        if (signupStep === 2) {
            if (!registerPassword || !confirmPassword) {
                toast.error("Please enter specific password");
                return;
            }
            if (registerPassword !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
            if (registerPassword.length < 6) {
                toast.error("Password must be at least 6 characters");
                return;
            }
        }
        setSignupStep(prev => prev + 1);
    };

    const prevStep = () => {
        if (isGoogleCompleting && signupStep === 3) {
            setSignupStep(1);
            return;
        }
        setSignupStep(prev => prev - 1);
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
                                    {isLogin ? "Welcome back" : isGoogleCompleting ? "Complete Profile" : "Create Account"}
                                </h2>

                                {/* Benefits/Info Block */}
                                <div className="p-5 rounded-2xl bg-foreground/[0.03] border border-foreground/5 mb-6 backdrop-blur-sm">
                                    <h3 className="font-semibold text-sm mb-3 uppercase tracking-wider text-muted-foreground">
                                        {isGoogleCompleting ? "Almost there!" : "Why create an account?"}
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                                                <Zap className="w-4 h-4" />
                                            </div>
                                            <p className="text-sm font-medium text-foreground/80 leading-snug">
                                                {isGoogleCompleting
                                                    ? "Confirm your details for speedy checkout"
                                                    : "Faster checkout with saved details"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                                                <Gift className="w-4 h-4" />
                                            </div>
                                            <p className="text-sm font-medium text-foreground/80 leading-snug">
                                                Earn points & exclusive rewards
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Wizard Progress Steps (for signup or google completion) */}
                            {!isLogin && (
                                <div className="relative mb-8 px-4">
                                    {/* Background Line */}
                                    <div className="absolute top-5 left-8 right-8 h-[2px] bg-foreground/5 -z-0 rounded-full" />

                                    {/* Active Progress Line */}
                                    <div className="absolute top-5 left-8 right-8 h-[2px] -z-0 overflow-hidden rounded-full">
                                        <motion.div
                                            className="h-full bg-foreground"
                                            initial={{ width: "0%" }}
                                            animate={{ width: `${((signupStep - 1) / 2) * 100}%` }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                        />
                                    </div>

                                    {/* Steps */}
                                    <div className="relative z-10 flex justify-between">
                                        {[1, 2, 3].map((step) => {
                                            const isActive = signupStep >= step;
                                            const isCompleted = signupStep > step;

                                            // Handle case where step 2 is skipped in google completion
                                            if (isGoogleCompleting && step === 2) return null;

                                            return (
                                                <div key={step} className="flex flex-col items-center gap-3" style={isGoogleCompleting ? { flex: 1 } : {}}>
                                                    <motion.div
                                                        animate={{
                                                            scale: isActive ? 1 : 0.9,
                                                            backgroundColor: isActive ? "var(--foreground)" : "var(--background)",
                                                            borderColor: isActive ? "var(--foreground)" : "rgba(var(--foreground-rgb), 0.1)",
                                                            color: isActive ? "var(--background)" : "var(--muted-foreground)"
                                                        }}
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 shadow-sm
                                                            ${!isActive && "border-foreground/10 bg-background"}`}
                                                    >
                                                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step}
                                                    </motion.div>
                                                    <span className={`text-xs font-medium tracking-wide transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                                                        {step === 1 ? "Identity" : step === 2 ? "Security" : "Delivery"}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {isLogin ? (
                                /* LOGIN FORM */
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-foreground/[0.03] rounded-xl transition-colors group-focus-within:bg-foreground/[0.05]" />
                                            <Mail className="absolute left-4 top-4 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                            <input
                                                type="email"
                                                placeholder="name@example.com"
                                                className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-base outline-none relative z-10 placeholder:text-muted-foreground/50 rounded-xl"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-foreground/[0.03] rounded-xl transition-colors group-focus-within:bg-foreground/[0.05]" />
                                            <Lock className="absolute left-4 top-4 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-base outline-none relative z-10 placeholder:text-muted-foreground/50 rounded-xl"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Link
                                        href="/forgot-password"
                                        className="block text-sm text-right text-muted-foreground hover:text-foreground transition-colors font-medium"
                                        onClick={onClose}
                                    >
                                        Forgot password?
                                    </Link>

                                    <Button
                                        type="submit"
                                        className="w-full h-14 rounded-full text-lg font-medium bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] mt-2"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-6 h-6 border-2 border-background border-t-transparent rounded-full"
                                            />
                                        ) : (
                                            "Sign In"
                                        )}
                                    </Button>
                                </form>
                            ) : (
                                /* SIGNUP WIZARD */
                                <form onSubmit={handleSignup} className="space-y-6">
                                    <motion.div
                                        key={signupStep}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6 min-h-[200px]"
                                    >
                                        {signupStep === 1 && (
                                            <div className="space-y-4">
                                                <div className="relative group">
                                                    <div className="absolute inset-0 bg-foreground/[0.03] rounded-xl transition-colors group-focus-within:bg-foreground/[0.05]" />
                                                    <User className="absolute left-4 top-4 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                                    <input
                                                        type="text"
                                                        placeholder="Full Name (for delivery)"
                                                        className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-base outline-none relative z-10 placeholder:text-muted-foreground/50 rounded-xl"
                                                        value={displayName}
                                                        onChange={(e) => setDisplayName(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <div className="absolute inset-0 bg-foreground/[0.03] rounded-xl transition-colors group-focus-within:bg-foreground/[0.05]" />
                                                    <Mail className="absolute left-4 top-4 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                                    <input
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        className={`w-full bg-transparent border-none py-4 pl-12 pr-4 text-base outline-none relative z-10 placeholder:text-muted-foreground/50 rounded-xl ${isGoogleCompleting ? "opacity-50 cursor-not-allowed" : ""}`}
                                                        value={registerEmail}
                                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                                        readOnly={isGoogleCompleting}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {signupStep === 2 && !isGoogleCompleting && (
                                            <div className="space-y-4">
                                                <div className="relative group">
                                                    <div className="absolute inset-0 bg-foreground/[0.03] rounded-xl transition-colors group-focus-within:bg-foreground/[0.05]" />
                                                    <Lock className="absolute left-4 top-4 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                                    <input
                                                        type="password"
                                                        placeholder="Create Password"
                                                        className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-base outline-none relative z-10 placeholder:text-muted-foreground/50 rounded-xl"
                                                        value={registerPassword}
                                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <div className={`absolute inset-0 bg-foreground/[0.03] rounded-xl transition-colors group-focus-within:bg-foreground/[0.05] ${confirmPassword && registerPassword !== confirmPassword ? "bg-red-500/5 group-focus-within:bg-red-500/10" : ""}`} />
                                                    <Lock className={`absolute left-4 top-4 w-5 h-5 transition-colors ${confirmPassword && registerPassword !== confirmPassword ? "text-red-500" : "text-muted-foreground group-focus-within:text-foreground"}`} />
                                                    <input
                                                        type="password"
                                                        placeholder="Confirm Password"
                                                        className={`w-full bg-transparent border-none py-4 pl-12 pr-4 text-base outline-none relative z-10 placeholder:text-muted-foreground/50 rounded-xl ${confirmPassword && registerPassword !== confirmPassword ? "text-red-500" : ""}`}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                    />
                                                </div>
                                                <p className="text-xs text-muted-foreground px-1">
                                                    Make sure your password is secure and matches in both fields.
                                                </p>
                                            </div>
                                        )}

                                        {signupStep === 3 && (
                                            <div className="space-y-4">
                                                <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/10 mb-4">
                                                    <p className="text-sm text-foreground/80 flex items-start gap-2">
                                                        <Phone className="w-4 h-4 mt-1 shrink-0" />
                                                        We need your number to send delivery updates and order confirmations.
                                                    </p>
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
                                                        autoFocus
                                                    />
                                                </div>

                                                <div className="relative group">
                                                    <div className="absolute inset-0 bg-foreground/[0.03] rounded-xl transition-colors group-focus-within:bg-foreground/[0.05]" />
                                                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                                    <input
                                                        type="text"
                                                        placeholder="Full Address (Street, No., Apt)"
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
                                        )}
                                    </motion.div>

                                    <div className="flex gap-3">
                                        {signupStep > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={prevStep}
                                                className="flex-1 h-14 rounded-full border-foreground/10 hover:bg-foreground/5"
                                            >
                                                Back
                                            </Button>
                                        )}
                                        <Button
                                            type="button"
                                            onClick={signupStep === 3 ? handleSignup : nextStep}
                                            className="flex-[2] h-14 rounded-full text-lg font-medium bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-6 h-6 border-2 border-background border-t-transparent rounded-full"
                                                />
                                            ) : (
                                                <>
                                                    {signupStep === 3
                                                        ? (isGoogleCompleting ? "Update Profile" : "Create Account")
                                                        : "Next Step"}
                                                    {signupStep < 3 && <ArrowRight className="ml-2 w-5 h-5" />}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {!isGoogleCompleting && (
                                <>
                                    <div className="flex items-center gap-4 my-8">
                                        <div className="h-px flex-1 bg-foreground/10" />
                                        <span className="text-xs uppercase text-muted-foreground tracking-wider font-medium">Or continue with</span>
                                        <div className="h-px flex-1 bg-foreground/10" />
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full h-12 rounded-full border-foreground/10 hover:bg-foreground hover:text-background transition-all duration-300 relative group overflow-hidden"
                                        onClick={handleGoogleSignIn}
                                        disabled={isLoading}
                                    >
                                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors" />
                                        <Chrome className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                                        Continue with Google
                                    </Button>
                                </>
                            )}
                        </div>

                        {!isGoogleCompleting && (
                            <div className="p-6 border-t border-foreground/5 bg-foreground/[0.02] text-center relative z-10">
                                <p className="text-sm text-muted-foreground">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                                    <button
                                        type="button"
                                        onClick={toggleMode}
                                        className="font-semibold text-foreground hover:underline underline-offset-4 outline-none transition-colors hover:text-foreground/80"
                                    >
                                        {isLogin ? "Sign up" : "Sign in"}
                                    </button>
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
