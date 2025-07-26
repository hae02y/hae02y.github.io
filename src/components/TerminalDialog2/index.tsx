import React, {ReactNode, useState} from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@site/src/components/ui/dialog';
import MacTerminal from '@site/src/components/MacTerminal';
import { useColorMode } from '@docusaurus/theme-common';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


export default function TerminalDialog2() {
    const [open, setOpen] = useState(false);
    const { colorMode } = useColorMode(); // light / dark

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            <div className="border-black dark:border-white border px-5 py-5 cursor-pointer font-gray">
                      hi im hae02y, backend developer
                      <br/>
                      how are you?
                      <br/>
                      thank you for visiting here :)
                      </div>  
            </DialogTrigger>

            <DialogContent className="max-w-3xl p-0 overflow-hidden">
                <VisuallyHidden>
                    <DialogTitle className="text-lg">title</DialogTitle>
                </VisuallyHidden>
                <div
                    className={`w-full h-full ${
                        colorMode === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black'
                    }`}
                >
                    {/* 🖥️ 터미널 컴포넌트 */}
                    <MacTerminal version="v1.0.0" title="hae02y" />
                </div>
            </DialogContent>
        </Dialog>
    );
}
