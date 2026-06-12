import type { Terminal } from 'xterm';

export interface CommandContext {
  term: Terminal;
  title: string;
  navigate: (path: string) => void;
  openExternal: (url: string) => void;
}

export interface CommandResult {
  lines: string[];
  animate?: boolean;
}

export type CommandHandler = (
  args: string[],
  ctx: CommandContext,
) => CommandResult | void;

export interface CommandDef {
  name: string;
  description: string;
  handler: CommandHandler;
}
