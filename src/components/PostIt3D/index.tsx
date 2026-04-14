import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface PostIt3DProps {
  onClick: () => void;
}

export default function PostIt3D({ onClick }: PostIt3DProps) {
  return (
    <BrowserOnly fallback={<div style={{ width: 340, height: 220 }} />}>
      {() => {
        // All Three.js imports MUST be inside BrowserOnly render function
        // to prevent SSR evaluation during static build
        const LazyCanvas = React.lazy(() =>
          import('./PostIt3DClient').then((mod) => ({ default: mod.default }))
        );

        return (
          <React.Suspense fallback={<div style={{ width: 340, height: 220 }} />}>
            <LazyCanvas onClick={onClick} />
          </React.Suspense>
        );
      }}
    </BrowserOnly>
  );
}
