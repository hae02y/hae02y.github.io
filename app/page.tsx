'use client';

import dynamic from 'next/dynamic';

const TerminalDialog2 = dynamic(
  () => import('@/components/TerminalDialog2'),
  { ssr: false }
);

export default function Home() {
  return (
    <main>
      <div className="h-[calc(100dvh-64px)] dark:bg-[#23262C] flex overflow-hidden">
        <div className="h-full flex w-full flex-col">
          <div className="lg:flex h-full dark:from-[#1B1B1D] dark:bg-[#1B1B1D]">
            <div className="h-full font-mono w-full lg:h-full flex items-center justify-center lg:justify-start lg:pl-[12%]">
              <TerminalDialog2 />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
