import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus, Line, Ring } from '@react-three/drei';
import * as THREE from 'three';

// Pulsating energy orb
const EnergyOrb = ({ 
  position, 
  color = "#8b5cf6",
  scale = 1 
}: { 
  position: [number, number, number];
  color?: string;
  scale?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 1;
      meshRef.current.scale.setScalar(scale * pulse);
      glowRef.current.scale.setScalar(scale * pulse * 1.5);
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.2, 32, 32]}>
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </Sphere>
      <Sphere ref={glowRef} args={[0.25, 16, 16]}>
        <meshStandardMaterial 
          color={color} 
          transparent
          opacity={0.2}
        />
      </Sphere>
    </group>
  );
};

// Orbiting ring
const OrbitRing = ({ 
  position, 
  radius = 1,
  color = "#8b5cf6",
  speed = 1
}: { 
  position: [number, number, number];
  radius?: number;
  color?: string;
  speed?: number;
}) => {
  const ringRef = useRef<THREE.Group>(null);
  const particleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      ringRef.current.rotation.y += 0.002 * speed;
    }
    if (particleRef.current) {
      const angle = state.clock.elapsedTime * speed;
      particleRef.current.position.x = Math.cos(angle) * radius;
      particleRef.current.position.z = Math.sin(angle) * radius;
    }
  });

  return (
    <group ref={ringRef} position={position}>
      <Ring args={[radius - 0.02, radius + 0.02, 64]}>
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </Ring>
      <Sphere ref={particleRef} args={[0.08, 16, 16]} position={[radius, 0, 0]}>
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={3}
        />
      </Sphere>
    </group>
  );
};

// Energy wave effect
const EnergyWave = ({ position }: { position: [number, number, number] }) => {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        const scale = ((state.clock.elapsedTime * 0.5 + i * 0.3) % 2);
        ring.scale.setScalar(scale);
        (ring as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: "#8b5cf6",
          transparent: true,
          opacity: Math.max(0, 1 - scale / 2),
          side: THREE.DoubleSide,
        });
      });
    }
  });

  return (
    <group ref={ringsRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
      {[0, 1, 2].map((i) => (
        <Ring key={i} args={[0.8, 0.85, 64]}>
          <meshStandardMaterial 
            color="#8b5cf6" 
            transparent 
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </Ring>
      ))}
    </group>
  );
};

// Neural network connection lines
const NeuralConnections = () => {
  const linesRef = useRef<THREE.Group>(null);
  
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 25; i++) {
      pts.push([
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6 - 3
      ]);
    }
    return pts;
  }, []);

  const lines = useMemo(() => {
    const result: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = Math.sqrt(
          Math.pow(points[i][0] - points[j][0], 2) +
          Math.pow(points[i][1] - points[j][1], 2) +
          Math.pow(points[i][2] - points[j][2], 2)
        );
        if (dist < 4) {
          result.push({
            start: new THREE.Vector3(...points[i]),
            end: new THREE.Vector3(...points[j])
          });
        }
      }
    }
    return result;
  }, [points]);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      linesRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.05) * 0.05;
    }
  });

  return (
    <group ref={linesRef}>
      {points.map((point, i) => (
        <Float key={i} speed={2} floatIntensity={0.3}>
          <Sphere position={point} args={[0.06, 16, 16]}>
            <meshStandardMaterial 
              color="#8b5cf6" 
              emissive="#8b5cf6"
              emissiveIntensity={1}
            />
          </Sphere>
        </Float>
      ))}
      {lines.map((line, i) => (
        <Line
          key={i}
          points={[line.start, line.end]}
          color="#8b5cf6"
          lineWidth={1}
          transparent
          opacity={0.4}
        />
      ))}
    </group>
  );
};

// Holographic display
const HologramDisplay = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Concentric rings */}
      {[0.3, 0.5, 0.7].map((radius, i) => (
        <Ring 
          key={i} 
          args={[radius - 0.02, radius + 0.02, 32]} 
          rotation={[Math.PI / 2, 0, i * 0.5]}
        >
          <meshStandardMaterial 
            color="#a78bfa" 
            emissive="#a78bfa"
            emissiveIntensity={0.5}
            transparent 
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </Ring>
      ))}
      {/* Central core */}
      <Sphere args={[0.15, 32, 32]}>
        <meshStandardMaterial 
          color="#8b5cf6" 
          emissive="#8b5cf6"
          emissiveIntensity={2}
        />
      </Sphere>
    </group>
  );
};

