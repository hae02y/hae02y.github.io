import React, {ReactNode, useState} from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import MacTerminal from '@/components/MacTerminal';
import { useTheme } from 'next-themes';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


export default function TerminalDialog() {
    const [open, setOpen] = useState(false);
    const { theme: colorMode } = useTheme(); // light / dark

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex w-80 h-64 md:w-96 md:h-80 lg:w-96 lg:h-80 2xl:w-[90%] 2xl:h-[80%] flex-col items-center space-y-4 cursor-pointer group">
                    {/* 👤 프로필 이미지 */}
                    <div className="w-full h-full border border-gray-950 dark:border-white bg-white">
                        <img
                            src=""
                            alt="Profile"
                            className="w-full h-full contrast-125"
                        />
                    </div>

                    {/* 📄 소개글 (이미지 아래) */}
                    <div className="text-sm leading-relaxed space-y-2 text-center max-w-md px-4 py-2">
                        <p className="font-mono text-2xl font-bold text-gray-800 dark:text-white">Backend Developer.</p>
                    </div>
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
