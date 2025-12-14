"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Store, TrendingUp, Users, Globe, Handshake } from "lucide-react";

export function MarketplaceInfo() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-20">

                    {/* Visual Side - Levitating Interface */}
                    <div className="flex-1 w-full relative">
                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 rounded-full blur-[100px]" />

                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 1, type: "spring", bounce: 0.2 }}
                            viewport={{ once: true }}
                            className="relative bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-foreground/5 overflow-hidden"
                        >
                            {/* Browser/Window Header - Minimal */}
                            <div className="h-14 border-b border-foreground/5 flex items-center px-6 gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/20" />
                                </div>
                            </div>

                            {/* Store Interface */}
                            <div className="p-8">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                            <Store className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold tracking-tight">Premium Snus Shop</h3>
                                            <p className="text-sm text-muted-foreground">verified_seller.snusidea.com</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="rounded-full">Visit Store</Button>
                                </div>

                                {/* Dashboard Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Revenue Card with Graph */}
                                    <div className="col-span-2 bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-2xl">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Revenue</div>
                                                <div className="text-3xl font-bold tracking-tight flex items-baseline gap-2">
                                                    €42,593.00
                                                    <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">+12.5%</span>
                                                </div>
                                            </div>
                                            <div className="text-xs bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-muted-foreground font-medium">
                                                This Month
                                            </div>
                                        </div>
                                        {/* Visual Chart Bars */}
                                        <div className="flex items-end gap-2 h-28 w-full">
                                            {[45, 60, 75, 65, 80, 95, 85, 70, 60, 75, 90, 100].map((h, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    whileInView={{ height: `${h}%` }}
                                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                                    viewport={{ once: true }}
                                                    className={`flex-1 rounded-sm ${i === 11 ? 'bg-blue-600' : 'bg-blue-200 dark:bg-blue-900/40'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stat Card - Active Orders */}
                                    <div className="bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-2xl">
                                        <div className="flex justify-between mb-2">
                                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Orders</div>
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        </div>
                                        <div className="text-2xl font-bold tracking-tight mb-4">148</div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>Processing</span>
                                                <span>85%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                                                <div className="bg-blue-500 h-full w-[85%] rounded-full" />
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                <span>Shipped</span>
                                                <span>12%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                                                <div className="bg-indigo-400 h-full w-[12%] rounded-full" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stat Card - Customers */}
                                    <div className="bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-2xl flex flex-col justify-between">
                                        <div>
                                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">New Customers</div>
                                            <div className="text-2xl font-bold tracking-tight mb-2">+842</div>
                                            <div className="text-xs text-muted-foreground">in the last 7 days</div>
                                        </div>
                                        <div className="flex items-center -space-x-3 mt-4">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 bg-slate-${i * 100} flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm bg-gradient-to-br from-slate-100 to-slate-200`}>
                                                    {i === 5 ? '2k+' : ''}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Text Side - Apple Style Typography */}
                    <div className="flex-1 max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-blue-600 mb-6">For Sellers</h2>
                            <h3 className="text-5xl md:text-6xl font-semibold tracking-tighter mb-8 leading-[1.05]">
                                Your business. <br />
                                <span className="text-muted-foreground">On a global stage.</span>
                            </h3>
                            <p className="text-xl text-muted-foreground font-light leading-relaxed mb-10">
                                Experience a marketplace designed for scale. Powerful tools, instant global reach, and zero friction setup. It's not just a listing; it's your flagship store.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shrink-0">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-1">Scale without limits</h4>
                                        <p className="text-muted-foreground">Reach certified buyers across Europe instantly.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center shrink-0">
                                        <Handshake className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-1">Direct Brand Access</h4>
                                        <p className="text-muted-foreground">Build relationships directly with retailers and distributors.</p>
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-12"
                            >
                                <Button size="lg" className="rounded-full h-14 px-8 text-lg bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl hover:scale-105 active:scale-95">
                                    Start Selling Now
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
