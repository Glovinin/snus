"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, Github, Chrome } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => setIsLoading(false), 2000);
    }

    return (
        <div className="min-h-screen w-full flex relative overflow-hidden bg-background text-foreground">
            {/* Background Noise */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-difference z-0" />

            {/* Left Side - Visual / Brand */}
            <div className="hidden lg:flex w-1/2 relative z-10 items-center justify-center bg-foreground/5 border-r border-foreground/5">
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                    {/* Animated Gradient Blob */}
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
                        className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-full blur-[100px]"
                    />

                    <div className="relative z-10 text-center p-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-6xl font-bold tracking-tighter mb-6"
                        >
                            Welcome to <br /> the Future.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-muted-foreground max-w-md mx-auto"
                        >
                            Join the definitive community for premium nicotine enjoyment.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Sign in to your account</h2>
                        <p className="text-muted-foreground">
                            Enter your details below to access your collection.
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative group">
                                    <Mail className="absolute left-0 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="w-full bg-transparent border-b border-foreground/10 py-3 pl-8 text-lg outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative group">
                                    <Lock className="absolute left-0 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-full bg-transparent border-b border-foreground/10 py-3 pl-8 text-lg outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 rounded-full text-lg font-medium bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
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

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-foreground/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-12 rounded-full border-foreground/10 hover:bg-foreground/5 hover:border-foreground/20">
                            <Github className="mr-2 h-4 w-4" /> Github
                        </Button>
                        <Button variant="outline" className="h-12 rounded-full border-foreground/10 hover:bg-foreground/5 hover:border-foreground/20">
                            <Chrome className="mr-2 h-4 w-4" /> Google
                        </Button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-semibold text-foreground hover:underline underline-offset-4">
                            Sign up
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Back to Home */}
            <Link href="/" className="absolute top-8 left-8 z-50 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
            </Link>
        </div>
    );
}
