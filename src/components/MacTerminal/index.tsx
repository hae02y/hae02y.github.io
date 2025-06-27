import React, { useEffect, useRef, useState } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import MacToastButton from "@site/src/components/MacToast";
import "xterm/css/xterm.css";

const MacTerminal = ({ title, version }) => {
    return (
        <BrowserOnly fallback={<div>Loading...</div>}>
            {() => <MacTerminalClient title={title} version={version} />}
        </BrowserOnly>
    );
};

const MacTerminalClient = ({ title, version }) => {
    const containerRef = useRef(null);
    const termRef = useRef(null);
    const inputBuffer = useRef("");
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;


    useEffect(() => {
        let term, fitAddon;

        const init = async () => {
            const { Terminal } = await import("xterm");
            const { FitAddon } = await import("xterm-addon-fit");

            term = new Terminal({
                cursorBlink: true,
                fontFamily: "JetBrains Mono",
                fontSize: 14,
                lineHeight: 1,
                theme: {
                    background: "#1e1e1e",       // 진한 다크
                    foreground: "#d4d4d4",       // 부드러운 회색 글자
                    cursor: "#ffcc00",           // 노란색 커서
                    black: "#000000",
                    red: "#f7768e",
                    green: "#9ece6a",
                    yellow: "#e0af68",
                    blue: "#7aa2f7",
                    magenta: "#bb9af7",
                    cyan: "#7dcfff",
                    white: "#c0caf5",
                    brightBlack: "#1f2335",
                    brightRed: "#f7768e",
                    brightGreen: "#9ece6a",
                    brightYellow: "#e0af68",
                    brightBlue: "#7aa2f7",
                    brightMagenta: "#bb9af7",
                    brightCyan: "#7dcfff",
                    brightWhite: "#ffffff",
                },
            });
            fitAddon = new FitAddon();

            term.loadAddon(fitAddon);
            term.open(containerRef.current);
            fitAddon.fit();
            term.focus(); // ✅ 꼭 필요

            // 포커스를 유지할 수 있도록 클릭 이벤트로 다시 포커스
            containerRef.current.addEventListener("click", () => {
                term.focus();
            });

            const prompt = `${title}@macbook:~$ `;
            term.write(prompt);

            const handleCommand = (input) => {
                switch (input) {
                    case "hello":
                        term.writeln("Hello, " + title + "!");
                        break;
                    case "help":
                        term.writeln("Available commands:");
                        term.writeln("  hello - 인사");
                        term.writeln("  clear - 터미널 초기화");
                        term.writeln("  help  - 명령어 목록");
                        break;
                    case "clear":
                        term.clear();
                        break;
                    case "":
                        // do nothing
                        break;
                    default:
                        term.writeln(`Command not found: ${input}`);
                }
            };


            term.onKey(({ key, domEvent }) => {
                const char = domEvent.key;
                if (char === "Enter") {
                    term.writeln("");
                    handleCommand(inputBuffer.current.trim()); // 여기서 사용됨
                    term.write(prompt);
                    inputBuffer.current = "";
                } else if (char === "Backspace") {
                    if (inputBuffer.current.length > 0) {
                        term.write("\b \b");
                        inputBuffer.current = inputBuffer.current.slice(0, -1);
                    }
                } else if (char.length === 1) {
                    term.write(char);
                    inputBuffer.current += char;
                }
            });

            termRef.current = term;
        };

        init();

        return () => {
            termRef.current?.dispose();
        };
    }, [title]);

    return (
        <div className="w-full h-full rounded-lg p-4">
            <div className="flex items-center mb-4 h-[5%]">
                <div className="flex gap-2">
                    <MacToastButton color="red" />
                    <MacToastButton color="green" />
                    <MacToastButton color="yellow" />
                </div>
                <div className="flex-grow text-center text-sm text-gray-400">
                    My Blog! {version}
                </div>
            </div>

            <div className="text-left w-full h-[90%] rounded-md shadow-lg p-4 font-mono text-lg bg-gray-100 dark:bg-[#222222]">
                <div
                    ref={containerRef}
                    className="terminal-container w-full h-full"
                    style={{ minHeight: "300px" }}
                />
            </div>
        </div>
    );
};

export default MacTerminal;
