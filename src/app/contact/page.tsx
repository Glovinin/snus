"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setSending(false);
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] dark:bg-black flex flex-col">
            <Header />

            <main className="flex-1 pt-44 pb-20">
                <div className="container px-4 mx-auto max-w-7xl">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
                        <Link href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                            <Mail className="w-4 h-4" />
                            <span>Contact Us</span>
                        </span>
                    </nav>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                            Contact Us
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Have a question or need assistance? We're here to help. Reach out to us and we'll get back to you as soon as possible.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-8"
                        >
                            <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-8 border border-black/5 dark:border-white/5">
                                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Email</h3>
                                            <p className="text-muted-foreground">support@snusidea.com</p>
                                            <p className="text-muted-foreground">sales@snusidea.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Phone</h3>
                                            <p className="text-muted-foreground">+351 123 456 789</p>
                                            <p className="text-sm text-muted-foreground/70">Mon-Fri, 9am-6pm CET</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Address</h3>
                                            <p className="text-muted-foreground">Lisbon, Portugal</p>
                                            <p className="text-sm text-muted-foreground/70">European Union</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Business Hours</h3>
                                            <p className="text-muted-foreground">Monday - Friday: 9:00 - 18:00</p>
                                            <p className="text-muted-foreground">Saturday: 10:00 - 14:00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900/50 rounded-3xl p-8 border border-black/5 dark:border-white/5">
                                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

                                <div className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Name</label>
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Your name"
                                                required
                                                className="h-12 bg-neutral-100 dark:bg-zinc-800 border-0 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Email</label>
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="your@email.com"
                                                required
                                                className="h-12 bg-neutral-100 dark:bg-zinc-800 border-0 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Subject</label>
                                        <Input
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            placeholder="How can we help?"
                                            required
                                            className="h-12 bg-neutral-100 dark:bg-zinc-800 border-0 rounded-xl"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Message</label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Tell us more about your inquiry..."
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 bg-neutral-100 dark:bg-zinc-800 border-0 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={sending}
                                        className="w-full h-12 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 font-semibold"
                                    >
                                        {sending ? (
                                            "Sending..."
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
