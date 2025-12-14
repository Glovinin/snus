"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function CursorFollower() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 150 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        window.addEventListener("mousemove", moveCursor);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
        };
    }, [cursorX, cursorY]);

    return (
        <>
            {/* Main Cursor - Liquid Blob */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="relative -translate-x-1/2 -translate-y-1/2"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {/* Outer Glow */}
                    <div className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 via-emerald-500 to-pink-500 blur-xl opacity-60" />

                    {/* Inner Core */}
                    <motion.div
                        className="relative w-6 h-6 rounded-full bg-white"
                        animate={{
                            scale: [1, 0.8, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
            </motion.div>

            {/* Trail Effect - Multiple Delayed Circles */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-screen"
                    style={{
                        x: cursorXSpring,
                        y: cursorYSpring,
                    }}
                    transition={{
                        type: "spring",
                        damping: 25 - i * 5,
                        stiffness: 150 - i * 30,
                    }}
                >
                    <div
                        className="relative -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{
                            width: `${(i + 1) * 8}px`,
                            height: `${(i + 1) * 8}px`,
                            background: i % 2 === 0
                                ? "rgba(236, 72, 153, 0.2)"
                                : "rgba(16, 185, 129, 0.2)",
                        }}
                    />
                </motion.div>
            ))}
        </>
    );
}
