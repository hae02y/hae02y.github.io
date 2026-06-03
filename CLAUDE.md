# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
정해영(hae02y)의 기술 블로그. Next.js 14 App Router 기반 정적 사이트.
- **URL**: https://blog.hae02y.me
- **호스팅**: GitHub Pages (GitHub Actions CI/CD, `output: 'export'`)
- **주요 콘텐츠**: 백엔드/인프라/DevOps 기술 블로그 + 포트폴리오/이력서

## Commands
```bash
yarn              # 의존성 설치
yarn dev          # 개발 서버 (localhost:3000)
yarn build        # 프로덕션 빌드 (정적 export → out/)
yarn start        # 빌드 결과 로컬 확인
yarn typecheck    # TypeScript 타입 체크 (tsc --noEmit)
```

## Tech Stack
| 항목 | 버전 | 비고 |
|------|------|------|
| Next.js | 14.x | App Router, `output: 'export'` 정적 사이트 |
| React | 18.x | |
| TypeScript | 5.5.x | |
| Package Manager | yarn 1.22.22 | **npm/pnpm 사용 금지** |
| TailwindCSS | 3.4.x | PostCSS, `important: true` |
| shadcn/ui | new-york style | Radix UI 기반, `src/components/ui/` |

## Architecture

### 정적 사이트 (`output: 'export'`)
이 프로젝트는 **완전 정적 사이트**. 서버 컴포넌트는 빌드 타임에만 실행됨.
- API 라우트 사용 불가
- 미들웨어 사용 불가
- 모든 동적 라우트에 `generateStaticParams()` 필수

### 콘텐츠 파이프라인
- **블로그**: `blog/YYYY-MM-DD-slug/index.md` → `src/lib/blog.ts`가 빌드 타임에 fs로 읽어서 파싱
- **Docs**: `docs/` 디렉토리 → `src/lib/docs.ts`로 파싱 (sessionStorage 인증 필요)
- **Insight**: `Insight/` 디렉토리 → `src/lib/docs.ts`로 파싱
- **포트폴리오**: `src/content/me/` MDX 파일 → `src/lib/portfolio.ts`로 파싱
- **이력서**: `src/data/resume-*.ts` 순수 TS 데이터 모듈

### 디렉토리 구조
```
app/                     # Next.js App Router 페이지
  ├── layout.tsx          # 루트 레이아웃 (ThemeProvider, Navbar, JSON-LD)
  ├── page.tsx            # 홈페이지 (PostIt3D → 터미널 다이얼로그)
  ├── blog/               # 블로그 (목록, 상세, 페이지네이션, 태그)
  ├── docs/[...slug]/     # Docs (인증 필요)
  ├── Insight/            # Insight 섹션
  ├── login/              # 로그인 (sessionStorage 기반)
  └── me/                 # 이력서 + 포트폴리오
blog/                    # 블로그 마크다운 콘텐츠
docs/                    # Docs 마크다운 (인증 보호)
Insight/                 # Insight 마크다운
src/
  ├── components/         # React 컴포넌트
  │   ├── ui/             # shadcn/ui 프리미티브
  │   ├── blog/           # 블로그 전용 (BlogPaginator, BlogPostContent)
  │   ├── docs/           # Docs 전용 (DocContent)
  │   ├── portfolio/      # 포트폴리오 (CompanyTimeline, PortfolioList)
  │   ├── Resume/         # 이력서 섹션 컴포넌트
  │   ├── Comments/       # Giscus 댓글
  │   ├── Navbar.tsx      # 네비게이션 바
  │   ├── ThemeProvider.tsx # next-themes 래퍼
  │   └── ...             # TerminalDialog, MacTerminal, PostIt3D 등
  ├── config/site.ts      # 사이트 설정 (profile, skills, experience, algolia)
  ├── data/               # 이력서 데이터 (TS 모듈)
  ├── lib/
  │   ├── blog.ts         # 블로그 데이터 레이어 (fs + gray-matter + reading-time)
  │   ├── docs.ts         # Docs/Insight 데이터 레이어
  │   ├── portfolio.ts    # 포트폴리오 데이터 레이어
  │   ├── experience.ts   # 경력 계산 유틸
  │   ├── utils.ts        # cn() 헬퍼
  │   └── markdown-renderer.tsx # 마크다운 렌더링
  ├── content/me/         # 포트폴리오 MDX 콘텐츠
  └── icons/              # 아이콘 에셋
static/ → public/        # 정적 에셋 (img/, font/)
```

