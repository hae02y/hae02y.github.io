export type ResumeLink = {
  label: string;
  url: string;
  icon?: 'github' | 'blog' | 'medium' | 'link' | 'email' | 'linkedIn';
};

export const resumeLinks: ResumeLink[] = [
  {
    label: 'GitHub',
    url: 'https://github.com/hae02y',
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/hae02y',
    icon: 'linkedIn',
  },
  {
    label: '기술블로그',
    url: 'https://blog.hae02y.me/',
    icon: 'blog',
  },
];
