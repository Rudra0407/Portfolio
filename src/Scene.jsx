import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// Stable asteroid belt in a ring around the scene
function AsteroidBelt() {
    const groupRef = useRef();
    const count = 60;

    const asteroids = useMemo(() => (
        Array.from({ length: count }).map((_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const radius = 8 + Math.random() * 3;
            const tilt = (Math.random() - 0.5) * 2;
            return {
                position: [
                    Math.cos(angle) * radius,
                    tilt,
                    Math.sin(angle) * radius,
                ],
                scale: 0.04 + Math.random() * 0.08,
            };
        })
    ), []);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            {asteroids.map((a, i) => (
                <mesh key={i} position={a.position} scale={a.scale}>
                    <dodecahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#4ade80" wireframe opacity={0.6} transparent />
                </mesh>
            ))}
        </group>
    );
}

export default function Scene() {
    const groupRef = useRef();
    const dirLightRef = useRef();
    const ambientLightRef = useRef();

    // Stable random positions — computed once, not on every render
    const floatingShards = useMemo(() => (
        Array.from({ length: 20 }).map(() => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
            ],
            speed: 1 + Math.random(),
            rotationIntensity: 1 + Math.random() * 2,
        }))
    ), []);

    useFrame((_, delta) => {
        groupRef.current.rotation.y += delta * 0.05;

        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;

        const startColor = new THREE.Color('#ffffff');
        const targetColor = new THREE.Color('#4ade80');
        const currentColor = startColor.clone().lerp(targetColor, scrollPercent);

        if (dirLightRef.current && ambientLightRef.current) {
            dirLightRef.current.color = currentColor;
            dirLightRef.current.intensity = 1 + scrollPercent * 2;
            ambientLightRef.current.intensity = 0.5 + scrollPercent * 0.5;
        }
    });

    return (
        <group ref={groupRef}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <ambientLight ref={ambientLightRef} intensity={0.5} />
            <directionalLight ref={dirLightRef} position={[10, 10, 5]} intensity={1} />

            <AsteroidBelt />

            {floatingShards.map((shard, i) => (
                <Float key={i} speed={shard.speed} rotationIntensity={shard.rotationIntensity} floatIntensity={2}>
                    <mesh position={shard.position}>
                        <octahedronGeometry args={[0.2, 0]} />
                        <meshStandardMaterial color="#4ade80" wireframe />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}