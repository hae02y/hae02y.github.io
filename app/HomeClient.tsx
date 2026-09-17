'use client';

import dynamic from 'next/dynamic';

const TerminalDialog2 = dynamic(
  () => import('@/components/TerminalDialog2'),
  { ssr: false },
);

export default function HomeClient() {
  return (
    <div className="flex min-h-[380px] items-center justify-center overflow-hidden">
      <div className="flex w-full items-center justify-center font-mono">
        <TerminalDialog2 />
      </div>
    </div>
  );
}
