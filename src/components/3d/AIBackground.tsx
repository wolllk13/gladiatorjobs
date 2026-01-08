import { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Float, Sphere, Box, Torus, Line } from '@react-three/drei';
import * as THREE from 'three';

// Floating geometric shapes representing AI/tech elements
const FloatingShape = ({ 
  position, 
  shape, 
  color, 
  scale = 1,
  rotationSpeed = 0.5 
}: { 
  position: [number, number, number];
  shape: 'sphere' | 'box' | 'torus' | 'diamond';
  color: string;
  scale?: number;
  rotationSpeed?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002 * rotationSpeed;
      meshRef.current.rotation.y += 0.003 * rotationSpeed;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.001;
    }
  });

  // Render different shapes based on type
  const renderShape = () => {
    const materialProps = {
      color,
      transparent: true,
      opacity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
    };

    switch (shape) {
      case 'sphere':
        return (
          <Sphere ref={meshRef} position={position} args={[0.3, 32, 32]} scale={scale}>
            <meshStandardMaterial {...materialProps} />
          </Sphere>
        );
      case 'box':
        return (
          <Box ref={meshRef} position={position} args={[0.4, 0.4, 0.4]} scale={scale}>
            <meshStandardMaterial {...materialProps} />
          </Box>
        );
      case 'torus':
        return (
          <Torus ref={meshRef} position={position} args={[0.3, 0.1, 16, 32]} scale={scale}>
            <meshStandardMaterial {...materialProps} />
          </Torus>
        );
      case 'diamond':
        // Use two cones to create diamond shape instead of Octahedron
        return (
          <group ref={meshRef as any} position={position} scale={scale}>
            <mesh>
              <coneGeometry args={[0.3, 0.4, 4]} />
              <meshStandardMaterial {...materialProps} wireframe />
            </mesh>
            <mesh rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.3, 0.4, 4]} />
              <meshStandardMaterial {...materialProps} wireframe />
            </mesh>
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      {renderShape()}
    </Float>
  );
};

// Neural network connection lines
const NeuralConnections = () => {
  const linesRef = useRef<THREE.Group>(null);
  
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 20; i++) {
      pts.push([
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5 - 2
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
      {/* Node points */}
      {points.map((point, i) => (
        <Sphere key={i} position={point} args={[0.05, 16, 16]}>
          <meshStandardMaterial 
            color="#8b5cf6" 
            emissive="#8b5cf6"
            emissiveIntensity={0.5}
          />
        </Sphere>
      ))}
      {/* Connection lines using drei Line */}
      {lines.map((line, i) => (
        <Line
          key={i}
          points={[line.start, line.end]}
          color="#8b5cf6"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
    </group>
  );
};

// Robot head representation
const RobotHead = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Head */}
      <Box args={[0.8, 0.9, 0.7]}>
        <meshStandardMaterial color="#1e1b4b" metalness={0.9} roughness={0.1} />
      </Box>
      {/* Eyes */}
      <Sphere position={[-0.2, 0.15, 0.36]} args={[0.12, 16, 16]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2} />
      </Sphere>
      <Sphere position={[0.2, 0.15, 0.36]} args={[0.12, 16, 16]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2} />
      </Sphere>
      {/* Antenna */}
      <Box position={[0, 0.6, 0]} args={[0.05, 0.3, 0.05]}>
        <meshStandardMaterial color="#4c1d95" metalness={0.8} roughness={0.2} />
      </Box>
      <Sphere position={[0, 0.8, 0]} args={[0.08, 16, 16]}>
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={1} />
      </Sphere>
    </group>
  );
};

// Circuit board pattern
const CircuitBoard = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main board */}
      <Box args={[2, 2, 0.05]}>
        <meshStandardMaterial color="#1e1b4b" transparent opacity={0.5} />
      </Box>
      {/* Circuit traces */}
      {[...Array(5)].map((_, i) => (
        <Box key={i} position={[(i - 2) * 0.3, 0, 0.03]} args={[0.02, 1.5, 0.02]}>
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.3} />
        </Box>
      ))}
      {[...Array(5)].map((_, i) => (
        <Box key={`h${i}`} position={[0, (i - 2) * 0.3, 0.03]} args={[1.5, 0.02, 0.02]}>
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.3} />
        </Box>
      ))}
      {/* Chips */}
      {[[-0.5, 0.5], [0.5, -0.5], [-0.5, -0.5], [0.5, 0.5]].map(([x, y], i) => (
        <Box key={`chip${i}`} position={[x, y, 0.05]} args={[0.2, 0.2, 0.05]}>
          <meshStandardMaterial color="#312e81" metalness={0.9} roughness={0.1} />
        </Box>
      ))}
    </group>
  );
};

// Gear/cog element
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

// Main scene
const Scene = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
      <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={1} color="#a78bfa" />

      {/* Neural network in background */}
      <NeuralConnections />

      {/* Robot heads */}
      <RobotHead position={[-4, 2, -3]} />
      <RobotHead position={[4, -1, -4]} />

      {/* Circuit boards */}
      <CircuitBoard position={[3, 3, -5]} />
      <CircuitBoard position={[-3, -2, -6]} />

      {/* Gears */}
      <Gear position={[-2, 3, -2]} scale={1.5} />
      <Gear position={[2, -3, -3]} scale={1} />
      <Gear position={[4, 2, -4]} scale={0.8} />

      {/* Floating geometric shapes */}
      <FloatingShape position={[-3, 0, -1]} shape="diamond" color="#8b5cf6" scale={1.2} />
      <FloatingShape position={[3, 1, -2]} shape="diamond" color="#6366f1" scale={0.8} />
      <FloatingShape position={[0, -2, -1]} shape="torus" color="#a78bfa" scale={1} />
      <FloatingShape position={[-2, 2, -3]} shape="box" color="#4c1d95" scale={0.6} />
      <FloatingShape position={[2, -1, -2]} shape="sphere" color="#8b5cf6" scale={0.7} />
      <FloatingShape position={[-4, -1, -2]} shape="torus" color="#6366f1" scale={0.5} />
      <FloatingShape position={[4, 0, -1]} shape="box" color="#a78bfa" scale={0.4} />

      {/* Additional floating elements */}
      {[...Array(15)].map((_, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.3} floatIntensity={0.5}>
          <Sphere
            position={[
              (Math.random() - 0.5) * 12,
              (Math.random() - 0.5) * 8,
              -Math.random() * 5 - 2
            ]}
            args={[0.03 + Math.random() * 0.05, 8, 8]}
          >
            <meshStandardMaterial
              color="#8b5cf6"
              emissive="#8b5cf6"
              emissiveIntensity={0.5}
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
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90 pointer-events-none" />
    </div>
  );
};

export default AIBackground;
