export type Social = {
  github?: string
  email?: string
  discord?: string
  linkedin?: string
}

type SocialValue = {
  href?: string
  title: string
  icon: string
  color: string
}

const social: Social = {
  github: 'https://github.com/hae02y',
  email: 'mailto:godud1118@gmail.com',
  discord: 'https://discord.gg/M8cVcjDxkz',
  linkedin: 'https://www.linkedin.com/in/hae02y/',
}

const socialSet: Record<keyof Social | 'rss', SocialValue> = {
  github: {
    href: social.github,
    title: 'GitHub',
    icon: 'ri:github-line',
    color: '#010409',
  },
  linkedin: {
    href: social.linkedin,
    title: 'LinkedIn',
    icon: 'ri:linkedin-box-line',
    color: '#1296db',
  },
  discord: {
    href: social.discord,
    title: 'Discord',
    icon: 'ri:discord-line',
    color: '#5A65F6',
  },
  email: {
    href: social.email,
    title: '邮箱',
    icon: 'ri:mail-line',
    color: '#D44638',
  },
  rss: {
    href: '/blog/rss.xml',
    title: 'RSS',
    icon: 'ri:rss-line',
    color: '#FFA501',
  },
}

export default socialSet
