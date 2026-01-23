export type ResumeLink = {
  label: string;
  url: string;
  icon?: 'github' | 'blog' | 'medium' | 'link';
};

export const resumeLinks: ResumeLink[] = [
  {
    label: 'GitHub',
    url: 'https://github.com/',
    icon: 'github',
  },
  {
    label: '티스토리',
    url: 'https://',
    icon: 'blog',
  },
  {
    label: '미디엄',
    url: 'https://medium.com/',
    icon: 'medium',
  },
];
