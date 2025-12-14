"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Leaf, Truck, Lock, Star, Award, Globe } from "lucide-react";

const features = [
    {
        icon: ShieldCheck,
        title: "Pharmaceutical Grade",
        description: "GMP certified purity.",
    },
    {
        icon: Zap,
        title: "Instant Release",
        description: "Moisture-lock tech.",
    },
    {
        icon: Leaf,
        title: "Eco-Conscious",
        description: "100% recyclable.",
    },
    {
        icon: Truck,
        title: "Fast Delivery",
        description: "Tracked shipping.",
    },
    {
        icon: Lock,
        title: "Secure Checkout",
        description: "256-bit encryption.",
    },
    {
        icon: Star,
        title: "Customer First",
        description: "Satisfaction guaranteed.",
    },
    {
        icon: Award,
        title: "Premium Quality",
        description: "Lab tested.",
    },
    {
        icon: Globe,
        title: "Sustainably Sourced",
        description: "Ethical supply chain.",
    },
];

export function FeatureSection() {
    return (
        <section data-section="feature-dark" data-theme="dark" className="py-32 bg-foreground text-background relative overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/video/Rebelvideo.mp4" type="video/mp4" />
                </video>

                {/* Cinematic Dark Overlay */}
                <div className="absolute inset-0 bg-black/80" />

                {/* Vignette for Focus */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,black_100%)]" />

                {/* Harmonious Noise Texture */}
                <div className="absolute inset-0 opacity-[0.2] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            </div>

            {/* Ambient Spotlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none z-0" />

            <div className="container px-4 mx-auto relative z-10 mb-20 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-7xl font-semibold tracking-tighter mb-6 pb-2 leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                >
                    Beyond the pouch.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light"
                >
                    We reimagined the entire experience. <br className="hidden md:block" />
                    From the molecule up to the logistics, everything is premium.
                </motion.p>
            </div>

            {/* Infinite Marquee */}
            <div className="relative z-10 w-full group [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                <div className="flex overflow-hidden">
                    <motion.div
                        className="flex gap-6 px-4"
                        animate={{ x: "-50%" }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 50,
                        }}
                        style={{ width: "max-content" }}
                    >
                        {/* Render the list twice to create the seamless loop */}
                        {[...features, ...features].map((feature, index) => (
                            <div
                                key={index}
                                className="group/card flex flex-col items-center justify-center w-[320px] h-[320px] p-8 rounded-[2.5rem] bg-white/5 border border-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/5"
                            >
                                <div className="mb-8 p-4 rounded-full bg-gradient-to-b from-white/10 to-transparent border border-white/5 text-white group-hover/card:scale-110 transition-transform duration-500">
                                    <feature.icon className="w-8 h-8 stroke-[1.5]" />
                                </div>
                                <h3 className="text-2xl font-medium mb-3 text-center tracking-tight">{feature.title}</h3>
                                <p className="text-white/50 text-center text-base font-light leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
