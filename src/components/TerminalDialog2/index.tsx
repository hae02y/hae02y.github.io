'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Dialog, DialogContentBare, DialogTitle } from '@/components/ui/dialog';
import PostIt3D from '@/components/PostIt3D';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const loadMacTerminal = () => import('@/components/MacTerminal');
const MacTerminal = dynamic(loadMacTerminal, { ssr: false });

export default function TerminalDialog2() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadMacTerminal();
    }, 200);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <PostIt3D onClick={() => setOpen(true)} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContentBare className="w-[min(94vw,920px)] h-[min(82vh,640px)] min-h-[420px] overflow-hidden bg-transparent flex">
          <VisuallyHidden>
            <DialogTitle className="text-lg">title</DialogTitle>
          </VisuallyHidden>
          <MacTerminal version="v1.0.0" title="hae02y" onClose={() => setOpen(false)} />
        </DialogContentBare>
      </Dialog>
    </>
  );
}
