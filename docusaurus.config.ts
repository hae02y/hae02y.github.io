import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const siteUrl = 'https://blog.hae02y.me';
const authorName = '정해영';
const authorHandle = 'hae02y';
const siteDescription = '정해영(hae02y)의 백엔드, 인프라, DevOps 기술 블로그';
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      url: siteUrl,
      name: 'Hae02y Devlog',
      alternateName: '정해영 기술블로그',
      inLanguage: 'ko',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}#person`,
      name: authorName,
      alternateName: authorHandle,
      jobTitle: 'Backend Engineer',
      url: siteUrl,
      image: `${siteUrl}/img/me.jpg`,
      sameAs: ['https://github.com/hae02y', 'https://linkedin.com/in/hae02y', 'mailto:godud1118@gmail.com'],
      worksFor: { '@type': 'Organization', name: 'VEStellaLab' },
    },
    {
      '@type': 'Blog',
      '@id': `${siteUrl}#blog`,
      name: 'Hae02y Devlog',
      url: `${siteUrl}/blog`,
      inLanguage: 'ko',
      author: { '@id': `${siteUrl}#person` },
      publisher: {
        '@type': 'Organization',
        name: 'Hae02y Devlog',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/img/me.jpg`,
        },
      },
    },
  ],
};

const config: Config = {
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'Insight',
        path: 'Insight', // 여기에 마크다운 파일을 저장할 폴더
        routeBasePath: 'Insight', // URL이 `/Insight`이 됨pagination-nav docusaurus-mt-lg
      },
    ],
    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
  ]
  ,
  title: 'Hae02y Devlog',
  tagline: '정해영(hae02y)의 Backend & Infra Devlog',
  favicon: 'img/sitelogo.ico',
  // Set the production url of your site here
  url: siteUrl,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  trailingSlash: false,
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'hae02y', // Usually your GitHub org/user name.
  projectName: 'hae02y', // Usually your repo name.

  customFields: {
    authid : 'hae02y',
    authpw : 'qwe123,.',
    resume: '/resume.pdf',

    profile: {
      name: 'Haeyoung,Jeong',
      title: 'Backend Developer.',
      description: '',
      image: '/img/me.jpg',
      email: 'godud1118@gmail.com',
    },
    skills: {
      categories: [
        {
          name: 'Backend',
          skills: ['Java', 'Kotlin', 'Python', 'Node.js', 'Spring Boot', 'Spring Security', 'Spring Batch', 'JPA', 'QueryDSL', 'MyBatis']
        },
        {
          name: 'Database',
          skills: ['MySQL', 'MariaDB', 'MSSQL', 'PostgreSQL', 'Redis', 'InfluxDB', 'MongoDB']
        },
        {
          name: 'DevOps',
          skills: ['AWS', 'NCP', 'Linux',  'Docker', 'Kubernetes','Nginx', 'CI/CD']
        },
        {
          name: 'Fronend',
          skills: ['JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Zustand', 'Redux', 'JQuery', 'Axios', 'TailwindCSS']
        }
      ]
    },
    experience: [
      {
        company: '(주)VEStellaLab',
        position: 'Backend Developer',
        period: '2024.01 - now',
        description: 'Visoin-AI 기반 실내 정밀 측위 및 Non-GPS 주차 내비게이션을 서비스하는 스마트 모빌리티 스타트업입니다.',
        responsibilities: [
          {
            title: '백엔드 서비스 설계 및 핵심 비즈니스 로직 구현',
            technologies: ['Java', 'Spring Boot', 'Spring Security', 'JPA', 'Mybatis', 'MySQL', 'MariaDB', 'MSSQL'],
            details: [
              'Spring Boot 기반 RESTful API 설계 및 개발',
              'JPA/Hibernate를 활용한 데이터베이스 연동 및 최적화',
              'Spring Security를 통한 인증/인가 시스템 구현',
              'MyBatis를 활용한 복잡한 쿼리 처리 및 성능 최적화'
            ]
          },
          {
            title: '클라우드 기반 인프라 설계 구축 및 웹 프론트엔드 개발',
            technologies: ['AWS', 'Docker', 'React', 'TypeScript', 'JavaScript'],
            details: [
              'AWS EC2, RDS, S3 등을 활용한 클라우드 인프라 구축',
              'Docker 컨테이너화를 통한 배포 환경 표준화',
              'React와 TypeScript를 활용한 웹 프론트엔드 개발',
              'CI/CD 파이프라인 구축 및 자동화'
            ]
          }
        ]
      },
      {
        company: '(주)조은기술',
        position: 'Network Engineer',
        period: '2020.08 - 2023.04',
        description: '네트워크 장비 및 보안 솔루션을 제공하는 IT 서비스 회사입니다.',
        responsibilities: [
          {
            title: '네트워크 인프라 설계 및 구축',
            technologies: ['Cisco', 'Juniper', 'Linux', 'Python'],
            details: [
              '대규모 기업 네트워크 설계 및 구축',
              '네트워크 보안 정책 수립 및 구현',
              '네트워크 모니터링 시스템 구축',
              'Python 스크립트를 활용한 네트워크 자동화'
            ]
          }
        ]
      }
    ],
    links: [
      {
        name: 'GitHub',
        url: 'https://github.com/hae02y',
        icon: 'Github'
      },
      {
        name: 'Email',
        url: 'mailto:your.email@example.com',
        icon: 'Mail'
      },
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/hae02y',
        icon: 'Linkedin'
      }
    ]
  },

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  headTags: [
    {
      tagName: 'script',
      attributes: {type: 'application/ld+json'},
      innerHTML: JSON.stringify(jsonLd),
    },
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
      mermaid: true,
    },
    themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        blog: {
          blogSidebarTitle: '모든 포스트',
          blogSidebarCount: 'ALL',
          postsPerPage: 10, // 페이지당 포스트 수 설정
          showReadingTime: true,
          blogTitle: '정해영 기술블로그',
          blogDescription: siteDescription,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.7,
          filename: 'sitemap.xml',
          ignorePatterns: ['/tags/**'],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/me.jpg',
    metadata: [
      {name: 'description', content: siteDescription},
      {name: 'keywords', content: '정해영, hae02y, 백엔드 개발자, Backend Engineer, 기술 블로그, Spring Boot, AWS'},
      {name: 'author', content: `${authorName} (${authorHandle})`},
      {property: 'og:locale', content: 'ko_KR'},
      {name: 'google-site-verification', content: 'sAUHghg81eclefIthjNm4YeM-XmjlM5HeCADnR8dKOA'},
    ],
    algolia: {
      appId: 'BJ0L9RUPZ0',
      apiKey: '9bd9504036390edaf8f3892263884bbc',
      indexName: 'hae02y',
      contextualSearch: true,
      searchParameters: {},
      searchPagePath: 'search',
    },
    navbar: {
      hideOnScroll: true,
      items: [
        {to: '/me', label: 'Resume', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/hae02y',
          label: 'GitHub',
          position: 'right',
        },
        {to: '/Insight', label: 'Insight', position: 'left'}
      ],
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: [
        'markup', 'bash', 'clike', 'c', 'cpp', 'css', 'javascript',
        'jsx', 'coffeescript', 'actionscript', 'markup-templating',
        'typescript', 'tsx', 'docker', 'elixir', 'go', 'graphql',
        'java', 'json', 'kotlin', 'lua', 'makefile', 'markdown',
        'nginx', 'perl', 'php', 'php-extras', 'python', 'ruby',
        'rust', 'sql', 'swift', 'toml', 'yaml', 'ini', 'powershell',
        'wasm', 'regex', 'scala', 'csharp', 'haskell', 'diff'
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
