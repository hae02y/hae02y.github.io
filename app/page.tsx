'use client';

import dynamic from 'next/dynamic';

const TerminalDialog2 = dynamic(
  () => import('@/components/TerminalDialog2'),
  { ssr: false }
);

export default function Home() {
  return (
    <main>
      <div className="h-[calc(100dvh-64px)] overflow-hidden dark:bg-[#1B1B1D]">
        <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-center px-4 font-mono md:justify-start">
          <TerminalDialog2 />
        </div>
      </div>
    </main>
  );
}
