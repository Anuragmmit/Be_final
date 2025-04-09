"use client";

import { Suspense, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

export function SpinningCube() {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="absolute top-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight">Dynamic 3D Cube</h1>
        <p className="mt-2 text-lg text-gray-300">
          Try spinning the cube with your mouse!
        </p>
      </div>
      <div className="relative flex h-[60vh] w-full max-w-4xl items-center justify-center cursor-grab border border-gray-700 rounded-lg shadow-xl">
        <Canvas
          camera={{ position: [0, 10, 50], fov: 75 }}
          shadows
          className="rounded-lg"
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <Suspense fallback={null}>
            <Cube />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
    </div>
  );
}

function Cube() {
  const ref = useRef();

  useFrame((state, delta) => {
    ref.current.rotation.x += delta * 0.6;
    ref.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={ref} scale={[20, 20, 20]} castShadow receiveShadow>
      <boxGeometry />
      <meshStandardMaterial color="#4f46e5" roughness={0.3} metalness={0.8} />
    </mesh>
  );
}
