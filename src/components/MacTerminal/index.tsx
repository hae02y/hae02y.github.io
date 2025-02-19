import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css'; // xterm.js 스타일 추가
import { FitAddon } from 'xterm-addon-fit';

const MacTerminal = ({ title, version }) => {
    const terminalRef = useRef(null); // 터미널 DOM을 위한 ref
    const terminal = useRef(null); // xterm.js 터미널 인스턴스

    useEffect(() => {
        // 터미널 인스턴스 생성
        terminal.current = new Terminal({
            cursorBlink: true,
        });

        // FitAddon 인스턴스 생성
        const fitAddon = new FitAddon();
        terminal.current.loadAddon(fitAddon);

        if (terminalRef.current) {
            terminal.current.open(terminalRef.current);
            fitAddon.fit(); // 터미널 크기 조정
            terminalRef.current.style.outline = "none"; // 포커스 시 아웃라인 제거
            terminalRef.current.tabIndex = 0; // 키보드 입력을 위해 tabIndex 설정

            terminalRef.current.focus(); // 마운트 시 포커스 설정
        }

        // 컴포넌트 해제 시 터미널 인스턴스 해제
        return () => {
            terminal.current.dispose();
        };
    }, []);

    return (
        <div className="w-full h-[100%] text-white rounded-lg shadow-lg p-4">
            {/* 윈도우 컨트롤 바 */}
            <div className="flex items-center mb-4 h-[10%]">
                <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-grow text-center text-sm text-gray-400">
                    My Blog! {version}
                </div>
            </div>
            {/* 내용 */}
            <div className="text-left bg-black w-full h-[80%] rounded-md p-4 font-mono text-lg leading-loose">
                <span className="text-green-400">{title}@macbook</span>
                <span className="text-white">:~$ </span>
                {/* xterm.js 터미널 컨테이너 */}
                <div ref={terminalRef} className="terminal-container" />
            </div>
        </div>
    );
};

export default MacTerminal;
