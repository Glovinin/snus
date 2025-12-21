"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Home, HelpCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

const FAQ_DATA = [
    {
        category: "Orders & Shipping",
        questions: [
            {
                question: "How long does shipping take?",
                answer: "Standard shipping within the EU typically takes 3-7 business days. Express shipping is available for faster delivery (1-3 business days). Shipping times may vary depending on your location and customs processing."
            },
            {
                question: "Do you ship internationally?",
                answer: "Yes, we ship to most countries within the European Union. Due to regulations, we cannot ship nicotine products to countries where they are prohibited. Please check your local laws before ordering."
            },
            {
                question: "How can I track my order?",
                answer: "Once your order is shipped, you'll receive an email with a tracking number. You can use this number on our Track My Order page or directly on the carrier's website to monitor your delivery."
            },
            {
                question: "What are the shipping costs?",
                answer: "We offer free shipping on orders over €99. For orders under this amount, shipping costs are calculated at checkout based on your location and chosen delivery method."
            }
        ]
    },
    {
        category: "Products",
        questions: [
            {
                question: "What is the difference between nicotine pouches and snus?",
                answer: "Nicotine pouches are tobacco-free products that contain nicotine, while traditional snus contains tobacco. Both are placed under the lip, but nicotine pouches offer a cleaner experience without tobacco-related staining."
            },
            {
                question: "How do I choose the right strength?",
                answer: "We categorize our products by strength: WEAK (0-8mg), MEDIUM (9-16mg), STRONG (17-32mg), EXTRA (32-60mg), and EXTREME (+60mg). Beginners should start with WEAK or MEDIUM strengths."
            },
            {
                question: "How should I store nicotine pouches?",
                answer: "Store your pouches in a cool, dry place away from direct sunlight. Refrigeration can extend freshness but isn't required. Always keep products away from children and pets."
            },
            {
                question: "How long do pouches stay fresh?",
                answer: "Unopened pouches typically stay fresh for 6-12 months from the production date. Once opened, we recommend using them within 1-2 weeks for the best experience."
            }
        ]
    },
    {
        category: "Payment & Security",
        questions: [
            {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for select countries."
            },
            {
                question: "Is my payment information secure?",
                answer: "Absolutely. We use industry-standard SSL encryption and never store your complete payment details on our servers. All transactions are processed through secure, PCI-compliant payment gateways."
            },
            {
                question: "Can I get a refund?",
                answer: "Due to the nature of our products, we can only accept returns for unopened, undamaged items within 14 days of delivery. Please contact our support team to initiate a return."
            }
        ]
    },
    {
        category: "Account & Support",
        questions: [
            {
                question: "How do I create an account?",
                answer: "Click on the user icon in the header and select 'Create Account'. You'll need to provide your email, create a password, and verify your age (18+ required to purchase nicotine products)."
            },
            {
                question: "How can I contact customer support?",
                answer: "You can reach us via email at support@snusidea.com, through our contact form, or use our live chat during business hours (Mon-Fri, 9am-6pm CET)."
            },
            {
                question: "I forgot my password. What should I do?",
                answer: "Click on 'Login' and then 'Forgot Password'. Enter your email address and we'll send you instructions to reset your password."
            }
        ]
    }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-black/5 dark:border-white/5 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-5 text-left group"
            >
                <span className="font-medium pr-4 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {question}
                </span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-muted-foreground leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FAQsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFAQs = FAQ_DATA.map(category => ({
        ...category,
        questions: category.questions.filter(
            q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <div className="min-h-screen bg-[#F5F5F7] dark:bg-black flex flex-col">
            <Header />

            <main className="flex-1 pt-32 pb-20">
                <div className="container px-4 mx-auto max-w-4xl">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
                        <Link href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                        <span className="font-medium text-foreground">FAQs</span>
                    </nav>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
                            <HelpCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Find answers to the most common questions about our products, shipping, and more.
                        </p>
                    </motion.div>

                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-12"
                    >
                        <div className="relative max-w-md mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search questions..."
                                className="h-14 pl-12 bg-white dark:bg-zinc-900/50 border-black/5 dark:border-white/5 rounded-2xl text-base"
                            />
                        </div>
                    </motion.div>

                    {/* FAQ Categories */}
                    <div className="space-y-8">
                        {filteredFAQs.map((category, index) => (
                            <motion.div
                                key={category.category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                                className="bg-white dark:bg-zinc-900/50 rounded-3xl p-6 md:p-8 border border-black/5 dark:border-white/5"
                            >
                                <h2 className="text-xl font-bold mb-4">{category.category}</h2>
                                <div>
                                    {category.questions.map((faq) => (
                                        <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
                                    ))}
                                </div>
                            </motion.div>
                        ))}

                        {filteredFAQs.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>No questions found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>

                    {/* Still need help? */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12 text-center bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl p-8 border border-black/5 dark:border-white/5"
                    >
                        <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                        <p className="text-muted-foreground mb-4">Can't find what you're looking for? Our support team is here to help.</p>
                        <Link href="/contact">
                            <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:opacity-90 transition-opacity">
                                Contact Support
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
