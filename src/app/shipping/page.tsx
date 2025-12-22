"use client";

import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ChevronRight, Home, Truck, Clock, MapPin, Package, CreditCard, ShieldCheck, Plane } from "lucide-react";
import Link from "next/link";

const SHIPPING_ZONES = [
    {
        zone: "Zone 1 - Western Europe",
        countries: "Portugal, Spain, France, Germany, Belgium, Netherlands, Luxembourg",
        standard: "3-5 business days",
        express: "1-2 business days",
        standardPrice: "€4.99",
        expressPrice: "€9.99",
        freeFrom: "€99"
    },
    {
        zone: "Zone 2 - Northern Europe",
        countries: "UK, Ireland, Denmark, Sweden, Norway, Finland",
        standard: "5-7 business days",
        express: "2-3 business days",
        standardPrice: "€6.99",
        expressPrice: "€12.99",
        freeFrom: "€99"
    },
    {
        zone: "Zone 3 - Southern & Eastern Europe",
        countries: "Italy, Greece, Poland, Austria, Czech Republic, Hungary",
        standard: "5-8 business days",
        express: "3-4 business days",
        standardPrice: "€7.99",
        expressPrice: "€14.99",
        freeFrom: "€99"
    }
];

const FEATURES = [
    {
        icon: Package,
        title: "Discreet Packaging",
        description: "All orders are shipped in plain, unmarked packaging for your privacy."
    },
    {
        icon: ShieldCheck,
        title: "Secure Shipping",
        description: "Every package is insured and tracked from our warehouse to your door."
    },
    {
        icon: Clock,
        title: "Fast Processing",
        description: "Orders placed before 2 PM CET are processed the same business day."
    },
    {
        icon: CreditCard,
        title: "Free Shipping",
        description: "Enjoy free standard shipping on all orders over €99."
    }
];

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">


            <main className="flex-1 pt-32 pb-20">
                <div className="container px-4 mx-auto max-w-7xl">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
                        <Link href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                            <Truck className="w-4 h-4" />
                            <span>Shipping Information</span>
                        </span>
                    </nav>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                            <Truck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                            Shipping Information
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Fast, reliable shipping across Europe. Find out everything you need to know about our delivery options.
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
                    >
                        {FEATURES.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="bg-white dark:bg-zinc-900/50 rounded-2xl p-6 border border-black/5 dark:border-white/5 text-center"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Shipping Zones */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-16"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Plane className="w-6 h-6" />
                            Shipping Zones & Rates
                        </h2>

                        <div className="space-y-4">
                            {SHIPPING_ZONES.map((zone) => (
                                <div
                                    key={zone.zone}
                                    className="bg-white dark:bg-zinc-900/50 rounded-3xl p-6 border border-black/5 dark:border-white/5"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg">{zone.zone}</h3>
                                            <p className="text-sm text-muted-foreground">{zone.countries}</p>
                                        </div>
                                        <div className="px-4 py-2 bg-green-100 dark:bg-green-500/10 rounded-full">
                                            <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                                Free shipping from {zone.freeFrom}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between p-4 bg-neutral-100 dark:bg-zinc-800 rounded-xl">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Standard Shipping</p>
                                                <p className="font-medium">{zone.standard}</p>
                                            </div>
                                            <span className="font-bold text-lg">{zone.standardPrice}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                                            <div>
                                                <p className="text-sm text-blue-600 dark:text-blue-400">Express Shipping</p>
                                                <p className="font-medium">{zone.express}</p>
                                            </div>
                                            <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{zone.expressPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Additional Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-zinc-900/50 rounded-3xl p-8 border border-black/5 dark:border-white/5"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <MapPin className="w-6 h-6" />
                            Important Information
                        </h2>

                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                <strong className="text-foreground">Order Processing:</strong> Orders placed before 2:00 PM CET on business days are typically processed and shipped the same day. Orders placed after this time or on weekends will be processed the next business day.
                            </p>
                            <p>
                                <strong className="text-foreground">Customs & Duties:</strong> For deliveries within the EU, there are no additional customs charges. For orders to non-EU countries (where available), customers may be responsible for import duties and taxes.
                            </p>
                            <p>
                                <strong className="text-foreground">Delivery Attempts:</strong> Our carriers will make up to 3 delivery attempts. If all attempts are unsuccessful, the package will be available for pickup at a local collection point.
                            </p>
                            <p>
                                <strong className="text-foreground">Age Verification:</strong> As we sell nicotine products, you may be required to show ID upon delivery to verify you are 18 years or older.
                            </p>
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 text-center"
                    >
                        <p className="text-muted-foreground mb-4">Have questions about shipping?</p>
                        <Link href="/contact">
                            <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:opacity-90 transition-opacity">
                                Contact Us
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
