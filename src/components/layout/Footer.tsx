"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const footerLinks = {
    shop: [
        { name: "All Products", href: "#" },
        { name: "New Arrivals", href: "#" },
        { name: "Best Sellers", href: "#" },
        { name: "Accessories", href: "#" },
    ],
    support: [
        { name: "FAQ", href: "#" },
        { name: "Shipping & Returns", href: "#" },
        { name: "Contact Us", href: "#" },
        { name: "Track Order", href: "#" },
    ],
    company: [
        { name: "About Us", href: "#" },
        { name: "Sustainability", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
    ],
    legal: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
    ],
};

export function Footer() {
    const marqueeText = "ELEVATE YOUR EVERYDAY • DESIGNED FOR THE MODERN YOU • ";

    return (
        <footer className="bg-background border-t border-border/50 pt-20 pb-0 overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
                    <div className="col-span-2 lg:col-span-2">
                        <Link href="/" className="text-2xl font-bold tracking-tighter mb-6 block">
                            SnusIdea
                        </Link>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            Premium nicotine pouches with 8-30mg strength, crafted for the discerning modern user.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Placeholders */}
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground hover:text-background transition-colors cursor-pointer">
                                <span className="font-bold text-xs">IG</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground hover:text-background transition-colors cursor-pointer">
                                <span className="font-bold text-xs">TW</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-foreground hover:text-background transition-colors cursor-pointer">
                                <span className="font-bold text-xs">LI</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Shop</h4>
                        <ul className="space-y-4">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Support</h4>
                        <ul className="space-y-4">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Company</h4>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 pb-12">
                    <p className="text-sm text-muted-foreground">
                        &copy; 2024 SnusIdea Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {footerLinks.legal.map((link) => (
                            <Link key={link.name} href={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Infinite Marquee */}
            <div className="w-full py-8 bg-foreground text-background overflow-hidden">
                <motion.div
                    className="flex whitespace-nowrap"
                    animate={{ x: "-50%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30,
                    }}
                    style={{ width: "max-content" }}
                >
                    {[...Array(4)].map((_, i) => (
                        <span key={i} className="text-6xl md:text-8xl font-bold tracking-tighter px-8">
                            {marqueeText}
                        </span>
                    ))}
                </motion.div>
            </div>
        </footer>
    );
}
