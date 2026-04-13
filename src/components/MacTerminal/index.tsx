import React, { useEffect, useRef, useCallback } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import MacToastButton from "@site/src/components/MacToast";
import { useTerminalEngine } from "./useTerminalEngine";
import { commandRegistry } from "./commands";
import type { CommandContext, Profile, SkillCategory, Experience, Link } from "./types";
import "xterm/css/xterm.css";

interface MacTerminalProps {
  title: string;
  version: string;
  onClose?: () => void;
}

const MacTerminal = ({ title, version, onClose }: MacTerminalProps) => {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => (
        <MacTerminalClient title={title} version={version} onClose={onClose} />
      )}
    </BrowserOnly>
  );
};

const MacTerminalClient = ({ title, version, onClose }: MacTerminalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<import("xterm").Terminal | null>(null);
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();

  const customFields = siteConfig.customFields as {
    profile: Profile;
    skills: { categories: SkillCategory[] };
    experience: Experience[];
    links: Link[];
  };

  const navigate = useCallback(
    (path: string) => {
      onClose?.();
      setTimeout(() => history.push(path), 100);
    },
    [history, onClose],
  );

  const openExternal = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const getContext = useCallback(
    (): CommandContext => ({
      term: termRef.current!,
      title,
      profile: customFields.profile,
      skills: customFields.skills,
      experience: customFields.experience,
      links: customFields.links,
      navigate,
      openExternal,
    }),
    [title, customFields, navigate, openExternal],
  );

  const { handleKey, prompt } = useTerminalEngine({
    title,
    getContext,
  });

  useEffect(() => {
    let resizeObserver: ResizeObserver | undefined;

    const init = async () => {
      const { Terminal } = await import("xterm");
      const { FitAddon } = await import("xterm-addon-fit");

      const term = new Terminal({
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
      const fitAddon = new FitAddon();

      term.loadAddon(fitAddon);
      term.open(containerRef.current!);
      requestAnimationFrame(() => fitAddon.fit());
      term.focus();

      containerRef.current!.addEventListener("click", () => term.focus());

      resizeObserver = new ResizeObserver(() => fitAddon.fit());
      resizeObserver.observe(containerRef.current!);

      // Show help on init
      const helpCmd = commandRegistry.get("help");
      const result = helpCmd?.handler([], {
        term,
        title,
        profile: customFields.profile,
        skills: customFields.skills,
        experience: customFields.experience,
        links: customFields.links,
        navigate,
        openExternal,
      });
      if (result && result.lines) {
        for (const line of result.lines) {
          term.writeln(line);
        }
      }
      term.write(prompt());

      // Wire key handler
      term.onKey(({ key, domEvent }) => {
        handleKey(key, domEvent, term);
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

      <div className="terminal-body">
        <div ref={containerRef} className="terminal-screen" />
      </div>
    </div>
  );
};

export default MacTerminal;
