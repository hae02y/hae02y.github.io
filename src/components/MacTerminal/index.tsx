'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/config/site';
import MacToastButton from '@/components/MacToast';
import { useTerminalEngine } from './useTerminalEngine';
import { commandRegistry, welcomeBanner } from './commands';
import type { Profile, SkillCategory, Experience, Link as TermLink } from './types';
import 'xterm/css/xterm.css';

interface MacTerminalProps {
  title: string;
  version: string;
  onClose?: () => void;
}

export default function MacTerminal({ title, version, onClose }: MacTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<import('xterm').Terminal | null>(null);
  const router = useRouter();

  const profile = siteConfig.profile as Profile;
  const skills = siteConfig.skills as { categories: SkillCategory[] };
  const experience = siteConfig.experience as Experience[];
  const links = siteConfig.terminalLinks as TermLink[];

  const navigate = useCallback(
    (path: string) => {
      onClose?.();
      setTimeout(() => router.push(path), 100);
    },
    [router, onClose],
  );

  const openExternal = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const getContext = useCallback(
    (): any => ({
      term: termRef.current!,
      title,
      profile,
      skills,
      experience,
      links,
      navigate,
      openExternal,
    }),
    [title, profile, skills, experience, links, navigate, openExternal],
  );

  const { handleKey, prompt } = useTerminalEngine({
    title,
    getContext,
  });

  useEffect(() => {
    let resizeObserver: ResizeObserver | undefined;

    const init = async () => {
      const { Terminal } = await import('xterm');
      const { FitAddon } = await import('xterm-addon-fit');

      const term = new Terminal({
        convertEol: true,
        cursorBlink: true,
        fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
        fontSize: 14,
        lineHeight: 1.35,
        scrollback: 1000,
        theme: {
          background: '#0b0d10',
          foreground: '#e7edf3',
          cursor: '#8bd5ff',
          selectionBackground: '#2d4f67',
        },
      });
      const fitAddon = new FitAddon();

      term.loadAddon(fitAddon);
      term.open(containerRef.current!);

      const fit = () => {
        try {
          fitAddon.fit();
        } catch {
          // xterm can briefly report zero dimensions while the dialog animates in.
        }
      };

      requestAnimationFrame(() => {
        fit();
        requestAnimationFrame(fit);
      });
      term.focus();

      containerRef.current!.addEventListener('click', () => term.focus());

      resizeObserver = new ResizeObserver(fit);
      resizeObserver.observe(containerRef.current!);

      for (const line of welcomeBanner) {
        term.writeln(line);
      }
      term.write(prompt());

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
        <div className="terminal-lights" aria-label="window controls">
          <MacToastButton color="red" onClick={onClose} showToast={false} />
          <MacToastButton color="yellow" showToast={false} />
          <MacToastButton color="green" showToast={false} />
        </div>
        <span className="terminal-title">{title}@macbook: ~</span>
        <span className="terminal-status">{version}</span>
      </div>
      <div className="terminal-body">
        <div ref={containerRef} className="terminal-screen" />
      </div>
    </div>
  );
}
