import { useRef, useCallback } from 'react';
import type { Terminal } from 'xterm';
import type { CommandContext } from './types';
import { commandRegistry, commandNames } from './commands';

interface TerminalEngineOptions {
  title: string;
  getContext: () => CommandContext;
}

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

  const getCompletionHint = useCallback((current: string) => {
    if (!current.trim() || current.includes(' ')) return '';

    const matches = commandNames.filter((name) => name.startsWith(current));
    if (matches.length === 0) return '';
    if (matches.length === 1 && matches[0] !== current) return `${matches[0].slice(current.length)}  ⇥ tab`;
    if (matches.length > 1) return '  ⇥ tab';
    return '';
  }, []);

  const renderInputLine = useCallback(
    (term: Terminal) => {
      const current = inputBuffer.current;
      const hint = getCompletionHint(current);

      term.write(`\r\x1b[2K${prompt()}${current}`);
      if (!hint) return;

      term.write(`\x1b[90m${hint}\x1b[0m`);
      term.write(`\x1b[${hint.length}D`);
    },
    [getCompletionHint, prompt],
  );

  const commitInputLine = useCallback(
    (term: Terminal) => {
      term.write(`\r\x1b[2K${prompt()}${inputBuffer.current}`);
    },
    [prompt],
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

  // ── Replace current line content ──
  const replaceLine = useCallback(
    (term: Terminal, newValue: string) => {
      inputBuffer.current = newValue;
      renderInputLine(term);
    },
    [renderInputLine],
  );

  // ── Tab autocomplete ──
  const handleTab = useCallback(
    (term: Terminal) => {
      const current = inputBuffer.current;
      const matches = commandNames.filter((n) => n.startsWith(current));

      if (matches.length === 0) return;

      if (matches.length === 1) {
        inputBuffer.current = `${matches[0]} `;
        renderInputLine(term);
      } else {
        // Show all matches
        commitInputLine(term);
        term.writeln('');
        term.writeln(matches.map((m) => `  \x1b[36m${m}\x1b[0m`).join('    '));
        renderInputLine(term);
      }
    },
    [commitInputLine, renderInputLine],
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
      commitInputLine(term);
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
    [prompt, getContext, writeAnimated, commitInputLine],
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
          commitInputLine(term);
          term.writeln('^C');
          inputBuffer.current = '';
          historyIndex.current = -1;
          term.write(prompt());
          return;
        }
        if (charKey === 'l') {
          term.clear();
          inputBuffer.current = '';
          term.write(prompt());
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
            inputBuffer.current = inputBuffer.current.slice(0, -1);
            renderInputLine(term);
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
            inputBuffer.current += charKey;
            renderInputLine(term);
          }
          break;
      }
    },
    [prompt, executeCommand, handleTab, handleArrowUp, handleArrowDown, commitInputLine, renderInputLine],
  );

  return { handleKey, prompt, executeCommand };
}
