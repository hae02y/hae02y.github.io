import React, {useEffect, useRef, useState} from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';

const MacTerminal = ({ title, version }) => {
    const terminalRef = useRef(null);
    const terminal = useRef(null);
    const inputBuffer = useRef("");  // 사용자 입력을 추적하는 버퍼
    const [openToggle , setOpenToggle ] = useState(false);

    useEffect( () => {
        console.log(openToggle);
    }, [openToggle])

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
            fitAddon.fit();
            terminalRef.current.style.outline = "none";
            terminalRef.current.tabIndex = 0;

            const prompt = `${title}@macbook:~$ `;
            const promptLength = prompt.length;

            // 초기 프롬프트 설정
            terminal.current.write(prompt);

            // 키 입력 이벤트 처리
            terminal.current.onKey(({ key, domEvent }) => {
                const char = domEvent.key;

                if (char === "Enter") {
                    terminal.current.writeln("");
                    terminal.current.write(prompt);
                    inputBuffer.current = "";  // 버퍼 리셋
                } else if (char === "Backspace") {
                    if (inputBuffer.current.length > 0) {
                        terminal.current.write('\b \b');
                        inputBuffer.current = inputBuffer.current.slice(0, -1);
                    }
                } else {
                    terminal.current.write(char);
                    inputBuffer.current += char;  // 입력 버퍼에 추가
                }
            });
        }

        return () => {
            terminal.current.dispose();
        };
    }, []);

    return (
        <div className="w-full h-[100%] rounded-lg shadow-md p-4">
            <div className="flex items-center mb-4 h-[5%]">
                <div className="flex gap-2">
                    <div className="bt red w-3 h-3 bg-red-500 rounded-full cursor-pointer"></div>
                    <div className="bt yellow w-3 h-3 bg-yellow-500 rounded-full cursor-pointer" onClick={(openToggle) => setOpenToggle(!openToggle)}></div>
                    <div className="bt green w-3 h-3 bg-green-500 rounded-full cursor-pointer"></div>
                </div>
                <div className="flex-grow text-center text-sm text-gray-400">
                    My Blog! {version}
                </div>
            </div>
            <div className="text-left w-full h-[90%] rounded-md p-4 font-mono text-lg leading-loose bg-gray-200 dark:bg-[#222222]">
                <div ref={terminalRef} className="terminal-container w-full h-full" />
            </div>
        </div>
    );
};

export default MacTerminal;
