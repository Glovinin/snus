"use client";

import { motion } from "framer-motion";
import { Disc, Smile, Zap, AlertTriangle, ArrowRight } from "lucide-react";

const steps = [
    {
        id: "01",
        icon: Disc,
        title: "Open",
        description: "Crack the can. Break the seal. The sound of freshness.",
    },
    {
        id: "02",
        icon: Smile,
        title: "Place",
        description: "Slide a pouch under your upper lip. Discreet and secure.",
    },
    {
        id: "03",
        icon: Zap,
        title: "Enjoy",
        description: "Feel the tingle. Up to 30 minutes of pure, hands-free satisfaction.",
    },
];

export function HowToUse() {
    return (
        <section data-section="feature-dark" data-theme="dark" className="py-40 bg-[#050505] text-white relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium tracking-wide text-white/80"
                    >
                        THE RITUAL
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
                    >
                        How to use.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Master the art of the pouch in three simple steps. <br className="hidden md:block" />
                        Designed for your modern lifestyle.
                    </motion.p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Connecting Line (Desktop) */}
                    <div className="absolute top-[100px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            {/* Step Number */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[120px] font-bold text-white/[0.02] select-none pointer-events-none transition-colors duration-500 group-hover:text-white/[0.05]">
                                {step.id}
                            </div>

                            <div className="relative h-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 text-center backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/5 overflow-hidden">
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="mb-8 relative">
                                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                                            <step.icon className="w-9 h-9 stroke-[1.5] text-white/90" />
                                        </div>
                                        {/* Pulse Effect */}
                                        <div className="absolute inset-0 rounded-full border border-white/20 scale-100 opacity-0 group-hover:animate-ping" />
                                    </div>

                                    <h3 className="text-3xl font-medium mb-4 text-white group-hover:text-white transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-white/50 text-lg leading-relaxed font-light group-hover:text-white/70 transition-colors">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="mt-20 flex flex-col items-center justify-center gap-3 text-white/30 text-sm font-medium"
                >
                    <div className="w-12 h-[1px] bg-white/10 mb-2" />
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <p>Contains nicotine. Not for sale to minors.</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
