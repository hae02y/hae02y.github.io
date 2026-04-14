import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useMouseTilt } from './useMouseTilt';

interface PostItSceneProps {
  onClick: () => void;
  darkMode?: boolean;
}

export default function PostItScene({ onClick, darkMode = false }: PostItSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tilt = useMouseTilt();

  // Curved paper geometry
  const paperGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2.4, 1.8, 20, 20);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, 0.015 * (x * x + y * y));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Apply tilt rotation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = tilt.current.x;
      groupRef.current.rotation.y = tilt.current.y;
    }
  });

  return (
    <>
      <ambientLight intensity={darkMode ? 0.6 : 0.5} />
      <directionalLight
        position={[2, 4, 3]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[512, 512]}
      />

      <group ref={groupRef} position={[0, 0.1, 0]}>
        {/* Paper */}
        <mesh
          geometry={paperGeometry}
          castShadow
          receiveShadow
          onPointerDown={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          <meshStandardMaterial
            color="#f6e27f"
            side={THREE.DoubleSide}
            roughness={0.85}
            metalness={0}
          />
        </mesh>

        {/* Tape */}
        <mesh position={[0, 0.85, 0.03]} rotation={[0, 0, 0.04]}>
          <boxGeometry args={[0.7, 0.15, 0.01]} />
          <meshStandardMaterial
            color="#e9e9e9"
            transparent
            opacity={0.85}
            roughness={0.6}
          />
        </mesh>

        {/* Title */}
        <Text
          position={[0, 0.35, 0.02]}
          fontSize={0.13}
          maxWidth={2.0}
          textAlign="center"
          color="#1b1b1b"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          hi im hae02y, backend developer
        </Text>

        {/* Body */}
        <Text
          position={[0, -0.05, 0.02]}
          fontSize={0.1}
          maxWidth={2.0}
          textAlign="center"
          color="#1b1b1b"
          anchorX="center"
          anchorY="middle"
          lineHeight={1.5}
        >
          {'how are you?\nthank you for visiting here :)'}
        </Text>

        {/* Click hint */}
        <Text
          position={[0, -0.55, 0.02]}
          fontSize={0.07}
          color="#666666"
          anchorX="center"
          anchorY="middle"
        >
          click to open terminal
        </Text>
      </group>

      <ContactShadows
        position={[0, -1.1, 0]}
        opacity={0.4}
        blur={2.5}
        far={4}
      />
    </>
  );
}
