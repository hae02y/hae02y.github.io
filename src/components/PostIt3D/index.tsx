import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';

interface PostIt3DProps {
  onClick: () => void;
}

function PostIt3DCanvas({ onClick }: PostIt3DProps) {
  const { colorMode } = useColorMode();
  const [size, setSize] = useState({ width: 340, height: 220 });

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
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Lazy import to avoid SSR issues
  const [SceneModule, setSceneModule] = useState<{
    Canvas: any;
    PostItScene: any;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      import('@react-three/fiber'),
      import('./PostItScene'),
    ]).then(([fiber, scene]) => {
      setSceneModule({
        Canvas: fiber.Canvas,
        PostItScene: scene.default,
      });
    });
  }, []);

  if (!SceneModule) {
    return <div style={{ width: size.width, height: size.height }} />;
  }

  const { Canvas, PostItScene } = SceneModule;

  return (
    <div style={{ width: size.width, height: size.height }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 3.5], fov: 40 }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <PostItScene onClick={onClick} darkMode={colorMode === 'dark'} />
      </Canvas>
    </div>
  );
}

export default function PostIt3D({ onClick }: PostIt3DProps) {
  return (
    <BrowserOnly fallback={<div style={{ width: 340, height: 220 }} />}>
      {() => <PostIt3DCanvas onClick={onClick} />}
    </BrowserOnly>
  );
}
