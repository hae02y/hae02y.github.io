import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@site/src/components/ui/dialog';
import MacTerminal from '@site/src/components/MacTerminal';
import { useColorMode } from '@docusaurus/theme-common';

export default function TerminalDialog() {
    const [open, setOpen] = useState(false);
    const { colorMode } = useColorMode(); // light / dark

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex flex-col items-center space-y-4 cursor-pointer group">
                    {/* 👤 프로필 이미지 */}
                    <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl ring-4 ring-white group-hover:scale-105 transition-transform duration-500">
                        <img
                            src="/img/me.jpg"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* 📄 소개글 (이미지 아래) */}
                    <div className="text-sm leading-relaxed space-y-2 text-center max-w-md px-4">
                        <p className="leading-relaxed">백엔드개발자 | hae02y</p>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-3xl p-0 overflow-hidden">
                <div
                    className={`w-full h-full ${
                        colorMode === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black'
                    }`}
                >
                    {/* 🖥️ 터미널 컴포넌트 */}
                    <MacTerminal version="v1.0.0" title="나의 터미널" />
                </div>
            </DialogContent>
        </Dialog>
    );
}
