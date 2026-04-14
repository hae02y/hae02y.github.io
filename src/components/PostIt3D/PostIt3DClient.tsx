import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useColorMode } from '@docusaurus/theme-common';
import PostItScene from './PostItScene';

interface Props {
  onClick: () => void;
}

export function PostIt3DClient({ onClick }: Props) {
  const { colorMode } = useColorMode();
  const [size, setSize] = useState({ width: 520, height: 400 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) {
        setSize({ width: 320, height: 260 });
      } else if (window.innerWidth < 1024) {
        setSize({ width: 420, height: 340 });
      } else {
        setSize({ width: 520, height: 400 });
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
        camera={{ position: [0, 0, 4], fov: 35 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <PostItScene onClick={onClick} darkMode={colorMode === 'dark'} />
      </Canvas>
    </div>
  );
}
