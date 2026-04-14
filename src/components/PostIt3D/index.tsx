import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface PostIt3DProps {
  onClick: () => void;
}

function PostIt3DLoader({ onClick }: PostIt3DProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import('./PostIt3DClient').then((mod) => {
      setComponent(() => mod.PostIt3DClient);
    });
  }, []);

  if (!Component) {
    return <div style={{ width: 520, height: 400 }} />;
  }

  return <Component onClick={onClick} />;
}

export default function PostIt3D({ onClick }: PostIt3DProps) {
  return (
    <BrowserOnly fallback={<div style={{ width: 520, height: 400 }} />}>
      {() => <PostIt3DLoader onClick={onClick} />}
    </BrowserOnly>
  );
}
