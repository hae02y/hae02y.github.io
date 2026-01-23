export type CertificationItem = {
  name: string;
  issuer: string;
  date: string;
};

export const certificationItems: CertificationItem[] = [
  {
    name: 'AWS Certified Solutions Architect - Associate',
    issuer: 'Amazon Web Services',
    date: '2024.12',
  },
  {
    name: '정보처리기사',
    issuer: '한국산업인력공단',
    date: '2024.12',
  },
];
