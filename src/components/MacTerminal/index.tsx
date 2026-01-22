import React, { useEffect, useRef } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import MacToastButton from "@site/src/components/MacToast";
import "xterm/css/xterm.css";

const MacTerminal = ({ title, version, onClose }) => {
    return (
        <BrowserOnly fallback={<div>Loading...</div>}>
            {() => (
                <MacTerminalClient
                    title={title}
                    version={version}
                    onClose={onClose}
                />
            )}
        </BrowserOnly>
    );
};

const MacTerminalClient = ({ title, version, onClose }) => {
    const containerRef = useRef(null);
    const termRef = useRef(null);
    const inputBuffer = useRef("");

    useEffect(() => {
        let term, fitAddon, resizeObserver;

        const init = async () => {
            const { Terminal } = await import("xterm");
            const { FitAddon } = await import("xterm-addon-fit");

            term = new Terminal({
                cursorBlink: true,
                fontFamily: "SF Mono, Menlo, JetBrains Mono, monospace",
                fontSize: 13,
                lineHeight: 1.1,
                theme: {
                    background: "#0c0c0c",
                    foreground: "#e7e7e7",
                    cursor: "#e7e7e7",
                },
            });
            fitAddon = new FitAddon();

            term.loadAddon(fitAddon);
            term.open(containerRef.current);
            requestAnimationFrame(() => {
                fitAddon.fit();
            });
            term.focus();

            containerRef.current.addEventListener("click", () => {
                term.focus();
            });

            resizeObserver = new ResizeObserver(() => {
                fitAddon.fit();
            });
            resizeObserver.observe(containerRef.current);

            const prompt = () =>
                `\x1b[32m${title}\x1b[0m@\x1b[36mmacbook\x1b[0m:` +
                `\x1b[35m~\x1b[0m$ `;

            const handleCommand = (input: string) => {
                switch (input) {
                    case "hello":
                        term.writeln("\x1b[32m✅ Hello, " + title + "!\x1b[0m");
                        break;

                    case "help":
                        term.writeln("\x1b[90m----------------------------------------\x1b[0m");
                        term.writeln("\x1b[1mAvailable commands\x1b[0m");
                        term.writeln("\x1b[36m  hello\x1b[0m    - 인사");
                        term.writeln("\x1b[36m  clear\x1b[0m    - 터미널 초기화");
                        term.writeln("\x1b[36m  help\x1b[0m     - 명령어 목록");
                        term.writeln("\x1b[36m  git\x1b[0m      - GitHub 링크 출력");
                        term.writeln("\x1b[36m  blog\x1b[0m     - 블로그 링크 출력");
                        term.writeln("\x1b[36m  insight\x1b[0m  - 인사이트 링크 출력");
                        term.writeln("\x1b[90m----------------------------------------\x1b[0m");
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

            handleCommand("help");
            term.write(prompt());



            term.onKey(({ key, domEvent }) => {
                const char = domEvent.key;
                if (char === "Enter") {
                    term.writeln("");
                    handleCommand(inputBuffer.current.trim());
                    term.write(prompt());
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
            resizeObserver?.disconnect();
            termRef.current?.dispose();
        };
    }, [title]);

    return (
        <div className="terminal-frame">
            <div className="terminal-titlebar">
                <div className="terminal-lights">
                    <MacToastButton color="red" onClick={onClose} showToast={false} />
                    <MacToastButton color="green" showToast={false} />
                    <MacToastButton color="yellow" showToast={false} />
                </div>
                <span className="terminal-title">{title} — zsh</span>
                <span className="terminal-status">iTerm</span>
            </div>

            <div
                className="terminal-body"
            >
                <div ref={containerRef} className="terminal-screen" />
            </div>
        </div>
    );
};

export default MacTerminal;
