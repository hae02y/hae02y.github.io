'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MacToastButton from '@/components/MacToast';
import { useTerminalEngine } from './useTerminalEngine';
import { welcomeBanner } from './commands';
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
      navigate,
      openExternal,
    }),
    [title, navigate, openExternal],
  );

  const { handleKey, prompt } = useTerminalEngine({
    title,
    getContext,
  });

  useEffect(() => {
    let resizeObserver: ResizeObserver | undefined;
    let disposed = false;
    let animationFrame: number | undefined;
    let settleTimeout: ReturnType<typeof setTimeout> | undefined;
    let keyDisposable: { dispose: () => void } | undefined;
    let clickHandler: (() => void) | undefined;
    let terminal: import('xterm').Terminal | undefined;

    const init = async () => {
      const { Terminal } = await import('xterm');
      const { FitAddon } = await import('xterm-addon-fit');

      if (disposed || !containerRef.current) return;

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
      terminal = term;

      term.loadAddon(fitAddon);
      term.open(containerRef.current!);

      if (disposed) {
        term.dispose();
        return;
      }

      const fit = () => {
        try {
          fitAddon.fit();
        } catch {
          // xterm can briefly report zero dimensions while the dialog animates in.
        }
      };

      const scheduleFit = () => {
        if (animationFrame !== undefined) return;
        animationFrame = requestAnimationFrame(() => {
          animationFrame = undefined;
          if (!disposed) fit();
        });
      };

      scheduleFit();
      settleTimeout = setTimeout(scheduleFit, 160);
      term.focus();

      clickHandler = () => term.focus();
      containerRef.current!.addEventListener('click', clickHandler);

      resizeObserver = new ResizeObserver(scheduleFit);
      resizeObserver.observe(containerRef.current!);

      term.write(`${welcomeBanner.join('\r\n')}\r\n`);
      term.write(prompt());

      keyDisposable = term.onKey(({ key, domEvent }) => {
        handleKey(key, domEvent, term);
      });

      termRef.current = term;
    };

    init();

    return () => {
      disposed = true;
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
      if (settleTimeout !== undefined) clearTimeout(settleTimeout);
      resizeObserver?.disconnect();
      keyDisposable?.dispose();
      if (clickHandler && containerRef.current) {
        containerRef.current.removeEventListener('click', clickHandler);
      }
      terminal?.dispose();
      termRef.current = null;
    };
  }, [title, handleKey, prompt]);

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
