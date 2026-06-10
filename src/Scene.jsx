import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// ── Pulsing radar rings expanding outward on the horizontal plane ──────────
function RadarPulse() {
    const meshRefs = useRef([]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * 0.2;
        meshRefs.current.forEach((mesh, i) => {
            if (!mesh) return;
            const progress = (t + i * 0.25) % 1;
            mesh.scale.setScalar(1 + progress * 13);
            mesh.material.opacity = Math.max(0, (1 - progress) * 0.2);
        });
    });

    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]}>
            {[0, 1, 2, 3].map(i => (
                <mesh key={i} ref={el => { meshRefs.current[i] = el; }}>
                    <ringGeometry args={[1, 1.018, 80]} />
                    <meshBasicMaterial
                        color="#4ade80"
                        transparent
                        opacity={0.18}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
}

// ── Orbital network: nodes in orbit connected by faint constellation lines ─
function OrbitalNetwork() {
    const groupRef = useRef();
    const pulseMeshRefs = useRef([]);
    const count = 12;

    const { nodePositions, lineGeometry } = useMemo(() => {
        const nodePositions = Array.from({ length: count }).map((_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const radius = 6 + (i % 3) * 1.1;
            return new THREE.Vector3(
                Math.cos(angle) * radius,
                Math.sin(i * 1.4) * 0.85,
                Math.sin(angle) * radius,
            );
        });

        const lineVerts = [];
        // Ring connections
        nodePositions.forEach((pos, i) => {
            const next = nodePositions[(i + 1) % count];
            lineVerts.push(pos.x, pos.y, pos.z, next.x, next.y, next.z);
        });
        // Cross-connections for a network/graph feel
        nodePositions.forEach((pos, i) => {
            const skip = nodePositions[(i + 4) % count];
            lineVerts.push(pos.x, pos.y, pos.z, skip.x, skip.y, skip.z);
        });

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3));
        return { nodePositions, lineGeometry };
    }, []);

    useFrame(({ clock, delta }) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.05;
        const t = clock.getElapsedTime();
        pulseMeshRefs.current.forEach((mesh, i) => {
            if (!mesh) return;
            mesh.material.emissiveIntensity = 0.7 + Math.sin(t * 1.3 + i * 0.52) * 0.5;
        });
    });

    return (
        <group ref={groupRef}>
            <lineSegments geometry={lineGeometry}>
                <lineBasicMaterial color="#4ade80" transparent opacity={0.1} depthWrite={false} />
            </lineSegments>
            {nodePositions.map((pos, i) => (
                <mesh key={i} position={pos} ref={el => { pulseMeshRefs.current[i] = el; }}>
                    <sphereGeometry args={[0.055, 8, 8]} />
                    <meshStandardMaterial
                        color="#4ade80"
                        emissive="#4ade80"
                        emissiveIntensity={0.7}
                    />
                </mesh>
            ))}
        </group>
    );
}

// ── Central mission-control core: dual-axis rotating icosahedron ───────────
function CentralCore() {
    const outerRef = useRef();
    const innerRef = useRef();
    const haloRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (outerRef.current) {
            outerRef.current.rotation.x = t * 0.13;
            outerRef.current.rotation.y = t * 0.21;
        }
        if (innerRef.current) {
            innerRef.current.rotation.x = -t * 0.28;
            innerRef.current.rotation.z = t * 0.17;
        }
        if (haloRef.current) {
            const pulse = 1 + Math.sin(t * 1.7) * 0.08;
            haloRef.current.scale.setScalar(pulse);
            haloRef.current.material.opacity = 0.045 + Math.sin(t * 1.7) * 0.018;
        }
    });

    return (
        <group>
            {/* Breathing glow halo */}
            <mesh ref={haloRef}>
                <sphereGeometry args={[1.35, 24, 24]} />
                <meshBasicMaterial
                    color="#4ade80"
                    transparent
                    opacity={0.045}
                    side={THREE.BackSide}
                    depthWrite={false}
                />
            </mesh>
            {/* Outer wireframe icosahedron — the signature element */}
            <mesh ref={outerRef}>
                <icosahedronGeometry args={[0.92, 1]} />
                <meshStandardMaterial
                    color="#4ade80"
                    wireframe
                    transparent
                    opacity={0.38}
                    emissive="#4ade80"
                    emissiveIntensity={0.18}
                />
            </mesh>
            {/* Inner glowing octahedron core */}
            <mesh ref={innerRef}>
                <octahedronGeometry args={[0.27, 0]} />
                <meshStandardMaterial
                    color="#4ade80"
                    emissive="#4ade80"
                    emissiveIntensity={3}
                />
            </mesh>
        </group>
    );
}

// ── Subtle ground-reference grid ──────────────────────────────────────────
function GridPlane() {
    const ref = useRef();

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const verts = [];
        const size = 42;
        const divs = 22;
        const step = size / divs;
        const half = size / 2;
        for (let i = 0; i <= divs; i++) {
            const v = -half + i * step;
            verts.push(-half, 0, v, half, 0, v);
            verts.push(v, 0, -half, v, 0, half);
        }
        geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        return geo;
    }, []);

    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.material.opacity = 0.038 + Math.sin(clock.getElapsedTime() * 0.35) * 0.008;
        }
    });

    return (
        <lineSegments geometry={geometry} position={[0, -4, 0]} ref={ref}>
            <lineBasicMaterial color="#4ade80" transparent opacity={0.038} depthWrite={false} />
        </lineSegments>
    );
}

// ── Main exported scene ───────────────────────────────────────────────────
export default function Scene() {
    const dirLightRef = useRef();
    const pointLightRef = useRef();

    useFrame(({ clock }) => {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;

        if (dirLightRef.current) {
            const col = new THREE.Color('#ffffff').lerp(new THREE.Color('#4ade80'), scrollPercent);
            dirLightRef.current.color.copy(col);
            dirLightRef.current.intensity = 0.8 + scrollPercent * 1.8;
        }
        if (pointLightRef.current) {
            pointLightRef.current.intensity =
                1.8 + Math.sin(clock.getElapsedTime() * 0.75) * 0.35 + scrollPercent * 2.5;
        }
    });

    return (
        <>
            <fog attach="fog" args={['#050505', 28, 95]} />
            <Stars radius={120} depth={60} count={4500} factor={3.5} saturation={0} fade speed={0.7} />
            <ambientLight intensity={0.22} />
            {/* Green point light at origin — gives everything a mission-control tint */}
            <pointLight
                ref={pointLightRef}
                position={[0, 0, 0]}
                intensity={1.8}
                color="#4ade80"
                distance={20}
                decay={2}
            />
            <directionalLight ref={dirLightRef} position={[10, 10, 5]} intensity={0.8} />

            <CentralCore />
            <OrbitalNetwork />
            <RadarPulse />
            <GridPlane />
        </>
    );
}