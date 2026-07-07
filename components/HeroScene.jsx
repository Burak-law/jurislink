"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const BURGUNDY = "#800020";
const CREAM = "#F5F5DC";

function Pan({ side }) {
  const armX = side * 1.1;
  return (
    <group>
      <mesh position={[armX, 0.02, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
        <meshStandardMaterial color={CREAM} roughness={0.35} metalness={0.5} />
      </mesh>
      <mesh position={[armX, -0.38, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.28, 0.08, 32, 1, true]} />
        <meshStandardMaterial
          color={BURGUNDY}
          roughness={0.25}
          metalness={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// The whole assembly gently swings, and additionally responds to the
// pointer's horizontal position for a subtle parallax feel — moving your
// mouse "looks around" the object slightly, without ever spinning it fully
// edge-on (which would flatten this mostly-2D silhouette to a line).
function ScalesOfJustice() {
  const groupRef = useRef(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const swing = Math.sin(state.clock.elapsedTime * 0.3) * 0.35;
    const parallax = pointer.x * 0.25;
    groupRef.current.rotation.y +=
      (swing + parallax - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x +=
      (pointer.y * -0.08 - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.2, 32]} />
        <meshStandardMaterial color={CREAM} roughness={0.3} metalness={0.4} />
      </mesh>

      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 16]} />
        <meshStandardMaterial color={CREAM} roughness={0.3} metalness={0.4} />
      </mesh>

      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={BURGUNDY} roughness={0.2} metalness={0.6} />
      </mesh>

      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[2.2, 0.05, 0.05]} />
        <meshStandardMaterial color={BURGUNDY} roughness={0.2} metalness={0.6} />
      </mesh>

      <Pan side={-1} />
      <Pan side={1} />
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.75]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <directionalLight position={[-3, -2, -4]} intensity={0.25} />
        <Suspense fallback={null}>
          {/* Adds soft, realistic reflections to the metal-look materials
              above — fetched from a small hosted HDRI, cached by the browser. */}
          <Environment preset="city" />
          <Float speed={1.1} rotationIntensity={0.1} floatIntensity={0.6}>
            <ScalesOfJustice />
          </Float>
          <ContactShadows
            position={[0, -1.75, 0]}
            opacity={0.35}
            scale={6}
            blur={2.5}
            far={2}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
