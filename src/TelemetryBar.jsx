import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

export default function TelemetryBar({ containerRef }) {
    const { scrollYProgress } = useScroll({ container: containerRef });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Derive a rounded percentage string as a motion value — no hook inside JSX
    const pct = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const pctLabel = useTransform(pct, v => `${Math.round(v)}%`);

    return (
        <div className="fixed right-8 top-1/4 bottom-1/4 w-1 bg-white/10 rounded-full z-40 hidden xl:flex flex-col items-center">

            {/* Top node */}
            <div className="w-3 h-3 rounded-full bg-white/20 absolute -top-4" />

            {/* Fill bar */}
            <motion.div
                className="w-full h-full bg-green-400 rounded-full origin-top shadow-[0_0_15px_#4ade80]"
                style={{ scaleY }}
            />

            {/* Bottom node — pulsing dot */}
            <div className="absolute -bottom-4">
                <motion.div
                    className="w-3 h-3 rounded-full bg-green-400"
                    animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            {/* Live scroll % — motion value drives the text directly */}
            <motion.div
                className="absolute -left-14 top-1/2 -translate-y-1/2 -rotate-90 text-xs tracking-widest text-green-400/70 font-mono tabular-nums"
            >
                <motion.span>{pctLabel}</motion.span>
            </motion.div>

            {/* Static label */}
            <div className="absolute -left-16 bottom-0 -rotate-90 text-[10px] tracking-[0.2em] text-gray-600 font-mono whitespace-nowrap">
                SCROLL
            </div>
        </div>
    );
}