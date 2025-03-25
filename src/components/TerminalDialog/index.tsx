// src/components/ProfileTerminal.tsx

import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@site/src/components/ui/dialog';
import MacTerminal from '@site/src/components/MacTerminal';

export default function TerminalDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div
                    className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl ring-4 ring-white cursor-pointer"
                >
                    <img
                        src="/me.jpg"
                        alt="Profile"
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-3xl p-0 overflow-hidden">
                <MacTerminal version="v1.0.0" title="나의 터미널" />
            </DialogContent>
        </Dialog>
    );
}
