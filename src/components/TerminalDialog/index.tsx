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
                        <p>👋 안녕하세요! 저는 <strong>정해영</strong>입니다.</p>
                        <p>🚀 백엔드/프론트엔드 개발을 다루며, React와 Spring Boot에 진심인 풀스택 개발자입니다.</p>
                        <p>📦 현재는 공공 API 및 JWT 기반 인증 시스템 설계에 집중하고 있어요.</p>
                        <p>🧠 기술 문서화, Swagger 자동화, API 설계를 좋아합니다.</p>
                        <p>🌱 사이드로는 블로그 및 오픈소스 문서화도 꾸준히 하고 있어요.</p>
                        <p className="text-blue-600 underline mt-2">터미널 열기 클릭 →</p>
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
