import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인',
  description: '비공개 문서 접근을 위한 로그인 페이지입니다.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
