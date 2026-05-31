import { useState, useRef, useEffect } from 'react';

const BOOT_LINES = [
    { type: 'system', text: 'RudraOS v2.0.26 (Infrastructure Mode)' },
    { type: 'system', text: 'Initializing kernel modules...' },
    { type: 'system', text: 'Mounting /dev/portfolio ... [ OK ]' },
    { type: 'system', text: 'Starting distributed services ... [ OK ]' },
    { type: 'system', text: 'Type "help" for available commands.' },
];

const COMMANDS = {
    help: {
        output: `Available commands:
  whoami              — identity query
  ls                  — list directory contents
  cat experience.txt  — view work history
  cat skills.txt      — view tech stack
  docker run portfolio— spin up the project
  ping nasa.gov       — check uplink
  neofetch            — system info
  ssh psyche          — connect to mission
  clear               — reset terminal`
    },
    whoami: {
        output: 'rudra@local  |  cloud-architect  |  ui-engineer  |  summa-cum-laude'
    },
    ls: {
        output: `drwxr-xr-x  experience/
drwxr-xr-x  projects/
drwxr-xr-x  education/
-rw-r--r--  resume.pdf
-rw-r--r--  experience.txt
-rw-r--r--  skills.txt
-rwxr-xr-x  deploy.sh`
    },
    'cat experience.txt': {
        output: `[1] ASU/NASA Psyche Mission        — Mobile & Responsive Design Lead
[2] Glynac AI (Greentree Group)   — Software Engineering Intern
[3] Arizona State University      — Writing Tutor

Run: cat experience/<1|2|3>.log for details`
    },
    'cat experience/1.log': {
        output: `== ASU/NASA Psyche Mission ==
Role   : Mobile & Responsive Design Lead
Period : Fall 2025 – Spring 2026
Stack  : React, Three.js, WebGL, Framer Motion
Impact :
  > Engineered scroll-driven React layer over Three.js WebGL canvas
  > Built hardware-accelerated auto-scroll via requestAnimationFrame
  > Overhauled CSS with Flexbox + clamp() for full responsiveness`
    },
    'cat experience/2.log': {
        output: `== Glynac AI (Greentree Group) ==
Role   : Software Engineering Intern
Period : May 2025 – Aug 2025
Stack  : TypeScript, React, Tailwind CSS
Impact :
  > Engineered responsive front-end for enterprise AI platform
  > Refactored legacy code → measurable Core Web Vitals improvements`
    },
    'cat experience/3.log': {
        output: `== Arizona State University ==
Role   : Writing Tutor
Period : Oct 2024 – Present
Impact :
  > Mentored students in technical and academic writing
  > Improved clarity in technical documentation and project reports`
    },
    'cat skills.txt': {
        output: `Languages  : Java, Python, C/C++, C#, TypeScript, JavaScript, SQL, Bash
Front-End  : React.js, Next.js, Three.js (WebGL), Tailwind CSS, Framer Motion
Back-End   : Node.js, .NET (WCF), Docker, Terraform, TCP/IP Sockets, Git`
    },
    'docker run portfolio': {
        output: `Pulling image rudra/portfolio:latest ...
  Layer 1/4: base-os         ████████████ 100%
  Layer 2/4: node-runtime    ████████████ 100%
  Layer 3/4: dependencies    ████████████ 100%
  Layer 4/4: app-bundle      ████████████ 100%

Container started.
  Port   : 5173
  Status : Healthy ✓
  Uptime : 0s`
    },
    'ping nasa.gov': {
        output: `PING nasa.gov (192.168.1.1): 56 data bytes
64 bytes from nasa.gov: icmp_seq=0 ttl=64 time=12.4 ms
64 bytes from nasa.gov: icmp_seq=1 ttl=64 time=11.9 ms
64 bytes from nasa.gov: icmp_seq=2 ttl=64 time=12.1 ms

--- nasa.gov ping statistics ---
3 packets transmitted, 3 received, 0% packet loss`
    },
    neofetch: {
        output: `
       ██████          rudra@local
      ████████         -----------
     ██  ██  ██        OS: RudraOS v2.0.26
    ████████████       Host: ASU/NASA Psyche Mission
   ██  ██  ██  ██      Kernel: 6.1.0-distributed
  ████████████████     Shell: zsh 5.9
 ██  ██  ██  ██  ██    Resolution: 1920x1080
████████████████████   DE: Portfolio
                       WM: Framer Motion
  🟥 🟧 🟨 🟩 🟦 🟪   Terminal: RudraOS Terminal`
    },
    'ssh psyche': {
        output: `Connecting to psyche.mission.nasa.gov ...
Authenticating with key ~/.ssh/id_rsa_psyche ...
Access granted. Welcome, Rudra.

  NASA Psyche Mission — Asteroid Orbiter
  Distance from Earth: 378,000,000 km
  Status: NOMINAL

Connection established. Type 'exit' to disconnect.`
    },
    exit: {
        output: 'Connection to psyche.mission.nasa.gov closed.'
    },
};

export default function Terminal() {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    const [booting, setBooting] = useState(true);
    const [cmdHistory, setCmdHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const scrollContainerRef = useRef(null);
    const inputRef = useRef(null);

    // Typewriter boot sequence
    useEffect(() => {
        let cancelled = false;
        async function boot() {
            for (let i = 0; i < BOOT_LINES.length; i++) {
                if (cancelled) return;
                await new Promise(r => setTimeout(r, 350));
                setHistory(prev => [...prev, BOOT_LINES[i]]);
            }
            if (!cancelled) setBooting(false);
        }
        boot();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const next = Math.min(historyIndex + 1, cmdHistory.length - 1);
            setHistoryIndex(next);
            setInput(cmdHistory[next] ?? '');
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = Math.max(historyIndex - 1, -1);
            setHistoryIndex(next);
            setInput(next === -1 ? '' : cmdHistory[next]);
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();

            const cmd = input.trim().toLowerCase();

            if (cmd === 'clear') {
                setHistory([]);
                setInput('');
                setCmdHistory(prev => [cmd, ...prev]);
                setHistoryIndex(-1);
                return;
            }

            const result = COMMANDS[cmd];
            const response = result
                ? result.output
                : cmd === ''
                    ? null
                    : `Command not found: ${cmd}\nTry "help" for available commands.`;

            setHistory(prev => [
                ...prev,
                { type: 'user', text: `rudra@local:~$ ${cmd}` },
                ...(response ? [{ type: 'system', text: response }] : []),
            ]);

            if (cmd) {
                setCmdHistory(prev => [cmd, ...prev]);
                setHistoryIndex(-1);
            }
            setInput('');
        }
    };

    return (
        <div
            className="bg-black/95 border border-green-500/40 rounded-xl p-5 font-mono text-sm shadow-2xl flex flex-col h-full min-h-[350px] w-full relative z-20"
            onClick={() => inputRef.current?.focus()}
        >
            {/* Traffic lights */}
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-gray-500 tracking-widest">rudra@local — RudraOS v2.0.26</span>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto terminal-scroll space-y-1 pr-2"
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            >
                {history.map((line, i) => (
                    <div
                        key={i}
                        className={
                            line.type === 'user'
                                ? 'text-white'
                                : 'text-green-400 whitespace-pre-line leading-relaxed'
                        }
                    >
                        {line.text}
                    </div>
                ))}

                {/* Input row — hidden while booting */}
                {!booting && (
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-white shrink-0">rudra@local:~$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleCommand}
                            spellCheck="false"
                            autoComplete="off"
                            className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 caret-green-400"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}