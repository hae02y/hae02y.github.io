import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useMouseTilt } from './useMouseTilt';

// Google Fonts - Caveat (자유 손글씨 스타일)
const HANDWRITING_FONT =
  'https://fonts.gstatic.com/s/caveat/v18/WnznHAc5bAfYB2QRah7pcpNvOx-pjfJ9SIKjYBxPigs.woff';

interface PostItSceneProps {
  onClick: () => void;
  darkMode?: boolean;
}

export default function PostItScene({ onClick, darkMode = false }: PostItSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tilt = useMouseTilt();

  // Paper geometry with realistic curl at bottom-right corner
  const paperGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2.6, 2.0, 32, 32);
    const pos = geo.attributes.position;
    const hw = 1.3;
    const hh = 1.0;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      const nx = (x + hw) / (hw * 2);
      const ny = (y + hh) / (hh * 2);

      let z = 0.008 * (x * x + y * y);

      // Bottom-right corner peel/curl
      const cornerDist = Math.sqrt(
        Math.pow(Math.max(0, nx - 0.7), 2) +
        Math.pow(Math.max(0, 0.3 - ny), 2)
      );
      if (cornerDist > 0) {
        z += cornerDist * 0.35;
      }

      // Slight wave along top edge (sticky part)
      if (ny > 0.85) {
        z -= 0.02 * Math.sin(nx * Math.PI * 2);
      }

      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = tilt.current.x;
      groupRef.current.rotation.y = tilt.current.y;
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={darkMode ? 0.55 : 0.45} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={0.9}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-3, 2, 2]} intensity={0.15} />

      <group ref={groupRef} position={[0, 0.05, 0]}>
        {/* Paper surface */}
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
            color="#f5de6b"
            side={THREE.DoubleSide}
            roughness={0.92}
            metalness={0}
          />
        </mesh>

        {/* Sticky strip at top */}
        <mesh position={[0, 0.82, 0.005]}>
          <planeGeometry args={[2.58, 0.25]} />
          <meshStandardMaterial
            color="#e8d05e"
            transparent
            opacity={0.5}
            roughness={0.95}
          />
        </mesh>

        {/* Tape */}
        <mesh position={[-0.1, 0.95, 0.04]} rotation={[0, 0, -0.06]}>
          <boxGeometry args={[0.9, 0.18, 0.008]} />
          <meshStandardMaterial
            color="#d4d4d4"
            transparent
            opacity={0.7}
            roughness={0.4}
            metalness={0.05}
          />
        </mesh>

        {/* Faint horizontal lines */}
        {[-0.1, -0.3, -0.5].map((y, i) => (
          <mesh key={i} position={[0, y, 0.003]}>
            <planeGeometry args={[2.2, 0.005]} />
            <meshBasicMaterial color="#e0c84a" transparent opacity={0.3} />
          </mesh>
        ))}

        {/* Title - handwriting */}
        <Text
          position={[-0.05, 0.45, 0.015]}
          fontSize={0.22}
          maxWidth={2.2}
          textAlign="center"
          color="#2a2a2a"
          anchorX="center"
          anchorY="middle"
          font={HANDWRITING_FONT}
          rotation={[0, 0, -0.02]}
        >
          hi, im hae02y
        </Text>

        <Text
          position={[0.05, 0.15, 0.015]}
          fontSize={0.15}
          maxWidth={2.2}
          textAlign="center"
          color="#4a4a4a"
          anchorX="center"
          anchorY="middle"
          font={HANDWRITING_FONT}
          rotation={[0, 0, 0.01]}
        >
          backend developer.
        </Text>

        {/* Body - handwriting */}
        <Text
          position={[0, -0.2, 0.015]}
          fontSize={0.12}
          maxWidth={2.2}
          textAlign="center"
          color="#3a3a3a"
          anchorX="center"
          anchorY="middle"
          lineHeight={1.7}
          font={HANDWRITING_FONT}
          rotation={[0, 0, -0.008]}
        >
          {'how are you?\nthank you for visiting here :)'}
        </Text>

        {/* Click hint - handwriting */}
        <Text
          position={[0.1, -0.68, 0.015]}
          fontSize={0.09}
          color="#887744"
          anchorX="center"
          anchorY="middle"
          font={HANDWRITING_FONT}
          rotation={[0, 0, 0.015]}
        >
          {'> click to open terminal'}
        </Text>
      </group>

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.5}
        blur={2}
        far={5}
        resolution={512}
      />
    </>
  );
}
