import type { CommandDef } from './types';

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
  cyan('               ___..----.._'),
  cyan('      __..--""             "-.'),
  cyan("     /             ') _      \\"),
  cyan('    /          _.-"  ` \\      \\'),
  cyan('   /         ,"  ,.--. `\\     |'),
  cyan('  /         /   /    `.  \\    |'),
  cyan(' |         ;   ;      |  |    \\'),
  cyan(' |         |   |      ;  |     \\'),
  cyan(' \\         \\   \\    /  /       |'),
  cyan('  \\         `.  `--"  /        |'),
  cyan('   `.         "-.__.-"    _   /'),
  cyan('     "-._                / `-"'),
  cyan('         ""--..__      .'  ),
  cyan('                |"""""'),
  cyan('                |'),
  cyan('            ____|____'),
  cyan('           /    |    \\'),
  cyan('          /     |     \\'),
  cyan('         "------+------"'),
  '',
  `  ${bold('Welcome to hae02y\'s terminal!')}`,
  `  ${gray("Type '")}${cyan('help')}${gray("' for available commands.")}`,
  '',
];

// ── Navigation paths ──
const NAV_PATHS: Record<string, string> = {
  blog: '/blog',
  insight: '/Insight',
  home: '/',
  me: '/me',
};

// ── Command definitions ──

const helpCmd: CommandDef = {
  name: 'help',
  description: '명령어 목록',
  handler: (_args, _ctx) => {
    const lines = [
      gray('────────────────────────────────────────'),
      bold('Available commands'),
      '',
      `  ${cyan('whoami')}       자기소개`,
      `  ${cyan('skills')}       기술 스택`,
      `  ${cyan('experience')}   경력 사항`,
      `  ${cyan('projects')}     프로젝트 목록`,
      '',
      `  ${cyan('cd <path>')}    페이지 이동 (blog, insight, home, me)`,
      `  ${cyan('open <url>')}   외부 URL 열기`,
      '',
      `  ${cyan('git')}          GitHub 링크`,
      `  ${cyan('blog')}         블로그 링크`,
      `  ${cyan('insight')}      인사이트 링크`,
      '',
      `  ${cyan('hello')}        인사`,
      `  ${cyan('clear')}        터미널 초기화`,
      `  ${cyan('help')}         이 도움말`,
      gray('────────────────────────────────────────'),
    ];
    return { lines };
  },
};

const helloCmd: CommandDef = {
  name: 'hello',
  description: '인사',
  handler: (_args, ctx) => ({
    lines: [green(`✅ Hello, ${ctx.title}!`)],
  }),
};

const clearCmd: CommandDef = {
  name: 'clear',
  description: '터미널 초기화',
  handler: (_args, ctx) => {
    ctx.term.clear();
  },
};

const gitCmd: CommandDef = {
  name: 'git',
  description: 'GitHub 링크',
  handler: () => ({
    lines: [cyan(`🌐 GitHub: ${link('https://github.com/hae02y')}`)],
  }),
};

const blogCmd: CommandDef = {
  name: 'blog',
  description: '블로그 링크',
  handler: () => ({
    lines: [magenta(`📝 Blog: ${link('https://blog.hae02y.me/blog')}`)],
  }),
};

const insightCmd: CommandDef = {
  name: 'insight',
  description: '인사이트 링크',
  handler: () => ({
    lines: [yellow(`🔍 Insight: ${link('https://blog.hae02y.me/Insight')}`)],
  }),
};

// ── New: Info commands ──

const whoamiCmd: CommandDef = {
  name: 'whoami',
  description: '자기소개',
  handler: (_args, ctx) => {
    const { profile, links } = ctx;
    const github = links.find((l) => l.name === 'GitHub');
    const lines = [
      '',
      `  ${gray('Name:')}     ${bold(profile.name)}`,
      `  ${gray('Title:')}    ${profile.title}`,
      `  ${gray('Email:')}    ${cyan(profile.email)}`,
      `  ${gray('GitHub:')}   ${cyan(link(github?.url ?? 'https://github.com/hae02y'))}`,
      '',
    ];
    return { lines, animate: true };
  },
};

const skillsCmd: CommandDef = {
  name: 'skills',
  description: '기술 스택',
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
  description: '경력 사항',
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
  description: '프로젝트 목록',
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
  description: '페이지 이동 (blog, insight, home, me)',
  handler: (args, ctx) => {
    const target = args[0]?.toLowerCase();
    if (!target) {
      const available = Object.keys(NAV_PATHS).join(', ');
      return { lines: [yellow(`Usage: cd <${available}>`)] };
    }
    const path = NAV_PATHS[target];
    if (!path) {
      const available = Object.keys(NAV_PATHS).join(', ');
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
  description: '외부 URL 열기',
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
