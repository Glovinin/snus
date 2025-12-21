"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

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
        { name: "Admin Login", href: "/login" },
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
        <footer className="bg-black text-white border-t border-white/10 pt-20 pb-0 overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
                    <div className="col-span-2 lg:col-span-2">
                        <Link href="/" className="text-2xl font-bold tracking-tighter mb-6 block">
                            SnusIdea
                        </Link>
                        <p className="text-white/60 max-w-sm mb-6">
                            Premium nicotine pouches with 8-30mg strength, crafted for the discerning modern user.
                        </p>

                        {/* SSL Secure Badge */}
                        <div className="flex items-center gap-2 mb-6 p-3 bg-white/5 rounded-lg border border-white/10 w-fit">
                            <ShieldCheck className="w-5 h-5 text-green-400" />
                            <div>
                                <div className="text-sm font-semibold text-white">SSL Secured</div>
                                <div className="text-xs text-white/60">256-bit encryption</div>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-8">
                            {/* Social Placeholders */}
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                                <span className="font-bold text-xs text-white">IG</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                                <span className="font-bold text-xs text-white">TW</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                                <span className="font-bold text-xs text-white">LI</span>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div>
                            <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">We Accept</div>
                            <div className="flex flex-wrap gap-3">
                                {/* Payment Method Icons */}
                                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-white">VISA</span>
                                </div>
                                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-white">MC</span>
                                </div>
                                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-white">AMEX</span>
                                </div>
                                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-white">PayPal</span>
                                </div>
                                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-white">Apple Pay</span>
                                </div>
                                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-white">Google Pay</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6 text-white">Shop</h4>
                        <ul className="space-y-4">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white/60 hover:text-white transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6 text-white">Support</h4>
                        <ul className="space-y-4">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white/60 hover:text-white transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6 text-white">Company</h4>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white/60 hover:text-white transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 pb-12">
                    <p className="text-sm text-white/60">
                        &copy; 2024 SnusIdea Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {footerLinks.legal.map((link) => (
                            <Link key={link.name} href={link.href} className="text-xs text-white/60 hover:text-white transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Infinite Marquee */}
            <div className="w-full py-8 bg-white text-black overflow-hidden">
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
