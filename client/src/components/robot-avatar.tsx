import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function RobotAvatar({ className = "w-12 h-12", isThinking = false }: { className?: string; isThinking?: boolean }) {
    const [isWinking, setIsWinking] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        // Random wink effect only when not hovering
        const blinkInterval = setInterval(() => {
            if (!isHovered && Math.random() > 0.7) {
                setIsWinking(true);
                setTimeout(() => setIsWinking(false), 200);
            }
        }, 4000);

        return () => clearInterval(blinkInterval);
    }, [isHovered]);

    return (
        <div
            className={`${className} relative flex items-center justify-center cursor-pointer`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                animate={isHovered ? { y: -2, scale: 1.05 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-full h-full"
            >
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full drop-shadow-xl"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Soft Glow */}
                    <circle cx="50" cy="50" r="48" className="fill-primary/20 blur-md transition-all duration-500" />

                    {/* Head Shape - Cuter & Rounder */}
                    <rect
                        x="10" y="15" width="80" height="70" rx="25"
                        stroke="currentColor" strokeWidth="2"
                        className="fill-white dark:fill-slate-200 text-primary"
                    />

                    {/* Screen / Face Area */}
                    <rect x="20" y="28" width="60" height="45" rx="15" className="fill-slate-900" />

                    {/* Eyes Container */}
                    <g transform="translate(0, 5)">
                        {/* Left Eye */}
                        <motion.ellipse
                            cx="38"
                            cy="48"
                            rx={isHovered ? 7 : 6}
                            ry={isHovered ? 4 : 8} // Squint when happy
                            className="fill-cyan-400"
                            animate={isThinking ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                        />

                        {/* Right Eye */}
                        <motion.ellipse
                            cx="62"
                            cy="48"
                            rx={isHovered ? 7 : 6}
                            ry={isHovered ? 4 : (isWinking ? 1 : 8)}
                            className="fill-cyan-400"
                        />

                        {/* Eye Sparkles (Cute factor - hide when squinting/winking) */}
                        {!isHovered && !isWinking && !isThinking && (
                            <>
                                <circle cx="40" cy="44" r="2" fill="white" />
                                <circle cx="64" cy="44" r="2" fill="white" />
                            </>
                        )}
                    </g>

                    {/* Cheeks (Appear on hover) */}
                    <motion.circle
                        cx="28" cy="58" r="4"
                        className="fill-pink-400/50 blur-[1px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                    />
                    <motion.circle
                        cx="72" cy="58" r="4"
                        className="fill-pink-400/50 blur-[1px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                    />

                    {/* Mouth */}
                    <motion.path
                        d="M 40 65 Q 50 65 60 65" // Neutral
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="text-cyan-400"
                        animate={{
                            d: isHovered
                                ? "M 38 62 Q 50 72 62 62" // Happy Smile
                                : isThinking
                                    ? "M 42 65 Q 50 60 58 65" // Ooo mouth
                                    : "M 40 65 Q 50 68 60 65" // Small smile
                        }}
                    />

                    {/* Antenna */}
                    <line x1="50" y1="15" x2="50" y2="5" stroke="currentColor" strokeWidth="3" className="text-primary" />
                    <motion.circle
                        cx="50"
                        cy="5"
                        r="6"
                        className={isThinking ? "fill-yellow-400" : (isHovered ? "fill-green-400" : "fill-red-400")}
                        animate={isThinking ? { scale: [1, 1.2, 1] } : {}}
                        initial={{ scale: 1 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    />
                </svg>
            </motion.div>
        </div>
    );
}
