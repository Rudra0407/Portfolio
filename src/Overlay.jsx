import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ExternalLink, Dumbbell, Terminal as TerminalIcon, Mail, Phone, MapPin } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import Terminal from './Terminal';
import TelemetryBar from './TelemetryBar';

const SocialLink = ({ href, label, Icon }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="group flex items-center gap-2 px-6 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-green-400 hover:text-black hover:border-transparent transition-all duration-300 text-sm font-medium backdrop-blur-sm shadow-lg"
    >
        <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
        {label}
    </motion.a>
);

export default function Overlay() {
    // Ref attached to the main scrolling container
    const scrollRef = useRef(null);

    return (
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto z-10 terminal-scroll">

            {/* Pass the ref to the TelemetryBar so it knows what to track */}
            <TelemetryBar containerRef={scrollRef} />

            <main className="max-w-6xl mx-auto px-8 flex flex-col gap-24 pb-24 pt-24">

                {/* Hero Section */}
                <section className="min-h-[85vh] flex flex-col md:flex-row items-center justify-between gap-16 pt-10">
                    <div className="flex-1 flex flex-col justify-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
                            className="text-7xl font-bold tracking-tighter"
                        >
                            Rudra Pathak
                        </motion.h1>
                        <motion.h2
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
                            className="text-2xl mt-6 text-green-400 font-light tracking-wide"
                        >
                            Summa Cum Laude | B.S. Computer Science
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
                            className="mt-6 text-xl text-gray-400 max-w-2xl leading-relaxed"
                        >
                            Software Engineer specializing in distributed cloud orchestration and 3D web visualization.
                            Leveraging a strong background in human factors to drive accessible, user-focused development and clear technical communication.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}
                            className="mt-10 flex flex-wrap gap-4"
                        >
                            <SocialLink href="https://www.linkedin.com/in/rudra0407/" label="LinkedIn" Icon={FaLinkedin} />
                            <SocialLink href="https://github.com/Rudra0407" label="GitHub" Icon={FaGithub} />
                            <SocialLink href="https://app.joinhandshake.com/profiles/rudra0407" label="Handshake" Icon={Briefcase} />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                        className="w-80 md:w-96 shrink-0 relative rounded-2xl overflow-hidden border border-white/20 shadow-[0_0_40px_rgba(74,222,128,0.15)] group"
                    >
                        <img
                            src="/IMG-20260515-WA0030.jpg"
                            alt="Rudra Pathak"
                            className="object-cover w-full h-[500px] transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </motion.div>
                </section>

                {/* Experience Section */}
                <section>
                    <h3 className="text-4xl font-bold mb-10 border-b border-gray-800 pb-4">Experience</h3>
                    <div className="grid gap-8">
                        <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-green-400/50 transition-all duration-300">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                <div>
                                    <h4 className="text-3xl font-semibold">ASU/NASA Psyche Mission</h4>
                                    <p className="text-green-400 mt-1 text-lg">Mobile and Responsive Design Lead • Fall 2025 - Spring 2026</p>
                                </div>
                                <motion.a
                                    href="https://missiontopsyche-platinum.github.io/platinum_14a_3d_show-cs/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group inline-flex items-center gap-2 bg-green-400 text-black px-6 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(74,222,128,0.4)] hover:shadow-[0_0_25px_rgba(74,222,128,0.6)] transition-all whitespace-nowrap"
                                >
                                    View 3D Show
                                    <ExternalLink className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
                                </motion.a>
                            </div>
                            <ul className="list-disc list-inside text-gray-300 space-y-3 leading-relaxed text-lg">
                                <li>Engineered a responsive, scroll-driven React web application layered over a Three.js WebGL canvas.</li>
                                <li>Developed a hardware-accelerated auto-scroll feature utilizing requestAnimationFrame.</li>
                                <li>Overhauled responsiveness using fluid CSS Flexbox layouts and clamp() functions.</li>
                            </ul>
                        </div>

                        <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/30 transition-colors">
                            <h4 className="text-2xl font-semibold">Glynac AI (Greentree Group)</h4>
                            <p className="text-gray-400 mb-4">Software Engineering Intern • May 2025 - Aug 2025</p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Engineered responsive front-end architecture for an enterprise AI platform using TypeScript, React, and Tailwind CSS.</li>
                                <li>Refactored legacy code to improve Core Web Vitals, resulting in measurable gains in rendering speed.</li>
                            </ul>
                        </div>

                        <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/30 transition-colors">
                            <h4 className="text-2xl font-semibold">Arizona State University</h4>
                            <p className="text-gray-400 mb-4">Writing Tutor • Oct 2024 - Present</p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Facilitate one-on-one sessions to mentor students in technical and academic writing.</li>
                                <li>Improve structural clarity and professional communication in technical documentation and project reports.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Technical Projects Section */}
                <section>
                    <h3 className="text-4xl font-bold mb-10 border-b border-gray-800 pb-4">Technical Projects</h3>

                    {/* Featured Project: rAIn Orchestrator */}
                    <div className="bg-gradient-to-br from-white/5 to-transparent p-8 md:p-10 rounded-3xl backdrop-blur-sm border border-white/10 relative overflow-hidden group shadow-2xl mb-8 hover:border-green-400/30 transition-colors duration-500">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[100px] rounded-full pointer-events-none" />

                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div>
                                    <h4 className="text-3xl font-bold mb-2">rAIn Orchestrator</h4>
                                    <p className="text-green-400 text-lg mb-6">AI Infrastructure & Platform Engineering</p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {['Python', 'FastAPI', 'React', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'Ollama'].map(tech => (
                                            <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 font-mono tracking-wider">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <motion.a
                                    href="https://github.com/Rudra0407/AI-Cloud-Orchestrator.git"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap border border-white/20 shadow-lg"
                                >
                                    <FaGithub className="w-5 h-5" />
                                    View Repository
                                </motion.a>
                            </div>

                            <p className="text-gray-300 leading-relaxed text-lg font-light mb-4">
                                A full-stack AI infrastructure platform demonstrating production-grade ML systems engineering. It provides a complete environment for deploying, routing, monitoring, and scaling open-source large language models locally. Features include an intelligent traffic routing layer (round-robin, weighted, least-latency) based on real-time latency tracking, a Redis-based rate limiter, and a background autoscaling service evaluating CPU thresholds to adjust replica counts automatically.
                            </p>

                            {/* Horizontal Scroll Gallery */}
                            <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory terminal-scroll">
                                {[
                                    "/Screenshot 2026-06-04 114258.png",
                                    "/Screenshot 2026-06-04 114313.png",
                                    "/Screenshot 2026-06-04 114324.png",
                                    "/Screenshot 2026-06-04 114554.png",
                                    "/Screenshot 2026-06-04 114619.png"
                                ].map((src, idx) => (
                                    <img
                                        key={idx}
                                        src={src}
                                        alt={`rAIn Orchestrator Screenshot ${idx + 1}`}
                                        className="w-[85%] md:w-[60%] lg:w-[45%] h-auto object-cover rounded-xl border border-white/10 snap-center shrink-0 shadow-lg hover:border-green-400/50 transition-colors cursor-crosshair"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/30 transition-colors flex flex-col">
                            <h4 className="text-xl font-semibold mb-2">Mini Cloud Infrastructure Platform</h4>
                            <p className="text-sm text-green-400/80 mb-4 font-mono tracking-wider">Python | Terraform | Docker | Nginx</p>
                            <p className="text-gray-300 text-sm leading-relaxed flex-1">
                                Architected a lightweight cloud platform to automate container provisioning and VPC-like network isolation.
                                Implemented a load-balanced traffic router enabling zero-downtime rolling deployments.
                            </p>
                        </div>

                        <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/30 transition-colors flex flex-col">
                            <h4 className="text-xl font-semibold mb-2">Distributed Storage System</h4>
                            <p className="text-sm text-green-400/80 mb-4 font-mono tracking-wider">Python | TCP/IP | RAID-5</p>
                            <p className="text-gray-300 text-sm leading-relaxed flex-1">
                                Designed a networked storage solution using Socket Programming. Implemented RAID-5 Distributed Parity logic
                                and optimized throughput via a multi-threaded I/O scheduler.
                            </p>
                        </div>
                    </div>
                </section>

                {/* The Discipline of Iteration & Terminal */}
                <section>
                    <h3 className="text-4xl font-bold mb-10 border-b border-gray-800 pb-4">The Discipline of Iteration</h3>

                    <div className="bg-gradient-to-br from-white/5 to-transparent p-8 md:p-12 rounded-3xl backdrop-blur-sm border border-white/10 relative overflow-hidden group transition-colors duration-700 shadow-2xl flex flex-col gap-10">

                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-green-500/5 blur-[120px] rounded-full pointer-events-none transition-colors duration-700" />

                        {/* Split Text Layout on TOP */}
                        <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start">

                            {/* Physical Paragraph */}
                            <div className="flex-1 space-y-4">
                                <Dumbbell className="w-8 h-8 text-green-400/60 mb-2" strokeWidth={1.5} />
                                <p className="text-lg text-gray-300 leading-relaxed font-light">
                                    Outside of the terminal, I dedicate my time to <strong className="text-white font-semibold">bodybuilding and long-distance cycling</strong>. I treat physical endurance not just as an outlet, but as the foundation of my professional mindset.
                                </p>
                            </div>

                            {/* Subtle Vertical Divider (hidden on mobile) */}
                            <div className="hidden md:block w-px h-32 bg-gradient-to-b from-green-400/10 via-green-400/30 to-green-400/10 mt-6" />

                            {/* Technical Paragraph */}
                            <div className="flex-1 space-y-4">
                                <TerminalIcon className="w-8 h-8 text-green-400/60 mb-2" strokeWidth={1.5} />
                                <p className="text-lg text-gray-300 leading-relaxed font-light">
                                    Pushing past a physical plateau on a grueling ride requires the exact same methodology as debugging a resilient, fault-tolerant infrastructure: <strong className="text-green-400 font-medium">patience, structured problem-solving, and a complete refusal to give up.</strong>
                                </p>
                            </div>

                        </div>

                        {/* Terminal box on BOTTOM */}
                        <div className="relative z-10 w-full mt-4">
                            <Terminal />
                        </div>

                    </div>
                </section>

                {/* Education & Skills Section */}
                <section>
                    <h3 className="text-4xl font-bold mb-10 border-b border-gray-800 pb-4">Education & Arsenal</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/30 transition-colors">
                            <h4 className="text-2xl font-semibold">Arizona State University</h4>
                            <p className="text-green-400 mt-1 mb-4 text-lg">B.S. in Computer Science</p>
                            <ul className="space-y-3 text-gray-300">
                                <li><strong className="text-white">GPA:</strong> 3.88/4.00 (Summa Cum Laude)</li>
                                <li><strong className="text-white">Concentration:</strong> Engineering Administration & Human Factors</li>
                                <li><strong className="text-white">Honors:</strong> Dean's List</li>
                                <li><strong className="text-white">Graduation:</strong> Spring 2026</li>
                            </ul>
                        </div>

                        <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/30 transition-colors">
                            <div className="space-y-5">
                                <div>
                                    <span className="text-green-400 text-sm font-bold uppercase tracking-wider block mb-1">Languages</span>
                                    <p className="text-gray-300 leading-relaxed">Java, Python, C/C++, C#, TypeScript, JavaScript, SQL, Bash, HTML</p>
                                </div>
                                <div>
                                    <span className="text-green-400 text-sm font-bold uppercase tracking-wider block mb-1">Front-End</span>
                                    <p className="text-gray-300 leading-relaxed">React.js, Next.js, Three.js (WebGL), Tailwind CSS, Framer Motion</p>
                                </div>
                                <div>
                                    <span className="text-green-400 text-sm font-bold uppercase tracking-wider block mb-1">Back-End & Architecture</span>
                                    <p className="text-gray-300 leading-relaxed">Node.js, .NET (WCF), Docker, Terraform, TCP/IP Sockets, Git, Agile</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Get In Touch / Contact Section */}
                <section>
                    <h3 className="text-4xl font-bold mb-10 border-b border-gray-800 pb-4">Get In Touch</h3>
                    <div className="grid md:grid-cols-3 gap-8">

                        {/* Email Card */}
                        <motion.a
                            href="mailto:pathakrudra63@gmail.com"
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-green-400/50 hover:bg-white/10 transition-colors flex flex-col items-center text-center group"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-400/10 flex items-center justify-center mb-6 group-hover:bg-green-400/20 transition-colors">
                                <Mail className="w-8 h-8 text-green-400" strokeWidth={1.5} />
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Email</h4>
                            <p className="text-gray-400 text-sm">pathakrudra63@gmail.com</p>
                        </motion.a>

                        {/* Phone Card */}
                        <motion.a
                            href="tel:+16023889438"
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-green-400/50 hover:bg-white/10 transition-colors flex flex-col items-center text-center group"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-400/10 flex items-center justify-center mb-6 group-hover:bg-green-400/20 transition-colors">
                                <Phone className="w-8 h-8 text-green-400" strokeWidth={1.5} />
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Phone</h4>
                            <p className="text-gray-400 text-sm">+1 (602) 388-9438</p>
                        </motion.a>

                        {/* Location Card */}
                        <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-green-400/50 hover:bg-white/10 transition-colors flex flex-col items-center text-center group cursor-default"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-400/10 flex items-center justify-center mb-6 group-hover:bg-green-400/20 transition-colors">
                                <MapPin className="w-8 h-8 text-green-400" strokeWidth={1.5} />
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Location</h4>
                            <p className="text-gray-400 text-sm">Tempe, Arizona</p>
                        </motion.div>

                    </div>
                </section>

            </main>
        </div>
    );
}