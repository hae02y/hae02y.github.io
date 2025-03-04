import React, { useEffect, useRef, useState } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import MacToastButton from "@site/src/components/MacToast";

const MacTerminal = ({ title, version }) => {
    return (
        <BrowserOnly fallback={<div>Loading...</div>}>
            {() => <MacTerminalClient title={title} version={version} />}
        </BrowserOnly>
    );
};

const MacTerminalClient = ({ title, version }) => {
    const terminalRef = useRef(null);
    const terminal = useRef(null);
    const inputBuffer = useRef(""); // 사용자 입력을 추적하는 버퍼
    const [Terminal, setTerminal] = useState(null);
    const [FitAddon, setFitAddon] = useState(null);

    useEffect(() => {
        async function loadXterm() {
            const { Terminal } = await import("xterm");
            const { FitAddon } = await import("xterm-addon-fit");
            setTerminal(() => Terminal);
            setFitAddon(() => FitAddon);
        }
        loadXterm();
    }, []);

    useEffect(() => {
        if (!terminalRef.current || !Terminal || !FitAddon) return;

        const term = new Terminal({ cursorBlink: true });
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        fitAddon.fit();
        terminalRef.current.style.outline = "none";
        terminalRef.current.tabIndex = 0;

        const prompt = `${title}@macbook:~$ `;
        term.write(prompt);

        term.onKey(({ key, domEvent }) => {
            const char = domEvent.key;
            if (char === "Enter") {
                term.writeln("");
                term.write(prompt);
                inputBuffer.current = "";
            } else if (char === "Backspace") {
                if (inputBuffer.current.length > 0) {
                    term.write("\b \b");
                    inputBuffer.current = inputBuffer.current.slice(0, -1);
                }
            } else {
                term.write(char);
                inputBuffer.current += char;
            }
        });

        return () => term.dispose();
    }, [Terminal, FitAddon]);

    return (
        <div className="w-full h-[100%] rounded-lg p-4">
            <div className="flex items-center mb-4 h-[5%]">
                <div className="flex gap-2">
                    <MacToastButton color={"red"} />
                    <MacToastButton color={"green"} />
                    <MacToastButton color={"yellow"} />
                </div>
                <div className="flex-grow text-center text-sm text-gray-400">
                    My Blog! {version}
                </div>
            </div>
            <div className="text-left w-full h-[90%] rounded-md shadow-lg p-4 font-mono text-lg leading-loose bg-gray-100 dark:bg-[#222222]">
                <div ref={terminalRef} className="terminal-container w-full h-full" />
            </div>
        </div>
    );
};

export default MacTerminal;
