'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Stars, Preload } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function Geometries() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, Math.cos(t / 2) / 10 + 0.25, 0.1);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t / 4) / 10, 0.1);
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[2, 0, -2]}>
          <icosahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial color="#4f46e5" roughness={0.1} metalness={0.5} />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[-2, -1, 0]}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#8b5cf6" roughness={0.1} metalness={0.2} />
        </mesh>
      </Float>

      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[1, 2, -3]}>
          <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />
          <meshStandardMaterial color="#ec4899" roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>

      <Float speed={4} rotationIntensity={3}>
        <mesh position={[-1, 2, 1]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
        </mesh>
      </Float>
    </group>
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />

          <Geometries />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          <Environment preset="city" />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}