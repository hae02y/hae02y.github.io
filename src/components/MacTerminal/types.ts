import type { Terminal } from 'xterm';

export interface Profile {
  name: string;
  title: string;
  description: string;
  image: string;
  email: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Responsibility {
  title: string;
  technologies: string[];
  details: string[];
}

export interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
  responsibilities: Responsibility[];
}

export interface Link {
  name: string;
  url: string;
  icon: string;
}

export interface CommandContext {
  term: Terminal;
  title: string;
  profile: Profile;
  skills: { categories: SkillCategory[] };
  experience: Experience[];
  links: Link[];
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