### 핵심 데이터 흐름
1. **블로그 목록**: `app/blog/page.tsx` → `getPaginatedPosts()` (서버, 빌드 타임)
2. **블로그 상세**: `app/blog/[slug]/page.tsx` → `getPostBySlug()` → `BlogPostContent` (클라이언트, react-markdown)
3. **포트폴리오**: `app/me/page.tsx` (서버: `getPortfolioData()`) → `MePageClient` (클라이언트: 탭 전환)
4. **Docs 인증**: `DocsPageClient` → `sessionStorage.getItem('authToken')` 없으면 `/login`으로 리다이렉트

## 핵심 규칙

### Import 규칙
```typescript
@/*            → src/*
@/components/* → src/components/*
@/ui/*         → src/components/ui/*
@/lib/*        → src/lib/*
@/data/*       → src/data/*
@/config/*     → src/config/*
```
- **cn 헬퍼**: `@/lib/utils`의 `cn()` 사용 (clsx + tailwind-merge)

### 스타일링
- **Tailwind 우선**. `tailwind.config.js`의 `important: true` 절대 제거 금지
- **다크모드**: `next-themes` + `[data-theme="dark"]` 선택자
- **폰트**: Pretendard(본문), JetBrains Mono(코드), IBM Plex Mono(brutal 디자인)
- `app/globals.css`의 글로벌 타이포그래피가 강력함 — 불필요하게 싸우지 말 것

### 블로그 포스트 작성
- **경로**: `blog/YYYY-MM-DD-슬러그/index.md`
- **에셋**: 같은 포스트 폴더에 저장, 상대 경로 사용
- **Frontmatter**: `slug`, `title`, `authors: [haeyoung]`, `tags: [...]`
- **한국어** 콘텐츠 주력

### 빌드 & 배포
- **CI/CD**: `.github/workflows/ci.yml` — main push → Node 20 + yarn → `next build` → `out/` → GitHub Pages
- 배포 전 반드시: `yarn build` 성공 확인
- `static/.nojekyll` 파일 삭제 금지
- UI 변경 시: 다크/라이트 모드 양쪽 확인

### 특수 동작
- `/me` 라우트에서 Navbar 숨김 (`src/components/Navbar.tsx`)
- `/login`: `sessionStorage` 기반 인증 (`.env.local`의 `NEXT_PUBLIC_AUTH_ID/PW`)
- 터미널 컴포넌트 (`MacTerminal`): `siteConfig`에서 profile/skills/experience 데이터 사용

### Git 규칙
- 사용자 변경사항 리셋 금지
- 명시적 요청 없이 커밋/푸시 금지
- `.env.local`의 인증 정보 로그/노출 금지

## 주요 의존성
- **UI 애니메이션**: framer-motion 12.x
- **3D**: @react-three/fiber, three
- **터미널**: xterm 5.3
- **아이콘**: lucide-react
- **댓글**: @giscus/react
- **마크다운**: react-markdown, gray-matter, reading-time
- **다크모드**: next-themes
- **MDX**: @next/mdx

## 주의사항
- `yarn` 외 다른 패키지 매니저 사용 금지
- `output: 'export'` — 서버 기능(API routes, middleware) 사용 불가
- 모든 동적 라우트에 `generateStaticParams()` 필수
- 테스트/린트 도구 미설정 — 임의로 만들지 말 것
