import { useRef, useCallback } from 'react';
import type { Terminal } from 'xterm';
import type { CommandContext } from './types';
import { commandRegistry, commandNames } from './commands';

interface TerminalEngineOptions {
  title: string;
  getContext: () => CommandContext;
}

// Visible prompt length (characters without ANSI codes)
// "title@macbook:~$ " → title.length + "@macbook:~$ ".length
const promptVisibleLength = (title: string) => title.length + 12;

export function useTerminalEngine({ title, getContext }: TerminalEngineOptions) {
  const inputBuffer = useRef('');
  const historyBuffer = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const pendingInput = useRef('');
  const isAnimating = useRef(false);
  const skipAnimation = useRef(false);

  const prompt = useCallback(
    () =>
      `\x1b[32m${title}\x1b[0m@\x1b[36mmacbook\x1b[0m:` +
      `\x1b[35m~\x1b[0m$ `,
    [title],
  );

  // ── Typing animation ──
  const writeAnimated = useCallback(
    async (term: Terminal, lines: string[]) => {
      isAnimating.current = true;
      skipAnimation.current = false;

      for (const line of lines) {
        if (skipAnimation.current) {
          term.writeln(line);
          continue;
        }

        for (let i = 0; i < line.length; i++) {
          if (skipAnimation.current) {
            term.write(line.slice(i));
            break;
          }
          term.write(line[i]);
          await new Promise((r) => setTimeout(r, 6));
        }
        term.writeln('');

        if (!skipAnimation.current) {
          await new Promise((r) => setTimeout(r, 20));
        }
      }

      isAnimating.current = false;
    },
    [],
  );

  // ── Clear current input line ──
  const clearLine = useCallback(
    (term: Terminal) => {
      const len = inputBuffer.current.length;
      if (len > 0) {
        term.write('\b \b'.repeat(len));
      }
    },
    [],
  );

  // ── Replace current line content ──
  const replaceLine = useCallback(
    (term: Terminal, newValue: string) => {
      clearLine(term);
      term.write(newValue);
      inputBuffer.current = newValue;
    },
    [clearLine],
  );

  // ── Tab autocomplete ──
  const handleTab = useCallback(
    (term: Terminal) => {
      const current = inputBuffer.current;
      const matches = commandNames.filter((n) => n.startsWith(current));

      if (matches.length === 0) return;

      if (matches.length === 1) {
        const rest = matches[0].slice(current.length);
        term.write(rest);
        inputBuffer.current += rest;
        // Add space after completed command for convenience
        term.write(' ');
        inputBuffer.current += ' ';
      } else {
        // Show all matches
        term.writeln('');
        term.writeln(matches.map((m) => `  \x1b[36m${m}\x1b[0m`).join('    '));
        term.write(prompt());
        term.write(current);
      }
    },
    [prompt],
  );

  // ── Arrow key history ──
  const handleArrowUp = useCallback(
    (term: Terminal) => {
      if (historyBuffer.current.length === 0) return;

      if (historyIndex.current === -1) {
        pendingInput.current = inputBuffer.current;
        historyIndex.current = historyBuffer.current.length - 1;
      } else if (historyIndex.current > 0) {
        historyIndex.current--;
      } else {
        return; // already at oldest
      }

      replaceLine(term, historyBuffer.current[historyIndex.current]);
    },
    [replaceLine],
  );

  const handleArrowDown = useCallback(
    (term: Terminal) => {
      if (historyIndex.current === -1) return;

      if (historyIndex.current < historyBuffer.current.length - 1) {
        historyIndex.current++;
        replaceLine(term, historyBuffer.current[historyIndex.current]);
      } else {
        // Restore pending input
        historyIndex.current = -1;
        replaceLine(term, pendingInput.current);
      }
    },
    [replaceLine],
  );

  // ── Execute command ──
  const executeCommand = useCallback(
    async (term: Terminal) => {
      const raw = inputBuffer.current.trim();
      inputBuffer.current = '';
      historyIndex.current = -1;
      term.writeln('');

      if (!raw) {
        term.write(prompt());
        return;
      }

      // Push to history (avoid consecutive duplicates)
      const lastHist = historyBuffer.current[historyBuffer.current.length - 1];
      if (raw !== lastHist) {
        historyBuffer.current.push(raw);
      }

      const [cmdName, ...args] = raw.split(/\s+/);
      const cmdDef = commandRegistry.get(cmdName);

      if (!cmdDef) {
        term.writeln(`\x1b[31m❌ Command not found: ${cmdName}\x1b[0m`);
        term.write(prompt());
        return;
      }

      const ctx = getContext();
      const result = cmdDef.handler(args, ctx);

      if (result && result.lines.length > 0) {
        if (result.animate) {
          await writeAnimated(term, result.lines);
        } else {
          for (const line of result.lines) {
            term.writeln(line);
          }
        }
      }

      term.write(prompt());
    },
    [prompt, getContext, writeAnimated],
  );

  // ── Main key handler ──
  const handleKey = useCallback(
    (key: string, domEvent: KeyboardEvent, term: Terminal) => {
      // During animation, any key skips to end
      if (isAnimating.current) {
        skipAnimation.current = true;
        return;
      }

      const { key: charKey, ctrlKey } = domEvent;

      // Ctrl shortcuts
      if (ctrlKey) {
        if (charKey === 'c') {
          term.writeln('^C');
          inputBuffer.current = '';
          historyIndex.current = -1;
          term.write(prompt());
          return;
        }
        if (charKey === 'l') {
          term.clear();
          term.write(prompt());
          inputBuffer.current = '';
          return;
        }
        return;
      }

      switch (charKey) {
        case 'Enter':
          executeCommand(term);
          break;

        case 'Backspace':
          if (inputBuffer.current.length > 0) {
            term.write('\b \b');
            inputBuffer.current = inputBuffer.current.slice(0, -1);
          }
          break;

        case 'Tab':
          domEvent.preventDefault();
          handleTab(term);
          break;

        case 'ArrowUp':
          handleArrowUp(term);
          break;

        case 'ArrowDown':
          handleArrowDown(term);
          break;

        case 'ArrowLeft':
        case 'ArrowRight':
          // Ignore cursor movement for simplicity
          break;

        default:
          // Only printable single characters
          if (charKey.length === 1) {
            term.write(charKey);
            inputBuffer.current += charKey;
          }
          break;
      }
    },
    [prompt, executeCommand, handleTab, handleArrowUp, handleArrowDown],
  );

  return { handleKey, prompt, executeCommand };
}
