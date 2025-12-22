"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Minimize2, Loader2, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

type Message = {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
};

const INITIAL_MESSAGES: Message[] = [
    {
        id: "1",
        text: "Hi there! 👋 Welcome to SnusIdea support.",
        sender: "bot",
        timestamp: new Date()
    },
    {
        id: "2",
        text: "How can I help you today?",
        sender: "bot",
        timestamp: new Date()
    }
];

const SUGGESTED_ACTIONS = [
    "Track my order",
    "Shipping info",
    "Product recommendation",
    "Talk to human"
];

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const [hasUnread, setHasUnread] = useState(true);
    const pathname = usePathname();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setHasUnread(false);
        }
    }, [isOpen, messages]);

    // Early return AFTER all hooks have been called
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        // User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            text: text,
            sender: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate Bot Response
        setTimeout(() => {
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: getBotResponse(text),
                sender: "bot",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const getBotResponse = (input: string): string => {
        const lower = input.toLowerCase();
        if (lower.includes("track") || lower.includes("order")) return "You can track your order in the 'My Account' section under 'Purchase History'. Would you like me to take you there?";
        if (lower.includes("shipping") || lower.includes("delivery")) return "We offer express shipping (1-2 days) and standard shipping (3-5 days). Free shipping on orders over €99!";
        if (lower.includes("human") || lower.includes("agent")) return "I'm connecting you with a live agent. Estimated wait time: 2 minutes.";
        if (lower.includes("hello") || lower.includes("hi")) return "Hello! ready to find your perfect snus?";
        return "Thanks for asking! Our support team will review your message and get back to you shortly.";
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-24 right-4 md:right-8 w-[90vw] md:w-[380px] h-[600px] max-h-[80vh] bg-[#0F0F0F]/95 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden z-[100]"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                                        <Bot className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#1a1a1a] rounded-full"></span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">SnusIdea Support</h3>
                                    <p className="text-[10px] text-white/50 flex items-center gap-1">
                                        <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                                        Online Now
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white/50 hover:text-white hover:bg-white/10" onClick={() => setIsOpen(false)}>
                                    <Minimize2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gradient-to-b from-transparent to-black/20">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${msg.sender === "user"
                                            ? "bg-white text-black rounded-tr-sm shadow-md font-medium"
                                            : "bg-white/10 text-white border border-white/5 rounded-tl-sm"
                                            }`}
                                    >
                                        {msg.text}
                                        <div className={`text-[9px] mt-1 opacity-50 ${msg.sender === "user" ? "text-black" : "text-white"}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 p-3 rounded-2xl rounded-tl-sm border border-white/5 flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                        <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                        <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/5 border-t border-white/5">
                            {/* Suggested Actions */}
                            <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
                                {SUGGESTED_ACTIONS.map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSendMessage(action)}
                                        className="whitespace-nowrap px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage(inputValue);
                                }}
                                className="relative flex items-center gap-2"
                            >
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-10 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                                    />
                                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                                        <Paperclip className="w-4 h-4" />
                                    </button>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    size="icon"
                                    className="rounded-full w-11 h-11 bg-white text-black hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:shadow-none transition-all"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-8 right-8 z-[90]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {!isOpen && hasUnread && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-[#1a1a1a] z-20 flex items-center justify-center text-white font-bold text-[10px] shadow-lg"
                    >
                        1
                    </motion.div>
                )}

                {/* Tooltip */}
                <AnimatePresence>
                    {isHovered && !isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-black px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap shadow-xl"
                        >
                            You have a new message!
                            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-[6px] border-transparent border-l-white"></div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 rounded-full bg-[#0F0F0F] hover:bg-black shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)] border border-white/10 p-0 overflow-hidden relative group transition-all"
                >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                            >
                                <X className="w-7 h-7 text-white" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                            >
                                <MessageCircle className="w-7 h-7 text-white fill-white/20" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>
            </motion.div>
        </>
    );
}
