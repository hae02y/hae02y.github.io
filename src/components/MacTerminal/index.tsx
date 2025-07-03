import React, { useEffect, useRef } from "react";
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
                    background: "#000000",
                    foreground: "#FFFFFF",
                    cursor: "#000000",
                },
            });
            fitAddon = new FitAddon();

            term.loadAddon(fitAddon);
            term.open(containerRef.current);
            fitAddon.fit();
            term.focus();

            containerRef.current.addEventListener("click", () => {
                term.focus();
            });

            const prompt = `${title}@macbook:~$ `;
            term.write(prompt);

            const handleCommand = (input: string) => {
                switch (input) {
                    case "hello":
                        term.writeln("\x1b[32m✅ Hello, " + title + "!\x1b[0m");
                        break;

                    case "help":
                        term.writeln("\x1b[34m📖 Available commands:\x1b[0m");
                        term.writeln("\x1b[34m  hello   - 인사\x1b[0m");
                        term.writeln("\x1b[34m  clear   - 터미널 초기화\x1b[0m");
                        term.writeln("\x1b[34m  help    - 명령어 목록\x1b[0m");
                        term.writeln("\x1b[34m  git     - GitHub 링크 출력\x1b[0m");
                        term.writeln("\x1b[34m  blog    - 블로그 링크 출력\x1b[0m");
                        term.writeln("\x1b[34m  insight - 인사이트 링크 출력\x1b[0m");
                        break;

                    case "clear":
                        term.clear();
                        break;

                    case "git":
                        term.writeln(
                            "\x1b[36m🌐 GitHub: \x1b]8;;https://github.com/hae02y\x1b\\https://github.com/hae02y\x1b]8;;\x1b\\\x1b[0m"
                        );
                        break;

                    case "blog":
                        term.writeln(
                            "\x1b[35m📝 Blog: \x1b]8;;https://hae02y.dev/blog\x1b\\https://hae02y.dev/blog\x1b]8;;\x1b\\\x1b[0m"
                        );
                        break;

                    case "insight":
                        term.writeln(
                            "\x1b[33m🔍 Insight: \x1b]8;;https://hae02y.dev/insight\x1b\\https://hae02y.dev/insight\x1b]8;;\x1b\\\x1b[0m"
                        );
                        break;

                    case "":
                        break;

                    default:
                        term.writeln(`\x1b[31m❌ Command not found: ${input}\x1b[0m`);
                }
            };



            term.onKey(({ key, domEvent }) => {
                const char = domEvent.key;
                if (char === "Enter") {
                    term.writeln("");
                    handleCommand(inputBuffer.current.trim());
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
        <div className="w-full h-full border border-black font-mono p-2 bg-white dark:bg-black text-black dark:text-white">
            <div className="flex items-center justify-between mb-2 border-b border-black px-2 py-1">
                <div className="flex gap-1">
                    <MacToastButton color="red" />
                    <MacToastButton color="green" />
                    <MacToastButton color="yellow" />
                </div>

            </div>

            <div
                ref={containerRef}
                className="w-full h-[300px] bg-black text-white font-mono text-xs p-2 border-t border-black"
            />
        </div>
    );
};

export default MacTerminal;