// Rotating gear/cog (torus based)
const Gear = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => {
  const gearRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (gearRef.current) {
      gearRef.current.rotation.z += 0.005;
    }
  });

  return (
    <Torus ref={gearRef} position={position} args={[0.4 * scale, 0.08 * scale, 6, 24]} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#4c1d95" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
    </Torus>
  );
};

// Data stream effect
const DataStream = ({ startPos, endPos }: { startPos: [number, number, number]; endPos: [number, number, number] }) => {
  const particlesRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      offset: i * 0.125,
      speed: 0.5 + Math.random() * 0.5
    }));
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        const t = ((state.clock.elapsedTime * particles[i].speed + particles[i].offset) % 1);
        particle.position.x = startPos[0] + (endPos[0] - startPos[0]) * t;
        particle.position.y = startPos[1] + (endPos[1] - startPos[1]) * t;
        particle.position.z = startPos[2] + (endPos[2] - startPos[2]) * t;
      });
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((_, i) => (
        <Sphere key={i} args={[0.04, 8, 8]}>
          <meshStandardMaterial 
            color="#6366f1" 
            emissive="#6366f1"
            emissiveIntensity={2}
          />
        </Sphere>
      ))}
    </group>
  );
};

// Main scene
const Scene = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#6366f1" />
      <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={1.2} color="#a78bfa" />

      {/* Neural network in background */}
      <NeuralConnections />

      {/* Energy orbs */}
      <EnergyOrb position={[-4, 2, -2]} color="#8b5cf6" scale={1.5} />
      <EnergyOrb position={[4, -1, -3]} color="#6366f1" scale={1.2} />
      <EnergyOrb position={[0, 3, -4]} color="#a78bfa" scale={1} />
      <EnergyOrb position={[-3, -2, -2]} color="#8b5cf6" scale={0.8} />
      <EnergyOrb position={[3, 2, -3]} color="#6366f1" scale={0.6} />

      {/* Orbit rings */}
      <OrbitRing position={[-2, 1, -2]} radius={1.2} color="#8b5cf6" speed={1.5} />
      <OrbitRing position={[3, 0, -3]} radius={0.8} color="#6366f1" speed={2} />
      <OrbitRing position={[0, -1, -2]} radius={1} color="#a78bfa" speed={1} />

      {/* Energy waves */}
      <EnergyWave position={[-3, -1, -4]} />
      <EnergyWave position={[4, 2, -5]} />

      {/* Holographic displays */}
      <HologramDisplay position={[-4, -2, -3]} />
      <HologramDisplay position={[4, 1, -4]} />
      <HologramDisplay position={[0, 2, -3]} />

      {/* Data streams */}
      <DataStream startPos={[-5, 3, -3]} endPos={[5, -2, -3]} />
      <DataStream startPos={[4, 3, -4]} endPos={[-4, -3, -2]} />
      <DataStream startPos={[-3, -2, -2]} endPos={[3, 3, -4]} />

      {/* Gears */}
      <Gear position={[-2, 3, -3]} scale={1.5} />
      <Gear position={[2, -3, -4]} scale={1} />
      <Gear position={[5, 1, -5]} scale={0.8} />

      {/* Floating torus shapes */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Torus position={[0, -2, -1]} args={[0.3, 0.1, 16, 32]}>
          <meshStandardMaterial color="#a78bfa" transparent opacity={0.6} metalness={0.8} roughness={0.2} />
        </Torus>
      </Float>
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
        <Torus position={[-4, -1, -2]} args={[0.25, 0.08, 16, 32]}>
          <meshStandardMaterial color="#6366f1" transparent opacity={0.5} metalness={0.8} roughness={0.2} />
        </Torus>
      </Float>

      {/* Floating particles */}
      {[...Array(25)].map((_, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.3} floatIntensity={0.5}>
          <Sphere
            position={[
              (Math.random() - 0.5) * 14,
              (Math.random() - 0.5) * 10,
              -Math.random() * 6 - 2
            ]}
            args={[0.03 + Math.random() * 0.06, 8, 8]}
          >
            <meshStandardMaterial
              color="#8b5cf6"
              emissive="#8b5cf6"
              emissiveIntensity={1}
            />
          </Sphere>
        </Float>
      ))}
    </>
  );
};

const AIBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/80 pointer-events-none" />
    </div>
  );
};

export default AIBackground;
