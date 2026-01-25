export type CertificationItem = {
  name: string;
  issuer: string;
  date: string;
};

export const certificationItems: CertificationItem[] = [
  {
    name: '정보처리기사',
    issuer: '한국산업인력공단',
    date: '2023.06',
  },
  {
    name: 'SQLD',
    issuer: '한국데이터산업진흥원',
    date: '2022.09',
  },
  {
    name: 'ADsP',
    issuer: '한국데이터산업진흥원',
    date: '2022.11',
  },
  {
    name: '네트워크관리사2급',
    issuer: '한국정보통신자격협회',
    date: '2022.04',
  },
  {
    name: '리눅스마스터 2급',
    issuer: '정보통신기술자격검정',
    date: '2020.07',
  },
];
