export type ActivityItem = {
  title: string;
  subtitle?: string;
  bullets?: string[];
  bulletGroups?: {
    title: string;
    bullets: string[];
  }[];
  tags?: string[];
};

export const activityItems: ActivityItem[] = [
  {
    title: 'Codestates Software Developer 부트캠프',
    tags: ['부트캠프'],
    bulletGroups: [
      {
        title: '부트캠프 수료',
        bullets: [
          'JAVA, Spring 기반 객체 지향 프로그래밍 학습 및 회고 작성',
          '알고리즘 문제 풀이와 수행 과제 및 페어 프로그래밍, 코드 리뷰 경험',
        ],
      },
    ],
  },
  {
    title: '오픈소스 활동',
    tags: ['오픈소스'],
    bulletGroups: [
      {
        title: 'Google A2A',
        bullets: [
          'Google A2A(a2a-java) listTasks status wire string 처리 버그 수정 기여 [PR #578](https://github.com/a2aproject/a2a-java/pull/578)',
        ],
      },
    ],
  },
  {
    title: '스터디 활동',
    tags: ['스터디'],
    bulletGroups: [
      {
        title: '스터디 참여',
        bullets: [
          '[베스텔라랩 개발자 스터디 참여](https://blog.hae02y.me/blog/makeblog2) | 베스텔라랩 사내 개발자들 참여 인사이트 공유 및 주 1회 블로깅 피드백 진행',
          '[Java Algorithm 스터디 운영](https://github.com/hae02y/CS_Studdiinngg) | 백준, 프로그래머스 Java 언어 기반 알고리즘 문제 풀이 및 피드백 진행',
          '[Computer Science 스터디 참여](https://github.com/hae02y/CS_Studdiinngg) | CS 기초 지식 및 개발 지식 향상을 위한 스터디 참여',
        ],
      },
    ],
  },
  {
    title: '블로그 활동',
    tags: ['블로그'],
    bulletGroups: [
      {
        title: '블로그 운영',
        bullets: [
          'Docusaurus + Obsidian 기반 [개발 기술 블로그](https://blog.hae02y.me/)를 구성하고, 기술 콘텐츠를 운영했습니다.',
          '누적 23만 방문 [IT 기술 블로그](https://togll.tistory.com/)를 운영하고있습니다. 네트워크엔지니어로 근무 하면서부터 글쓰기/정리를 꾸준히 했습니다.',
        ],
      },
    ],
  },
];
