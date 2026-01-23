export type ActivityItem = {
  title: string;
  subtitle?: string;
  bullets?: string[];
  tags?: string[];
};

export const activityItems: ActivityItem[] = [
  {
    title: '표준프레임워크 오픈커뮤니티',
    subtitle: '오픈소스 기여',
    tags: ['오픈소스'],
    bullets: [
      'StringBuffer -> StringBuilder 전환, try-with-resources 적용',
      'Pull Request: 읽기 로직 개선 #102, 코드 스타일 개선 #104',
    ],
  },
  {
    title: 'Exercism (SIPE)',
    subtitle: '오픈소스 기여',
    tags: ['오픈소스', '동아리'],
    bullets: [
      'ForkJoinPool/ParallelStream 기반 병렬 처리 도입',
      'Pull Request: Parallel Letter Frequency #2863',
    ],
  },
];
