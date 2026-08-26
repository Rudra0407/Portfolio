import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    Briefcase, ExternalLink, Dumbbell, Terminal as TerminalIcon,
    Mail, Phone, MapPin, ChevronDown, ArrowUpRight, Cpu, Server, Layers, Code2
} from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import Terminal from './Terminal';
import TelemetryBar from './TelemetryBar';

// ─── Scroll-triggered fade-in wrapper ────────────────────────────────────────
const FadeIn = ({ children, delay = 0, className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// ─── Numbered section header ──────────────────────────────────────────────────
const SectionHeader = ({ number, title }) => (
    <div className="flex items-baseline gap-4 mb-12 pb-5 border-b border-green-400/[0.12]">
        <span className="font-mono text-green-400/60 text-xs tracking-[0.25em] tabular-nums select-none">{number}</span>
        <h3 className="text-3xl font-bold tracking-tight">{title}</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-green-400/[0.15] via-white/[0.04] to-transparent" />
    </div>
);

// ─── Social pill link ─────────────────────────────────────────────────────────
const SocialLink = ({ href, label, Icon }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="group flex items-center gap-2 px-5 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-green-400 hover:text-black hover:border-transparent hover:shadow-[0_0_18px_rgba(74,222,128,0.35)] transition-all duration-200 text-sm font-medium backdrop-blur-sm"
    >
        <Icon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
        {label}
    </motion.a>
);

// ─── Skill pill tag ───────────────────────────────────────────────────────────
const SkillTag = ({ name }) => (
    <span className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-md text-xs text-gray-400 font-mono tracking-wider
                     hover:border-green-400/40 hover:text-green-300 hover:bg-green-400/[0.06] transition-all duration-200 cursor-default">
        {name}
    </span>
);

// ─── Timeline experience card ─────────────────────────────────────────────────
const ExperienceCard = ({ featured = false, title, role, period, bullets, cta }) => (
    <div className={`group relative pl-6 transition-colors duration-300 ${featured ? 'border-l-2 border-green-400/60 hover:border-green-400' : 'border-l-2 border-white/[0.1] hover:border-white/25'}`}>
        {/* Timeline dot */}
        <div className={`absolute -left-[5px] top-7 w-2 h-2 rounded-full transition-all duration-300 ${featured
            ? 'bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]'
            : 'bg-white/30 group-hover:bg-white/60'
            }`} />
        <div className={`p-7 rounded-2xl border transition-all duration-300 ${featured
            ? 'bg-white/[0.04] hover:bg-white/[0.07] border-white/[0.08] hover:border-green-400/25'
            : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.06] hover:border-white/15'
            }`}>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                <div>
                    {featured && (
                        <span className="inline-block px-2 py-0.5 bg-green-400/10 border border-green-400/20 rounded text-green-400 text-[10px] font-mono tracking-wider uppercase mb-2">
                            Featured
                        </span>
                    )}
                    <h4 className={`font-bold mt-1 ${featured ? 'text-2xl' : 'text-xl'}`}>{title}</h4>
                    <p className={`text-sm font-mono mt-1 tracking-wide ${featured ? 'text-green-400' : 'text-gray-400'}`}>{role} · {period}</p>
                </div>
                {cta && (
                    <motion.a href={cta.href} target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        className="inline-flex items-center gap-2 bg-green-400 text-black px-5 py-2.5 rounded-full text-sm font-bold
                                   shadow-[0_0_15px_rgba(74,222,128,0.25)] hover:shadow-[0_0_25px_rgba(74,222,128,0.45)]
                                   transition-all whitespace-nowrap shrink-0"
                    >
                        {cta.label} <ArrowUpRight className="w-4 h-4" />
                    </motion.a>
                )}
            </div>
            <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
                {bullets.map((b, i) => (
                    <li key={i} className="flex gap-2.5">
                        <span className={`shrink-0 mt-0.5 ${featured ? 'text-green-400/75' : 'text-white/20'}`}>▸</span>
                        <span dangerouslySetInnerHTML={{ __html: b }} />
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

// ─── Navigation config ────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'iteration', label: 'Discipline' },
    { id: 'education', label: 'Arsenal' },
    { id: 'contact', label: 'Contact' },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function Overlay() {
    const scrollRef = useRef(null);
    const [activeSection, setActiveSection] = useState('');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        const handleScroll = () => {
            setScrolled(container.scrollTop > 70);
            let current = '';
            NAV_ITEMS.forEach(({ id }) => {
                const el = document.getElementById(id);
                if (el && el.offsetTop - 140 <= container.scrollTop) current = id;
            });
            setActiveSection(current);
        };
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el && scrollRef.current)
            scrollRef.current.scrollTo({ top: el.offsetTop - 88, behavior: 'smooth' });
    };

    return (
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto z-10 terminal-scroll">
            {/* Scanline overlay — very subtle CRT/monitor texture for the mission-control feel */}
            <div
                className="pointer-events-none fixed inset-0 z-[8]"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(0deg, rgba(0,0,0,0.025) 0px, rgba(0,0,0,0.025) 1px, transparent 1px, transparent 4px)',
                }}
            />
            <TelemetryBar containerRef={scrollRef} />

            {/* ── Floating sticky nav ─────────────────────────────────────── */}
            <motion.nav
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-400 ${scrolled ? 'pt-4' : 'pt-6'}`}
            >
                <div className={`flex items-center gap-1 px-2 py-1.5 rounded-full border backdrop-blur-xl transition-all duration-300 ${scrolled
                    ? 'border-white/15 bg-black/70 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
                    : 'border-white/[0.08] bg-white/[0.04]'
                    }`}>
                    {NAV_ITEMS.map(({ id, label }) => (
                        <button key={id} onClick={() => scrollTo(id)}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-medium tracking-widest uppercase transition-all duration-200 ${activeSection === id
                                ? 'bg-green-400 text-black shadow-[0_0_10px_rgba(74,222,128,0.35)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </motion.nav>

            <main className="max-w-5xl mx-auto px-6 flex flex-col gap-28 pb-24 pt-20">

                {/* ── Hero ───────────────────────────────────────────────── */}
                <section className="min-h-[92vh] flex flex-col md:flex-row items-center justify-between gap-12 pt-16">
                    <div className="flex-1 flex flex-col justify-center">

                        {/* Status pill */}
                        <motion.div
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center gap-2.5 mb-7 w-fit"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                            </span>
                            <span className="text-[11px] font-mono text-green-400/70 tracking-[0.22em] uppercase">
                                Available · Tempe, AZ
                            </span>
                        </motion.div>

                        {/* Name */}
                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="text-[clamp(3.2rem,9vw,5.8rem)] font-bold tracking-tighter leading-[0.88] mb-7"
                            style={{ textShadow: '0 0 80px rgba(74,222,128,0.18), 0 0 160px rgba(74,222,128,0.08)' }}
                        >
                            Rudra<br />Pathak
                        </motion.h1>

                        {/* Role line */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.45, duration: 0.8 }}
                            className="flex items-center gap-3 mb-5"
                        >
                            <div className="h-px w-12 bg-green-400 shrink-0 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                            <p className="text-green-400 font-mono text-sm tracking-widest uppercase">
                                Software Engineer
                            </p>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.72, duration: 0.9 }}
                            className="text-gray-400 text-[1.05rem] leading-relaxed max-w-md"
                        >
                            Building distributed AI infrastructure and ML systems at scale.
                            Summa Cum Laude, B.S. Computer Science — ASU '26.
                        </motion.p>

                        {/* Compact stat strip */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            className="flex gap-8 mt-6"
                        >
                            {[
                                { value: '3.88', label: 'GPA' },
                                { value: '3+', label: 'Roles' },
                                //{ value: '4', label: 'Projects' },
                            ].map(({ value, label }) => (
                                <div key={label} className="flex flex-col">
                                    <span className="text-white font-bold text-xl leading-none tracking-tight">{value}</span>
                                    <span className="text-gray-600 text-[10px] font-mono tracking-[0.18em] uppercase mt-1">{label}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* Social links */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.05, duration: 0.8 }}
                            className="mt-9 flex flex-wrap gap-3"
                        >
                            <SocialLink href="https://www.linkedin.com/in/rudra0407/" label="LinkedIn" Icon={FaLinkedin} />
                            <SocialLink href="https://github.com/Rudra0407" label="GitHub" Icon={FaGithub} />
                            <SocialLink href="https://app.joinhandshake.com/profiles/rudra0407" label="Handshake" Icon={Briefcase} />
                        </motion.div>

                        {/* Scroll hint */}
                        <motion.button
                            onClick={() => scrollTo('experience')}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ delay: 1.9 }}
                            className="mt-16 flex items-center gap-2 text-[11px] text-gray-600 hover:text-gray-300 transition-colors w-fit group"
                        >
                            <ChevronDown className="w-4 h-4 animate-bounce" />
                            <span className="font-mono tracking-[0.2em] uppercase">Scroll to explore</span>
                        </motion.button>
                    </div>

                    {/* Profile image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.93, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.95, duration: 1.2, ease: 'easeOut' }}
                        className="w-72 md:w-80 shrink-0 relative"
                    >
                        {/* Subtle glow ring */}
                        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-green-400/35 via-green-400/5 to-transparent" />
                        <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-[0_0_50px_rgba(74,222,128,0.1)] group">
                            <img
                                src="/IMG-20260515-WA0030.jpg"
                                alt="Rudra Pathak"
                                className="object-cover w-full h-[460px] transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                            {/* Credential overlay */}
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="bg-black/55 backdrop-blur-md border border-white/12 rounded-xl px-4 py-3">
                                    <p className="text-[10px] text-green-400 font-mono tracking-[0.18em] uppercase mb-0.5">
                                        Arizona State University '26
                                    </p>
                                    <p className="text-white text-sm font-semibold">B.S. Computer Science · 3.90 GPA</p>
                                    <p className="text-gray-400 text-xs mt-0.5">Summa Cum Laude · Dean's List</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* ── Experience ─────────────────────────────────────────── */}
                <section id="experience">
                    <FadeIn><SectionHeader number="01" title="Experience" /></FadeIn>
                    <div className="flex flex-col gap-5">
                        <FadeIn delay={0.1}>
                            <ExperienceCard
                                featured
                                title="ASU / NASA Psyche Mission"
                                role="Mobile & Responsive Design Lead"
                                period="Fall 2025 – Spring 2026"
                                cta={{ href: 'https://missiontopsyche-platinum.github.io/platinum_14a_3d_show-cs/', label: 'View 3D Show' }}
                                bullets={[
                                    'Engineered a responsive, scroll-driven React application layered over a Three.js WebGL canvas.',
                                    'Built a hardware-accelerated auto-scroll feature using <code class="text-green-400/80 bg-green-400/[0.08] px-1 py-0.5 rounded text-xs font-mono">requestAnimationFrame</code>.',
                                    'Overhauled responsiveness with fluid Flexbox layouts and CSS <code class="text-green-400/80 bg-green-400/[0.08] px-1 py-0.5 rounded text-xs font-mono">clamp()</code> functions.',
                                ]}
                            />
                        </FadeIn>
                        <FadeIn delay={0.15}>
                            <ExperienceCard
                                title="Glynac AI (Greentree Group)"
                                role="Software Engineering Intern"
                                period="May 2025 – Aug 2025"
                                bullets={[
                                    'Engineered responsive front-end architecture for an enterprise AI platform in TypeScript, React, and Tailwind CSS.',
                                    'Refactored legacy code improving Core Web Vitals with measurable rendering speed gains.',
                                ]}
                            />
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <ExperienceCard
                                title="Arizona State University"
                                role="Writing Tutor"
                                period="Oct 2024 – Present"
                                bullets={[
                                    'Mentored students in technical and academic writing through one-on-one coaching sessions.',
                                    'Improved structural clarity and professional communication in technical documentation and project reports.',
                                ]}
                            />
                        </FadeIn>
                    </div>
                </section>

                {/* ── Projects ───────────────────────────────────────────── */}
                <section id="projects">
                    <FadeIn><SectionHeader number="02" title="Technical Projects" /></FadeIn>

                    {/* Featured: rAIn Orchestrator */}
                    <FadeIn delay={0.1}>
                        <div className="relative rounded-3xl overflow-hidden mb-7 group">
                            {/* Ambient glows */}
                            <div className="absolute top-0 right-0 w-[380px] h-[380px] bg-green-500/[0.05] blur-[80px] rounded-full pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-[260px] h-[260px] bg-green-500/[0.03] blur-[60px] rounded-full pointer-events-none" />

                            <div className="relative border border-white/[0.08] hover:border-green-400/20 transition-colors duration-500
                                            rounded-3xl bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent
                                            p-8 md:p-10 backdrop-blur-sm">

                                {/* Terminal window chrome */}
                                <div className="flex items-center gap-2 mb-7">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                    </div>
                                    <span className="font-mono text-[11px] text-gray-600 ml-2 select-none">
                                        rain-orchestrator ~/projects/featured
                                    </span>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 mb-5">
                                    <div>
                                        <h4 className="text-3xl font-bold mb-1">rAIn Orchestrator</h4>
                                        <p className="text-green-400 font-mono text-sm tracking-wide">AI Infrastructure & Platform Engineering</p>
                                    </div>
                                    <motion.a
                                        href="https://github.com/Rudra0407/AI-Cloud-Orchestrator.git"
                                        target="_blank" rel="noopener noreferrer"
                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                        className="inline-flex items-center gap-2 bg-white/[0.08] hover:bg-white/15 text-white
                                                   px-5 py-2.5 rounded-full text-sm font-bold transition-all border border-white/15 whitespace-nowrap shrink-0"
                                    >
                                        <FaGithub className="w-4 h-4" /> View Repository
                                    </motion.a>
                                </div>

                                {/* System feature badges */}
                                <div className="flex flex-wrap gap-2.5 mb-6">
                                    {[
                                        { Icon: Server, label: 'Intelligent Routing', sub: 'round-robin · weighted · least-latency' },
                                        { Icon: Cpu, label: 'Autoscaling', sub: 'CPU threshold-based' },
                                        { Icon: Layers, label: 'Rate Limiting', sub: 'Redis-backed' },
                                    ].map(({ Icon, label, sub }) => (
                                        <div key={label} className="flex items-center gap-2.5 px-3.5 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl">
                                            <Icon className="w-3.5 h-3.5 text-green-400/60 shrink-0" strokeWidth={1.5} />
                                            <div>
                                                <p className="text-white text-xs font-semibold leading-none mb-0.5">{label}</p>
                                                <p className="text-gray-500 text-[10px] font-mono">{sub}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-gray-300 leading-relaxed text-sm mb-6 max-w-3xl">
                                    A full-stack AI infrastructure platform demonstrating production-grade ML systems engineering.
                                    Provides a complete environment for deploying, routing, monitoring, and scaling open-source LLMs locally —
                                    featuring real-time latency tracking, Redis-based rate limiting, and a background autoscaling service.
                                </p>

                                {/* Tech stack */}
                                <div className="flex flex-wrap gap-1.5 mb-8">
                                    {['Python', 'FastAPI', 'React', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'Ollama'].map(tech => (
                                        <span key={tech} className="px-2.5 py-1 bg-green-400/[0.05] border border-green-400/15 rounded-md text-[11px] text-green-300/70 font-mono tracking-wider">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Screenshot gallery */}
                                <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory terminal-scroll">
                                    {[
                                        '/Screenshot 2026-06-04 114258.png',
                                        '/Screenshot 2026-06-04 114313.png',
                                        '/Screenshot 2026-06-04 114324.png',
                                        '/Screenshot 2026-06-04 114554.png',
                                        '/Screenshot 2026-06-04 114619.png',
                                    ].map((src, idx) => (
                                        <img
                                            key={idx}
                                            src={src}
                                            alt={`rAIn Orchestrator screenshot ${idx + 1}`}
                                            className="w-[85%] md:w-[55%] lg:w-[42%] h-auto object-cover rounded-xl border border-white/[0.08]
                                                       snap-center shrink-0 hover:border-green-400/40 transition-colors duration-300"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Secondary projects */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <FadeIn delay={0.2}>
                            <div className="group h-full bg-white/[0.03] hover:bg-white/[0.06] p-7 rounded-2xl border border-white/[0.07]
                                            hover:border-white/15 transition-all duration-300 flex flex-col">
                                <Code2 className="w-5 h-5 text-green-400/40 mb-4" strokeWidth={1.5} />
                                <h4 className="text-lg font-bold mb-1.5">Mini Cloud Infrastructure Platform</h4>
                                <p className="text-[11px] text-green-400/60 font-mono tracking-wider mb-4">Python · Terraform · Docker · Nginx</p>
                                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                                    Architected a lightweight cloud platform automating container provisioning and VPC-like network isolation,
                                    with a load-balanced traffic router enabling zero-downtime rolling deployments.
                                </p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.25}>
                            <div className="group h-full bg-white/[0.03] hover:bg-white/[0.06] p-7 rounded-2xl border border-white/[0.07]
                                            hover:border-white/15 transition-all duration-300 flex flex-col">
                                <Server className="w-5 h-5 text-green-400/40 mb-4" strokeWidth={1.5} />
                                <h4 className="text-lg font-bold mb-1.5">Distributed Storage System</h4>
                                <p className="text-[11px] text-green-400/60 font-mono tracking-wider mb-4">Python · TCP/IP · RAID-5</p>
                                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                                    Networked storage solution using Socket Programming with RAID-5 distributed parity logic
                                    and a multi-threaded I/O scheduler for optimized throughput.
                                </p>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                {/* ── Discipline of Iteration ────────────────────────────── */}
                <section id="iteration">
                    <FadeIn><SectionHeader number="03" title="The Discipline of Iteration" /></FadeIn>
                    <FadeIn delay={0.1}>
                        <div className="relative rounded-3xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.04] via-transparent to-transparent pointer-events-none" />
                            <div className="relative border border-white/[0.08] rounded-3xl p-8 md:p-12 backdrop-blur-sm flex flex-col gap-10">

                                {/* Two-column personal narrative */}
                                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                                    <div className="flex-1 space-y-3">
                                        <Dumbbell className="w-6 h-6 text-green-400/45 mb-1" strokeWidth={1.5} />
                                        <p className="text-[0.95rem] text-gray-300 leading-relaxed font-light">
                                            Outside the terminal, I dedicate my time to{' '}
                                            <strong className="text-white font-semibold">bodybuilding and long-distance cycling</strong> —
                                            treating physical endurance not just as an outlet, but as the foundation of my professional mindset.
                                        </p>
                                    </div>

                                    {/* Vertical divider */}
                                    <div className="hidden md:block w-px self-stretch bg-gradient-to-b from-green-400/5 via-green-400/20 to-green-400/5" />

                                    <div className="flex-1 space-y-3">
                                        <TerminalIcon className="w-6 h-6 text-green-400/45 mb-1" strokeWidth={1.5} />
                                        <p className="text-[0.95rem] text-gray-300 leading-relaxed font-light">
                                            Pushing past a physical plateau requires the same methodology as debugging resilient infrastructure:{' '}
                                            <strong className="text-green-400 font-medium">patience, structured problem-solving, and a refusal to give up.</strong>
                                        </p>
                                    </div>
                                </div>

                                {/* Interactive terminal */}
                                <div className="w-full">
                                    <Terminal />
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </section>

                {/* ── Education & Arsenal ────────────────────────────────── */}
                <section id="education">
                    <FadeIn><SectionHeader number="04" title="Education & Arsenal" /></FadeIn>
                    <div className="grid md:grid-cols-2 gap-5">
                        <FadeIn delay={0.1}>
                            <div className="bg-white/[0.03] p-7 rounded-2xl border border-white/[0.07] hover:border-white/15 transition-all duration-300 h-full">
                                <h4 className="text-xl font-bold">Arizona State University</h4>
                                <p className="text-green-400 text-sm font-mono tracking-wide mt-1 mb-6">B.S. Computer Science · 2022 – 2026</p>
                                <div className="space-y-3.5 text-sm">
                                    {[
                                        ['GPA', '3.88 / 4.00 — Summa Cum Laude'],
                                        ['Concentration', 'Engineering Admin & Human Factors'],
                                        ['Honors', "Dean's List"],
                                        ['Graduation', 'Spring 2026'],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex gap-4">
                                            <span className="text-gray-600 font-mono text-[10px] uppercase tracking-[0.18em] w-24 shrink-0 mt-0.5">
                                                {label}
                                            </span>
                                            <span className="text-gray-200">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.15}>
                            <div className="bg-white/[0.03] p-7 rounded-2xl border border-white/[0.07] hover:border-white/15 transition-all duration-300 h-full">
                                <div className="space-y-5">
                                    {[
                                        {
                                            label: 'Languages',
                                            skills: ['Java', 'Python', 'C', 'C++', 'C#', 'TypeScript', 'JavaScript', 'SQL', 'Bash', 'HTML'],
                                        },
                                        {
                                            label: 'Front-End',
                                            skills: ['React.js', 'Next.js', 'Three.js', 'Tailwind CSS', 'Framer Motion'],
                                        },
                                        {
                                            label: 'Back-End & Infra',
                                            skills: ['Node.js', '.NET', 'Docker', 'Kubernetes', 'Terraform', 'FastAPI', 'Redis', 'PostgreSQL', 'Git'],
                                        },
                                    ].map(({ label, skills }) => (
                                        <div key={label}>
                                            <span className="text-green-400 text-[10px] font-mono font-bold uppercase tracking-[0.22em] block mb-2">
                                                {label}
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {skills.map(s => <SkillTag key={s} name={s} />)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                {/* ── Contact ────────────────────────────────────────────── */}
                <section id="contact">
                    <FadeIn><SectionHeader number="05" title="Get In Touch" /></FadeIn>
                    <FadeIn delay={0.1}>
                        <div className="relative rounded-3xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.10] via-transparent to-transparent pointer-events-none" />
                            <div className="relative border border-white/[0.1] rounded-3xl px-10 py-14 md:px-16 md:py-20
                                            backdrop-blur-sm flex flex-col items-center text-center gap-5">

                                <span className="text-[10px] font-mono text-green-400/55 tracking-[0.3em] uppercase">
                                    Open to opportunities
                                </span>
                                <h3 className="text-4xl md:text-5xl font-bold tracking-tight max-w-lg leading-[1.05]">
                                    Let's build something that matters.
                                </h3>
                                <p className="text-gray-400 max-w-md leading-relaxed text-sm">
                                    Whether it's a full-time role, collaborative project, or a conversation about
                                    distributed systems — my inbox is always open.
                                </p>

                                <div className="flex flex-wrap justify-center gap-3 mt-3">
                                    <motion.a
                                        href="mailto:pathakrudra63@gmail.com"
                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                        className="flex items-center gap-2 bg-green-400 text-black px-7 py-3 rounded-full font-bold text-sm
                                                   shadow-[0_0_20px_rgba(74,222,128,0.25)] hover:shadow-[0_0_32px_rgba(74,222,128,0.45)] transition-all"
                                    >
                                        <Mail className="w-4 h-4" />
                                        pathakrudra63@gmail.com
                                    </motion.a>
                                    <motion.a
                                        href="tel:+16023889438"
                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                        className="flex items-center gap-2 bg-white/[0.07] border border-white/15 text-white
                                                   px-7 py-3 rounded-full font-medium text-sm hover:bg-white/15 transition-all"
                                    >
                                        <Phone className="w-4 h-4" />
                                        +1 (602) 388-9438
                                    </motion.a>
                                </div>

                                <div className="flex items-center gap-1.5 text-gray-600 text-xs mt-1">
                                    <MapPin className="w-3 h-3" />
                                    Tempe, Arizona
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </section>

                {/* ── Footer ─────────────────────────────────────────────── */}
                <footer className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 pb-4">
                    <p className="font-mono text-xs text-gray-700">© 2026 Rudra Pathak</p>
                    <p className="font-mono text-xs text-gray-700 tracking-wider">
                        Built with React · Three.js · Framer Motion
                    </p>
                    <div className="flex gap-5 text-xs text-gray-700">
                        <a href="https://github.com/Rudra0407" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">GitHub</a>
                        <a href="https://www.linkedin.com/in/rudra0407/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">LinkedIn</a>
                        <a href="mailto:pathakrudra63@gmail.com" className="hover:text-gray-300 transition-colors">Email</a>
                    </div>
                </footer>

            </main>
        </div>
    );
}