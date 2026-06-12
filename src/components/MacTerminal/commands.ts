import type { CommandDef } from './types';
import { siteConfig } from '@/config/site';

// ── ANSI helpers ──
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const magenta = (s: string) => `\x1b[35m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const gray = (s: string) => `\x1b[90m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const link = (url: string, label?: string) =>
  `\x1b]8;;${url}\x1b\\${label ?? url}\x1b]8;;\x1b\\`;

// ── Welcome banner ──
export const welcomeBanner: string[] = [
  '',
  cyan(' _                 ___  ___        '),
  cyan('| |__   __ _  ___ / _ \\|__ \\ _   _ '),
  cyan("| '_ \\ / _` |/ _ \\ | | | / /| | | |"),
  cyan('| | | | (_| |  __/ |_| |/ /_| |_| |'),
  cyan('|_| |_|\\__,_|\\___|\\___/|____|\\__, |'),
  cyan('                              |___/  '),
  '',
  `  ${bold('hae02y')}${gray("'s terminal")}`,
  `  ${gray("Type '")}${cyan('help')}${gray("' for available commands.")}`,
  '',
];

const terminalConfig = siteConfig.terminal;
const commandMeta = new Map(terminalConfig.commands.map((command) => [command.name, command]));
const getCommandMeta = (name: string) => {
  const meta = commandMeta.get(name);
  if (!meta) throw new Error(`Missing terminal command config: ${name}`);
  return meta;
};
const commandDescription = (name: string) => getCommandMeta(name).description;

// ── Command definitions ──

const helpCmd: CommandDef = {
  name: 'help',
  description: commandDescription('help'),
  handler: (_args, _ctx) => {
    const usageWidth = Math.max(...terminalConfig.commands.map((command) => command.usage.length));
    const lines = [
      gray('────────────────────────────────────────'),
      bold(terminalConfig.helpTitle),
      '',
    ];

    terminalConfig.helpGroups.forEach((group, groupIndex) => {
      if (groupIndex > 0) lines.push('');
      group.forEach((name) => {
        const meta = getCommandMeta(name);
        lines.push(`  ${cyan(meta.usage.padEnd(usageWidth))}   ${meta.description}`);
      });
    });

    lines.push(gray('────────────────────────────────────────'));
    return { lines };
  },
};

const helloCmd: CommandDef = {
  name: 'hello',
  description: commandDescription('hello'),
  handler: (_args, ctx) => ({
    lines: [green(`✅ Hello, ${ctx.title}!`)],
  }),
};

const clearCmd: CommandDef = {
  name: 'clear',
  description: commandDescription('clear'),
  handler: (_args, ctx) => {
    ctx.term.clear();
  },
};

const gitCmd: CommandDef = {
  name: 'git',
  description: commandDescription('git'),
  handler: () => ({
    lines: [cyan(`🌐 GitHub: ${link('https://github.com/hae02y')}`)],
  }),
};

const blogCmd: CommandDef = {
  name: 'blog',
  description: commandDescription('blog'),
  handler: () => ({
    lines: [magenta(`📝 Blog: ${link('https://blog.hae02y.me/blog')}`)],
  }),
};

const insightCmd: CommandDef = {
  name: 'insight',
  description: commandDescription('insight'),
  handler: () => ({
    lines: [yellow(`🔍 Insight: ${link('https://blog.hae02y.me/Insight')}`)],
  }),
};

// ── New: Info commands ──

const whoamiCmd: CommandDef = {
  name: 'whoami',
  description: commandDescription('whoami'),
  handler: (_args, ctx) => {
    const { profile, links } = ctx;
    const github = links.find((l) => l.name === 'GitHub');
    const lines = [
      '',
      gray('  ┌─ profile'),
      `  │ ${bold('hae02y')} ${gray('/')} ${cyan('Haeyoung Jeong')}`,
      gray('  │'),
      `  │ ${gray('role')}    ${profile.title}`,
      `  │ ${gray('focus')}   backend systems & infra`,
      `  │ ${gray('stack')}   Spring Boot · AWS · Kubernetes`,
      `  │ ${gray('mail')}    ${cyan(profile.email)}`,
      `  │ ${gray('github')}  ${cyan(link(github?.url ?? 'https://github.com/hae02y', 'github.com/hae02y'))}`,
      gray('  └─ I build reliable APIs, automate infra,'),
      gray('     and leave notes for the next version of me.'),
      '',
    ];
    return { lines, animate: true };
  },
};

const skillsCmd: CommandDef = {
  name: 'skills',
  description: commandDescription('skills'),
  handler: (_args, ctx) => {
    const lines = [''];
    for (const cat of ctx.skills.categories) {
      const label = cat.name.padEnd(10);
      lines.push(`  ${yellow(label)} ${cat.skills.join(', ')}`);
    }
    lines.push('');
    return { lines, animate: true };
  },
};

const experienceCmd: CommandDef = {
  name: 'experience',
  description: commandDescription('experience'),
  handler: (_args, ctx) => {
    const lines = [''];
    for (const exp of ctx.experience) {
      lines.push(`  ${bold(exp.company)} — ${cyan(exp.position)} ${gray(`(${exp.period})`)}`);
      for (const resp of exp.responsibilities) {
        lines.push(`    ${green('▸')} ${resp.title}`);
      }
      lines.push('');
    }
    return { lines, animate: true };
  },
};

const projectsCmd: CommandDef = {
  name: 'projects',
  description: commandDescription('projects'),
  handler: (_args, ctx) => {
    const lines = [''];
    for (const exp of ctx.experience) {
      for (const resp of exp.responsibilities) {
        lines.push(`  ${cyan('▸')} ${bold(resp.title)}`);
        lines.push(`    ${gray(resp.technologies.join(', '))}`);
        for (const detail of resp.details) {
          lines.push(`    ${detail}`);
        }
        lines.push('');
      }
    }
    lines.push(`  ${gray('More at')} ${cyan(link('https://blog.hae02y.me/me', '/me'))}`);
    lines.push('');
    return { lines, animate: true };
  },
};

// ── New: Navigation commands ──

const cdCmd: CommandDef = {
  name: 'cd',
  description: commandDescription('cd'),
  handler: (args, ctx) => {
    const target = args[0]?.toLowerCase();
    if (!target) {
      const available = Object.keys(terminalConfig.paths).join(', ');
      return { lines: [yellow(`Usage: cd <${available}>`)] };
    }
    const path = terminalConfig.paths[target as keyof typeof terminalConfig.paths];
    if (!path) {
      const available = Object.keys(terminalConfig.paths).join(', ');
      return {
        lines: [
          red(`❌ Unknown path: ${target}`),
          gray(`  Available: ${available}`),
        ],
      };
    }
    ctx.term.writeln(green(`  Navigating to ${path}...`));
    setTimeout(() => ctx.navigate(path), 300);
  },
};

const openCmd: CommandDef = {
  name: 'open',
  description: commandDescription('open'),
  handler: (args, ctx) => {
    const url = args[0];
    if (!url) {
      return { lines: [yellow('Usage: open <url>')] };
    }
    if (!/^https?:\/\//i.test(url)) {
      return { lines: [red('❌ URL must start with http:// or https://')] };
    }
    ctx.openExternal(url);
    return { lines: [green(`  Opening ${url} in a new tab...`)] };
  },
};

// ── Registry ──

const allCommands: CommandDef[] = [
  helpCmd,
  helloCmd,
  clearCmd,
  gitCmd,
  blogCmd,
  insightCmd,
  whoamiCmd,
  skillsCmd,
  experienceCmd,
  projectsCmd,
  cdCmd,
  openCmd,
];

export const commandRegistry = new Map<string, CommandDef>(
  allCommands.map((cmd) => [cmd.name, cmd]),
);

export const commandNames = allCommands.map((cmd) => cmd.name);
