export type ResumeData = {
  intro: {
    headline: string;
    description: string;
  };
  profile: {
    name: string;
    title: string;
    description?: string;
    resumeUrl?: string;
  };
  skills: {
    categories: { name: string; skills: string[] }[];
  };
  work: {
    company: string;
    role: string;
    period: string;
    description?: string;
    projects?: {
      title: string;
      period?: string;
      description?: string;
      tasks?: string[];
      techStack?: string[];
      link?: string;
    }[];
  }[];
  other: {
    title: string;
    role?: string;
    period?: string;
    description?: string;
    link?: string;
  }[];
  contact: { name: string; url: string }[];
};

export const resumeData: ResumeData = {
  intro: {
    headline: '반갑습니다,\n저는 정해영입니다',
    description:
      '서울에서 3년차 백엔드 개발자로 일하고 있으며 아름다운 인터페이스와 애니메이션을 구현하는 것을 좋아합니다. 개발자의 가치는 비즈니스 가치를 구현하는데서 나온다고 믿습니다. 주도적으로 업무를 진행할 수 있는 환경을 선호합니다.',
  },
  profile: {
    name: 'haeyonug, jeoung',
    title: 'Backend Developer',
    description:
      '아름다운 인터페이스와 애니메이션을 사랑하며, 비즈니스 가치를 구현하는 데 집중합니다.',
    resumeUrl: '/resume.pdf',
  },
  work: [
    {
      company: '(주)베스텔라랩',
      role: 'Backend Developer',
      period: '2020. 08 - 현재',
      projects: [
        {
          title: '통합워치마일 백엔드 개발',
          period: '2020. 08 - 현재',
          description: '토스페이먼츠 결제 연동용 JavaScript SDK 개발 및 유지보수',
          tasks: ['일반 결제 JavaScript SDK 구현', '커넥트페이 JavaScript SDK 구현', 'npm 퍼블릭 패키지 배포'],
          techStack: ['TypeScript', 'Jest', 'Rollup'],
        },
        {
          title: '토스페이먼츠 결제 연동 매뉴얼',
          period: '2020. 08 - 현재',
          description: '결제 연동 가이드 문서 프론트엔드 설계 및 유지보수',
          tasks: [
            '결제 연동 문서 초기 버전 구현 및 문서 본문 작성',
            '결제 연동 문서 2.0 구현 및 지속 개선',
            'MDX 기반 컨텐츠 관리로 테크니컬 라이터 협업',
          ],
          techStack: ['TypeScript', 'React', 'Next.js', 'MDX'],
          link: 'https://docs.tosspayments.com/',
        },
        {
          title: '커넥트페이',
          period: '2020. 10 - 2021. 07',
          description: '커넥트페이 JS SDK 및 프론트엔드 구현',
          tasks: ['커넥트페이 JavaScript SDK 구현', '커넥트페이 프론트엔드 구현', 'MessageChannel API로 실시간 통신'],
          techStack: ['TypeScript', 'React', 'Next.js', 'emotion', 'MessageChannel API'],
        },
      ],
    },
    {
      company: '(주)조은기술',
      role: 'Network Engineer',
      period: '2018. 12 - 2020. 08',
      projects: [
        {
          title: '공통 라이브러리 기여',
          period: '2019. 09 - 2020. 07',
          description: 'TDS 등 사내 라이브러리 유지보수/개선',
          tasks: ['웹뷰 다크모드 구현', 'TDS 인터페이스 개선 및 신규 컴포넌트', '대형 라이브러리 분리 및 인터페이스 개선'],
          techStack: ['TypeScript', 'React', 'Next.js', 'Sass', 'Jest'],
        },
        {
          title: 'GA Silo',
          period: '2019. 07 - 2020. 07',
          description: '"내 보험 조회" 서비스 전환률 향상',
          tasks: ['코드 베이스 개선 및 레거시 마이그레이션', 'A/B 테스트 구현으로 전환률 향상'],
          techStack: ['TypeScript', 'React', 'Next.js', 'emotion'],
        },
        {
          title: 'PropTech Silo',
          period: '2019. 03 - 2019. 06',
          description: 'PropTech 소규모 서비스 개발',
          tasks: ['아파트 찾기 구현', '아파트 관리비 조회/납부 구현'],
          techStack: ['TypeScript', 'React', 'Next.js', 'emotion'],
        },
        {
          title: 'Growth Silo',
          period: '2018. 12 - 2019. 02',
          description: '토스 성장 실험',
          tasks: ['토스 머니백 구현', '금융 생활 보고서 구현'],
          techStack: ['TypeScript', 'React', 'MobX', 'Sass', 'Jest', 'Next.js'],
        },
      ],
    }
  ],
  skills: {
    categories: [
      {
        name: 'Overall',
        skills: [
          '아름다운 유저 인터페이스 및 미려한 애니메이션 구현을 좋아합니다.',
          '항상 최신의 기술이 옳다고 여기지 않습니다. 상황에 따라 적절한 선택이 있다고 믿습니다.',
          '업무에 필요하다면 능숙한 분야가 아니더라도 적극적으로 탐색하여 최적의 결과를 낼 수 있도록 노력합니다.',
          '회사 혹은 팀의 프로세스 및 문화를 개선하거나 바꾸려는 시도를 적극적으로 합니다.',
        ],
      },
      {
        name: 'Communication',
        skills: [
          '직위 및 포지션에 관계없이 적극적으로 생각을 표현합니다.',
          '지적 겸손함을 유지하기 위해 노력합니다.',
          '커뮤니케이션은 적은 것보다는 많은 게 좋다고 믿습니다.',
        ],
      },
      {
        name: 'DevOps & Infrastructure',
        skills: [
          'AWS S3, CloudFront, Lambda@Edge 등을 이용해 어플리케이션 레이어를 구성할 수 있습니다.',
          'GitHub Actions, Travis, GitLab CI 등의 CI를 구성할 수 있습니다.',
          '반복적인 업무 해소를 위해 Node.js로 CLI 도구를 만들 수 있습니다.',
        ],
      },
      {
        name: 'Web',
        skills: [
          'Search Engine Optimization 경험이 있습니다.',
          'Internet Explorer, Safari를 비롯해, 다양한 OS 및 브라우저를 지원할 수 있습니다.',
          '모바일 브라우저에서의 트러블 슈팅 경험이 많습니다.',
        ],
      },
      {
        name: 'Java',
        skills: [
          'JavaScript와 TypeScript에 능숙합니다.',
          'CommonJS, ES Modules의 모듈 시스템에 대해서 이해하고 이에 따라 적절한 도구를 활용합니다.',
          'Node.js 생태계의 툴링에 익숙합니다.',
          'Yarn과 Yarn Berry 사용을 선호합니다.',
        ],
      },
      {
        name: 'Python',
        skills: [
          'React hooks를 능숙하게 사용하고, 거의 모든 컴포넌트를 함수로 만듭니다.',
          '각종 컴포넌트 디자인 패턴에 능숙하며, 합리적인 방식으로 컴포넌트를 분리합니다.',
          'PureComponent와 React.memo에 대해서 이해하고 적절한 상황에서만 사용합니다.',
          'Storybook을 사용한 컴포넌트 주도 개발을 할 수 있습니다.',
          'Testing Library를 사용하여 테스트코드를 작성할 수 있습니다.',
        ],
      },
    ],
  },
  other: [
    {
      title: 'GDG Korea WebTech',
      role: 'Organizer',
      period: '2018. 08 - 현재',
      description: '구글의 웹 기술 기반 개발자 커뮤니티 오거나이저로 행사 주최/지원',
    },
    {
      title: 'TypeScript Korea',
      role: 'Organizer',
      period: '2017. 10 - 2018. 12',
      description: 'TypeScript 사용자 커뮤니티 운영',
    },
    {
      title: 'Blog',
      role: 'Author, Maintainer',
      period: '2016. 09 - 현재',
      description: 'seob.dev 블로그 운영(이전 DailyEngineering)',
      link: 'https://seob.dev/',
    },
    {
      title: 'ACM-ICPC',
      role: 'Honorable Mention',
      period: '2013. 11',
      description: '학교 예선 상위, 지역본선 진출',
    },
    {
      title: '금오공과대학교',
      role: '컴퓨터소프트웨어공학과',
      period: '2010. 03 - 2018. 02',
      description: '컴퓨터구조/자료구조/네트워크/웹프로그래밍 등 이수',
    },
  ],
  contact: [
    { name: '이메일', url: 'mailto:mail@hyunseob.me' },
    { name: '블로그', url: 'https://seob.dev' },
    { name: '링크드인', url: 'https://www.linkedin.com/in/hyunseoblee/' },
    { name: '깃허브', url: 'https://github.com/hyunseob' },
    { name: '트위터', url: 'https://twitter.com/HyunSeob_' },
    { name: '페이스북', url: 'https://facebook.com/hyunseob.lee.7' },
  ],
};

