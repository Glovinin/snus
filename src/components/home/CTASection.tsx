"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTASection() {
    return (
        <section data-theme="dark" className="py-32 bg-foreground text-background relative overflow-hidden flex items-center justify-center">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/30 rounded-full blur-[100px]" />
            </div>

            <div className="container px-4 mx-auto text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-8xl font-bold tracking-tighter mb-8"
                >
                    Ready to switch?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-xl md:text-2xl text-background/70 max-w-2xl mx-auto mb-12"
                >
                    Join thousands of others who have upgraded their daily ritual.
                    Cleaner, discreet, and always premium.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <Button size="lg" className="h-16 px-10 rounded-full text-xl bg-background text-foreground hover:bg-background/90 transition-all group">
                        Get Started <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
