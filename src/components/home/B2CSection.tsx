"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Store, Users, ShoppingCart, Zap, ShieldCheck, TrendingUp, Package, Globe } from "lucide-react";

export function B2CSection() {
    return (
        <section className="py-24 bg-foreground text-background relative overflow-hidden" data-theme="dark">
            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    
                    {/* Visual Side - Store Mockup */}
                    <div className="flex-1 w-full relative">
                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-500/5 rounded-full blur-[100px]" />

                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 1, type: "spring", bounce: 0.2 }}
                            viewport={{ once: true }}
                            className="relative bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl shadow-purple-900/10 border border-white/5 overflow-hidden"
                        >
                            {/* Browser/Window Header */}
                            <div className="h-14 border-b border-foreground/5 flex items-center px-6 gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/20" />
                                </div>
                                <div className="flex-1 flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground font-medium">mystore.snusidea.com</span>
                                </div>
                            </div>

                            {/* Store Interface Mockup */}
                            <div className="p-8">
                                {/* Store Header */}
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-foreground/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                                            <Store className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold tracking-tight">My Premium Store</h3>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Globe className="w-3 h-3" />
                                                Selling globally
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                                        <span className="text-xs font-semibold text-green-700 dark:text-green-400">Online</span>
                                    </div>
                                </div>

                                {/* Store Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl">
                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Products</div>
                                        <div className="text-2xl font-bold tracking-tight">247</div>
                                        <div className="text-xs text-green-600 mt-1">+12 this week</div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl">
                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Sales</div>
                                        <div className="text-2xl font-bold tracking-tight">1.2k</div>
                                        <div className="text-xs text-green-600 mt-1">+8% this month</div>
                                    </div>
                                </div>

                                {/* Product Showcase */}
                                <div className="space-y-3">
                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Featured Products</div>
                                    {[
                                        { name: "Nicotine Pouches Mint", price: "€12.99", sales: "234 sales" },
                                        { name: "Tropical Flavor Pack", price: "€24.99", sales: "189 sales" },
                                        { name: "Premium Snus Collection", price: "€45.99", sales: "156 sales" }
                                    ].map((product, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            viewport={{ once: true }}
                                            className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center">
                                                <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-sm truncate">{product.name}</div>
                                                <div className="text-xs text-muted-foreground">{product.sales}</div>
                                            </div>
                                            <div className="font-bold text-sm">{product.price}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Text Side */}
                    <div className="flex-1 max-w-xl">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="inline-block text-sm font-medium tracking-[0.2em] uppercase text-white/60 mb-6"
                        >
                            Marketplace B2C
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter mb-6 leading-[1.05]"
                        >
                            Create your store. <br />
                            <span className="text-white/60">Sell globally.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-lg text-white/60 font-light mb-10 leading-relaxed"
                        >
                            Amazon-style marketplace platform. Businesses create their own stores and sell directly to consumers worldwide.
                        </motion.p>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            {[
                                {
                                    icon: Store,
                                    title: "Custom Store",
                                    description: "Unique identity on the platform"
                                },
                                {
                                    icon: Users,
                                    title: "Global Access",
                                    description: "Millions of consumers"
                                },
                                {
                                    icon: ShoppingCart,
                                    title: "Complete Management",
                                    description: "Full control panel"
                                },
                                {
                                    icon: Zap,
                                    title: "Quick Setup",
                                    description: "Start in minutes"
                                }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                                    viewport={{ once: true }}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <item.icon className="w-6 h-6 text-white mb-3" />
                                    <h3 className="text-base font-bold mb-1">{item.title}</h3>
                                    <p className="text-sm text-white/60">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <Button size="lg" className="rounded-full h-14 px-8 text-lg bg-white text-black hover:bg-white/90 transition-all shadow-xl hover:scale-105 active:scale-95">
                                Create My Store
                            </Button>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
