"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/firebase/auth";
import { getUserData } from "@/lib/firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");

    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            checkAdminRole(user.uid);
        }
    }, [user, loading]);

    async function checkAdminRole(uid: string) {
        try {
            const userData = await getUserData(uid);
            if (userData && userData.role === 'admin') {
                router.push("/admin/dashboard");
            } else {
                if (user) {
                    router.push("/");
                }
            }
        } catch (error) {
            console.error("Error checking role:", error);
        }
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isRegister) {
                // Register as Admin
                await signUp(email, password, displayName, 'admin');
                toast.success("Admin Account Created Successfully!");
                router.push("/admin/dashboard");
            } else {
                // Login
                const userCredential = await signIn(email, password);
                const userData = await getUserData(userCredential.uid);

                if (userData && userData.role === 'admin') {
                    toast.success("Welcome back, Admin.");
                    router.push("/admin/dashboard");
                } else {
                    toast.error("Access Denied: You do not have admin privileges.");
                }
            }
        } catch (error: any) {
            toast.error(error.message || `Failed to ${isRegister ? 'register' : 'sign in'}`);
        } finally {
            setIsLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex relative overflow-hidden bg-zinc-950 text-white selection:bg-indigo-500/30">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-difference z-0" />

            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 relative z-10 items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 border-r border-white/5">
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-blue-500/20 to-violet-500/20 rounded-full blur-[100px]"
                    />

                    <div className="relative z-10 text-center p-12">
                        <div className="w-20 h-20 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                            <ShieldCheck className="w-10 h-10 text-indigo-400" />
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
                        >
                            Admin Portal
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-zinc-400 max-w-md mx-auto leading-relaxed"
                        >
                            Manage your store, track assignments, and monitor system performance from one centralized dashboard.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-8 bg-zinc-950">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="w-full max-w-sm space-y-8"
                >
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-2xl font-semibold tracking-tight text-white">
                            {isRegister ? "Create Admin Account" : "Authenticate"}
                        </h2>
                        <p className="text-zinc-500 text-sm">
                            {isRegister ? "Register a new administrative user." : "Enter your credentials to access the admin environment."}
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {isRegister && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400 ml-1 uppercase tracking-wider">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-white/[0.03] rounded-xl transition-colors group-focus-within:bg-white/[0.05]" />
                                        <User className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-sm text-white outline-none relative z-10 placeholder:text-zinc-600 rounded-xl transition-all"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400 ml-1 uppercase tracking-wider">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-white/[0.03] rounded-xl transition-colors group-focus-within:bg-white/[0.05]" />
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="admin@snusidea.com"
                                        className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-sm text-white outline-none relative z-10 placeholder:text-zinc-600 rounded-xl transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400 ml-1 uppercase tracking-wider">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-white/[0.03] rounded-xl transition-colors group-focus-within:bg-white/[0.05]" />
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="••••••••••••"
                                        className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-sm text-white outline-none relative z-10 placeholder:text-zinc-600 rounded-xl transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                    <span>{isRegister ? "Creating Account..." : "Verifying..."}</span>
                                </div>
                            ) : (
                                isRegister ? "Create Admin Account" : "Access Dashboard"
                            )}
                        </Button>
                    </form>

                    <div className="pt-8 border-t border-white/5 space-y-4">
                        <button
                            onClick={() => setIsRegister(!isRegister)}
                            className="w-full text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
                        >
                            {isRegister ? "Back to Login" : "Register new admin (Temporary)"}
                        </button>

                        <Link href="/" className="flex items-center justify-center gap-2 text-xs font-medium text-zinc-600 hover:text-white transition-colors">
                            <ArrowRight className="w-3 h-3 rotate-180" />
                            Return to Storefront
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
