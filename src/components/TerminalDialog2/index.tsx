'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Dialog, DialogContentBare, DialogTitle } from '@/components/ui/dialog';
import PostIt3D from '@/components/PostIt3D';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const MacTerminal = dynamic(() => import('@/components/MacTerminal'), { ssr: false });

export default function TerminalDialog2() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PostIt3D onClick={() => setOpen(true)} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContentBare className="w-[94vw] h-[90vh] max-h-[90vh] max-w-3xl overflow-hidden bg-transparent flex">
          <VisuallyHidden>
            <DialogTitle className="text-lg">title</DialogTitle>
          </VisuallyHidden>
          <MacTerminal version="v1.0.0" title="hae02y" onClose={() => setOpen(false)} />
        </DialogContentBare>
      </Dialog>
    </>
  );
}
