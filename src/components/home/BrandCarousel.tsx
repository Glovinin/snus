"use client";

import { motion } from "framer-motion";

const brands = [
    "VELO", "LYFT", "ZYN", "ON!", "WHITE FOX", "SKRUF", "GENERAL", "EPOP", "LOOP", "KILLA", "PABLO", "SIBERIA"
];

export function BrandCarousel() {
    return (
        <section className="py-12 border-y border-foreground/5 bg-foreground/[0.02]">
            <div className="relative w-full overflow-hidden mask-linear-gradient">
                <div className="flex whitespace-nowrap">
                    <motion.div
                        className="flex gap-16 px-8"
                        animate={{ x: "-50%" }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 30,
                        }}
                    >
                        {[...brands, ...brands, ...brands].map((brand, index) => (
                            <div key={index} className="text-3xl md:text-4xl font-black text-foreground/10 uppercase tracking-widest select-none hover:text-foreground/30 transition-colors cursor-default">
                                {brand}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
