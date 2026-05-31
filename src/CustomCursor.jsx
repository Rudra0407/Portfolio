import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    // Start the cursor off-screen so it doesn't flash in the corner on load
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const springX = useSpring(mouseX, { stiffness: 1000, damping: 40, mass: 0.1 });
    const springY = useSpring(mouseY, { stiffness: 1000, damping: 40, mass: 0.1 });

    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            const target = e.target;
            if (target.closest('a') || target.closest('button') || target.closest('input')) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        // Toggle visibility when the mouse leaves or enters the window
        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', updateMousePosition);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="fixed top-0 left-0 w-4 h-4 bg-green-400 rounded-full pointer-events-none z-[100] mix-blend-screen shadow-[0_0_10px_#4ade80]"
            style={{
                x: springX,
                y: springY,
                translateX: '-50%',
                translateY: '-50%'
            }}
            animate={{
                scale: isHovered ? 2.5 : 1,
                // Drop opacity to 0 if the mouse leaves the browser window
                opacity: isVisible ? (isHovered ? 0.3 : 1) : 0,
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
        />
    );
}