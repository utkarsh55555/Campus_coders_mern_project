import React, { Suspense, useRef, useEffect, useState, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Coin({ position, scale = 1, speed = 1 }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <cylinderGeometry args={[0.45, 0.45, 0.08, 24]} />
      <meshStandardMaterial color="#c4b5fd" metalness={0.75} roughness={0.3} emissive="#7c3aed" emissiveIntensity={0.25} />
    </mesh>
  );
}

function GlassCard({ position, rotation, color = '#a78bfa' }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[1.6, 1.05, 0.06]} />
      <meshStandardMaterial color={color} transparent opacity={0.35} metalness={0.2} roughness={0.25} />
    </mesh>
  );
}

function HoloBars({ position }) {
  const group = useRef();
  const heights = useRef([0.4, 0.7, 1.1, 0.85, 1.35, 0.95, 1.5]);
  const colors = ['#e879f9', '#8b5cf6', '#22d3ee', '#a78bfa', '#d946ef', '#06b6d4', '#c084fc'];

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const target = heights.current[i] * (0.8 + Math.sin(t * 1.2 + i) * 0.2);
      child.scale.y = THREE.MathUtils.lerp(child.scale.y, target, 0.06);
      child.position.y = child.scale.y / 2;
    });
  });

  return (
    <group ref={group} position={position}>
      {heights.current.map((h, i) => (
        <mesh key={i} position={[(i - 3) * 0.28, h / 2, 0]} scale={[0.18, h, 0.18]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.4} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  const root = useRef();
  useFrame((_, delta) => {
    if (root.current) root.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={root}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 3]} intensity={0.85} color="#e9d5ff" />
      <pointLight position={[-3, 2, 1]} intensity={0.7} color="#e879f9" />

      <Coin position={[-2.1, 0.7, 0.3]} scale={1} speed={0.7} />
      <Coin position={[2.2, -0.1, 0.4]} scale={0.8} speed={1} />
      <GlassCard position={[-1, -0.2, 0]} rotation={[0.12, -0.35, 0.06]} />
      <GlassCard position={[1.2, 0.45, -0.2]} rotation={[-0.08, 0.45, -0.04]} color="#e879f9" />
      <HoloBars position={[0, -0.85, 0.15]} />
    </group>
  );
}

function HeroScene() {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 768px)');
    const update = () => setReduced(mq.matches || mobile.matches);
    update();
    mq.addEventListener?.('change', update);
    mobile.addEventListener?.('change', update);
    return () => {
      mq.removeEventListener?.('change', update);
      mobile.removeEventListener?.('change', update);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (reduced) {
    return (
      <div ref={containerRef} className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-500/25 blur-[80px]" />
        <div className="absolute right-1/4 top-1/2 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-[60px]" />
        <div className="absolute left-1/4 bottom-1/3 h-36 w-36 rounded-full bg-cyan-400/15 blur-[50px]" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 h-full w-full">
      {visible && (
        <Canvas
          dpr={[1, 1.25]}
          camera={{ position: [0, 0.35, 6], fov: 42 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
          frameloop="always"
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

export default memo(HeroScene);
