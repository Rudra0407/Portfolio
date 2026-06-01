import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CURSOR_STATES = {
    default: {
        dotScale: 1,
        ringScale: 1,
        ringOpacity: 0.6,
        dotOpacity: 1,
        ringColor: '#4ade80',
        dotColor: '#4ade80',
    },
    hover: {
        dotScale: 0,
        ringScale: 2.2,
        ringOpacity: 0.9,
        dotOpacity: 0,
        ringColor: '#22d3ee',
        dotColor: '#22d3ee',
    },
    click: {
        dotScale: 3,
        ringScale: 0.6,
        ringOpacity: 1,
        dotOpacity: 0.8,
        ringColor: '#a78bfa',
        dotColor: '#a78bfa',
    },
    input: {
        dotScale: 0.3,
        ringScale: 0.5,
        ringOpacity: 0.4,
        dotOpacity: 0.6,
        ringColor: '#4ade80',
        dotColor: '#4ade80',
    },
};

export default function CustomCursor() {
    const mouseX = useMotionValue(-200);
    const mouseY = useMotionValue(-200);

    // Dot follows instantly
    const dotX = useSpring(mouseX, { stiffness: 2000, damping: 60, mass: 0.05 });
    const dotY = useSpring(mouseY, { stiffness: 2000, damping: 60, mass: 0.05 });

    // Ring lags behind for a trailing feel
    const ringX = useSpring(mouseX, { stiffness: 300, damping: 35, mass: 0.3 });
    const ringY = useSpring(mouseY, { stiffness: 300, damping: 35, mass: 0.3 });

    const [cursorState, setCursorState] = useState('default');
    const [isVisible, setIsVisible] = useState(false);
    const [trail, setTrail] = useState([]);
    const trailRef = useRef([]);
    const frameRef = useRef(null);
    const posRef = useRef({ x: -200, y: -200 });

    useEffect(() => {
        // Trail animation loop
        const animateTrail = () => {
            trailRef.current = trailRef.current
                .map(p => ({ ...p, opacity: p.opacity - 0.06, scale: p.scale - 0.03 }))
                .filter(p => p.opacity > 0);
            setTrail([...trailRef.current]);
            frameRef.current = requestAnimationFrame(animateTrail);
        };
        frameRef.current = requestAnimationFrame(animateTrail);
        return () => cancelAnimationFrame(frameRef.current);
    }, []);

    useEffect(() => {
        const onMove = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            mouseX.set(x);
            mouseY.set(y);
            posRef.current = { x, y };

            // Spawn trail particle
            trailRef.current.push({ x, y, opacity: 0.35, scale: 0.5, id: Date.now() + Math.random() });
            if (trailRef.current.length > 12) trailRef.current.shift();

            const target = e.target;
            if (target.closest('input') || target.closest('textarea')) {
                setCursorState('input');
            } else if (target.closest('a') || target.closest('button') || target.closest('[role="button"]')) {
                setCursorState('hover');
            } else {
                setCursorState('default');
            }
        };

        const onMouseDown = () => setCursorState('click');
        const onMouseUp = (e) => {
            const target = e.target;
            if (target.closest('a') || target.closest('button')) {
                setCursorState('hover');
            } else {
                setCursorState('default');
            }
        };

        const onEnter = () => setIsVisible(true);
        const onLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mouseenter', onEnter);
        document.addEventListener('mouseleave', onLeave);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mouseenter', onEnter);
            document.removeEventListener('mouseleave', onLeave);
        };
    }, [mouseX, mouseY]);

    const state = CURSOR_STATES[cursorState];

    return (
        <>
            {/* Trail particles */}
            {trail.map((p) => (
                <div
                    key={p.id}
                    className="fixed top-0 left-0 pointer-events-none z-[98] rounded-full"
                    style={{
                        width: 6,
                        height: 6,
                        transform: `translate(${p.x - 3}px, ${p.y - 3}px) scale(${p.scale})`,
                        opacity: p.opacity,
                        background: 'radial-gradient(circle, #4ade80, #22d3ee)',
                        boxShadow: '0 0 6px #4ade80',
                    }}
                />
            ))}

            {/* Outer ring — lags behind */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[99] rounded-full border-2"
                style={{
                    width: 36,
                    height: 36,
                    x: ringX,
                    y: ringY,
                    translateX: '-50%',
                    translateY: '-50%',
                    borderColor: state.ringColor,
                    boxShadow: `0 0 12px ${state.ringColor}60`,
                }}
                animate={{
                    scale: state.ringScale,
                    opacity: isVisible ? state.ringOpacity : 0,
                    borderColor: state.ringColor,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            />

            {/* Inner dot — snappy */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[100] rounded-full"
                style={{
                    width: 8,
                    height: 8,
                    x: dotX,
                    y: dotY,
                    translateX: '-50%',
                    translateY: '-50%',
                    background: `radial-gradient(circle, white, ${state.dotColor})`,
                    boxShadow: `0 0 10px ${state.dotColor}, 0 0 20px ${state.dotColor}80`,
                }}
                animate={{
                    scale: state.dotScale,
                    opacity: isVisible ? state.dotOpacity : 0,
                }}
                transition={{ duration: 0.12, ease: 'easeOut' }}
            />
        </>
    );
}