import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface PostIt3DProps {
  onClick: () => void;
}

function PostIt3DInner({ onClick }: PostIt3DProps) {
  // require 방식으로 클라이언트에서만 동기 로드
  const { PostIt3DClient } = require('./PostIt3DClient');
  return <PostIt3DClient onClick={onClick} />;
}

export default function PostIt3D({ onClick }: PostIt3DProps) {
  return (
    <BrowserOnly fallback={<div style={{ width: 340, height: 220 }} />}>
      {() => <PostIt3DInner onClick={onClick} />}
    </BrowserOnly>
  );
}
