"use client";

import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { MoveRight } from "lucide-react";

export function Hero() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);

    return (
        <section data-theme="light" className="relative h-screen flex flex-col items-center justify-center bg-background text-foreground overflow-hidden">

            {/* Animated Gradient Background */}
            <motion.div
                className="absolute inset-0 z-0 opacity-60"
                animate={{
                    background: [
                        "radial-gradient(ellipse at 20% 50%, rgba(236, 72, 153, 0.6), transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(16, 185, 129, 0.6), transparent 50%)",
                        "radial-gradient(ellipse at 80% 50%, rgba(16, 185, 129, 0.6), transparent 50%), radial-gradient(ellipse at 20% 50%, rgba(219, 39, 119, 0.6), transparent 50%)",
                        "radial-gradient(ellipse at 50% 20%, rgba(236, 72, 153, 0.6), transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(16, 185, 129, 0.6), transparent 50%)",
                        "radial-gradient(ellipse at 20% 50%, rgba(236, 72, 153, 0.6), transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(16, 185, 129, 0.6), transparent 50%)",
                    ]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Background Texture (Optional - keeping it for extra grain if needed, or removing if video is enough. User asked for video + overlay. Let's keep a subtle noise on top of the overlay for consistency with the rest of the site) */}
            <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-difference z-0" />

            <div className="container px-4 mx-auto relative z-10 flex flex-col items-center text-center">

                {/* Top Label */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8 overflow-hidden"
                >
                    <span className="inline-block text-sm md:text-base font-medium tracking-[0.2em] uppercase text-muted-foreground/80">
                        The New Standard
                    </span>
                </motion.div>

                {/* Main Content Wrapper with Parallax */}
                <motion.div
                    style={{ y }}
                    className="relative z-10 flex flex-col items-center"
                >
                    {/* Main Typography */}
                    <div className="relative mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 100, filter: "blur(20px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[12vw] leading-[0.85] font-bold tracking-tighter text-foreground select-none"
                        >
                            Designed
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 100, filter: "blur(20px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-center justify-center gap-4 md:gap-8"
                        >
                            <span className="text-3xl md:text-5xl font-light italic font-serif text-muted-foreground translate-y-[-1vw]">
                                for the
                            </span>
                            <motion.h1
                                className="text-[12vw] leading-[0.85] font-bold tracking-tighter select-none bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] via-[#ec4899] via-[#10b981] to-[#3b82f6] bg-[length:200%_auto] pb-4 pr-4"
                                animate={{
                                    backgroundPosition: ["0% center", "200% center"],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            >
                                senses.
                            </motion.h1>
                        </motion.div>
                    </div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto mb-12 font-light leading-relaxed"
                    >
                        The definitive global destination for premium nicotine pouches.
                    </motion.p>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center gap-6"
                    >
                        <Button size="lg" className="h-14 px-10 rounded-full text-lg bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl hover:scale-105 active:scale-95 group">
                            Shop Collection
                        </Button>
                        <Button variant="link" className="text-lg text-foreground hover:text-foreground/70 transition-colors group">
                            Read our story <MoveRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-foreground/20 to-transparent" />
            </motion.div>
        </section>
    );
}
