import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useColorMode } from '@docusaurus/theme-common';
import PostItScene from './PostItScene';

interface Props {
  onClick: () => void;
}

export function PostIt3DClient({ onClick }: Props) {
  const { colorMode } = useColorMode();
  const [size, setSize] = useState({ width: 340, height: 220 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 768) {
        setSize({ width: 280, height: 180 });
      } else {
        setSize({ width: 340, height: 220 });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    setReady(true);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (!ready) {
    return <div style={{ width: size.width, height: size.height }} />;
  }

  return (
    <div style={{ width: size.width, height: size.height }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 3.5], fov: 40 }}
        dpr={[1, 2]}
        gl={{ alpha: true }}
        style={{ background: 'transparent' }}
      >
        <PostItScene onClick={onClick} darkMode={colorMode === 'dark'} />
      </Canvas>
    </div>
  );
}
