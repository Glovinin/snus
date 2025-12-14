"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Marco P.",
        role: "Verified Buyer, Madrid",
        text: "Best selection of nicotine pouches I've found online. Delivery to Spain was surprisingly fast and the packaging was perfect.",
        rating: 5
    },
    {
        name: "Emma L.",
        role: "Verified Buyer, London",
        text: "I love the huge variety of flavors available here. The website is beautiful and super easy to navigate. Highly recommended!",
        rating: 5
    },
    {
        name: "Lars J.",
        role: "Verified Buyer, Copenhagen",
        text: "Unbeatable prices and great customer service. My order arrived in 2 days. Finally a reliable place to stock up.",
        rating: 5
    }
];

export function Testimonials() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container px-4 mx-auto md:max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-semibold tracking-tighter mb-4">Trusted by the community</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-secondary/30 p-8 rounded-3xl border border-border/50"
                        >
                            <div className="flex gap-1 mb-4 text-yellow-500">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-lg font-light mb-6 leading-relaxed">"{t.text}"</p>
                            <div>
                                <div className="font-bold">{t.name}</div>
                                <div className="text-sm text-muted-foreground">{t.role}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
