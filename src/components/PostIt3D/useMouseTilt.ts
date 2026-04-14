import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MAX_TILT = 0.15;
const DAMPING = 0.08;

export function useMouseTilt() {
  const { gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia('(hover: none)').matches);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const el = gl.domElement;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleLeave = () => {
      mouse.current.x = 0;
      mouse.current.y = 0;
    };

    el.addEventListener('pointermove', handleMove);
    el.addEventListener('pointerleave', handleLeave);

    return () => {
      el.removeEventListener('pointermove', handleMove);
      el.removeEventListener('pointerleave', handleLeave);
    };
  }, [gl, isMobile]);

  useFrame(() => {
    if (isMobile) {
      rotation.current.x = 0;
      rotation.current.y = 0;
      return;
    }

    const targetX = -mouse.current.y * MAX_TILT;
    const targetY = mouse.current.x * MAX_TILT;

    rotation.current.x = THREE.MathUtils.lerp(rotation.current.x, targetX, DAMPING);
    rotation.current.y = THREE.MathUtils.lerp(rotation.current.y, targetY, DAMPING);
  });

  return rotation;
}
