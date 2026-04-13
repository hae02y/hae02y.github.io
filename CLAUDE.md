# CLAUDE.md — hae02y.github.io Project Rules

## Project Overview
정해영(hae02y)의 기술 블로그. Docusaurus 3 기반 정적 사이트.
- **URL**: https://blog.hae02y.me
- **호스팅**: GitHub Pages (GitHub Actions CI/CD)
- **주요 콘텐츠**: 백엔드/인프라/DevOps 기술 블로그 + 포트폴리오/이력서

## Tech Stack (정확한 버전)
| 항목 | 버전 | 비고 |
|------|------|------|
| Docusaurus | 3.6.3 | `@docusaurus/core`, `preset-classic`, `theme-mermaid` 모두 동일 |
| React | 18.x | react, react-dom |
| TypeScript | 5.5.2 | `tsc`로 typecheck |
| Node.js | >=18 | engines 제약 |
| Package Manager | yarn 1.22.22 | **npm/pnpm 사용 금지** |
| TailwindCSS | 3.4.15 | PostCSS 플러그인으로 통합, `important: true` |
| shadcn/ui | 0.9.4 (new-york style) | Radix UI 기반 컴포넌트 |

## Commands
```bash
yarn              # 의존성 설치
yarn start        # 개발 서버 (localhost:3000)
yarn build        # 프로덕션 빌드
yarn serve        # 빌드 결과 로컬 확인
yarn typecheck    # TypeScript 타입 체크 (tsc)
yarn clear        # Docusaurus 캐시 초기화
yarn deploy       # GitHub Pages 배포
```

## 핵심 규칙

### 1. Docusaurus 3 특성
- **설정 파일**: `docusaurus.config.ts` (TypeScript)
- **프리셋**: `@docusaurus/preset-classic` (docs + blog + pages + sitemap)
- **플러그인 3개**:
  1. `@docusaurus/plugin-content-docs` (id: 'Insight') — `/Insight` 경로의 2차 docs 섹션
  2. 인라인 Tailwind PostCSS 플러그인
  3. 인라인 Portfolio Routes 플러그인 (`/me/:slug` 동적 라우트)
- **테마**: `@docusaurus/theme-mermaid` (Mermaid 다이어그램 지원)
- **Markdown**: `mermaid: true` 활성화됨
- **Prism**: oneLight/oneDark 테마, 30개+ 언어 지원
- **검색**: Algolia DocSearch (appId: BJ0L9RUPZ0)
- **SEO**: JSON-LD 구조화 데이터, sitemap.xml, RSS/Atom 피드

### 2. 디렉토리 구조
```
blog/                    # 블로그 포스트 (YYYY-MM-DD-slug/index.md)
docs/                    # 기본 docs (sidebar 자동 생성)
Insight/                 # 2차 docs 플러그인 (book, cote, Conference, domain 등)
bookcode/                # 블로그 템플릿 및 코드 스니펫
src/
  ├── components/        # React 컴포넌트
  │   ├── ui/            # shadcn/ui 프리미티브
  │   ├── portfolio/     # 포트폴리오 관련
  │   ├── Resume/        # 이력서 섹션 컴포넌트들
  │   ├── Comments/      # Giscus 댓글
  │   └── ...            # TerminalDialog, MacTerminal, BounceDev 등
  ├── css/
  │   ├── custom.css     # 글로벌 스타일 (780+ lines)
  │   └── tailwind.css   # Tailwind 임포트
  ├── pages/             # 커스텀 페이지 (index.tsx, me/, login.tsx)
  ├── theme/             # Docusaurus 테마 오버라이드
  │   ├── Navbar/
  │   ├── BlogPostItem/
  │   ├── BlogListPaginator/
  │   └── MDXComponents/
  ├── lib/               # 유틸리티 (cn, experience 계산)
  ├── data/              # 이력서 데이터 (TypeScript 모듈)
  └── icons/             # 아이콘 에셋
static/
  ├── img/               # 이미지 (프로필, 로고, SVG)
  ├── font/              # 웹폰트 (Pretendard, Freesentation)
  └── .nojekyll          # GitHub Pages 마커 (삭제 금지)
```

### 3. 블로그 포스트 작성 규칙
- **경로 패턴**: `blog/YYYY-MM-DD-슬러그/index.md`
- **에셋**: 같은 포스트 폴더에 저장, 상대 경로 사용
- **Frontmatter 필수 필드**:
  ```yaml
  ---
  slug: unique-slug
  title: 포스트 제목
  authors:
    - haeyoung
  tags:
    - 태그1
    - 태그2
  ---
  ```
- **댓글**: `comments: false`로 Giscus 비활성화 가능 (기본 true)
- **한국어** 콘텐츠가 주력

### 4. Import 규칙 & Path Aliases
```typescript
// tsconfig.json 기준 aliases
@/*            → src/*
@site/*        → ./*
@/components/* → src/components/*
@/ui/*         → src/components/ui/*
```
- **Import 순서**: React/types → 외부 라이브러리 → Docusaurus 패키지 → site aliases → 상대 경로
- **cn 헬퍼**: `@/lib/utils`의 `cn()` 사용 (clsx + tailwind-merge). 문자열 결합 금지.

### 5. 스타일링 규칙
- **Tailwind 우선**. 인라인 스타일 최소화.
- `tailwind.config.js`의 `important: true` 절대 제거 금지 (Docusaurus 오버라이드용)
- **다크모드**: `class` 전략 + `[data-theme="dark"]` 선택자
- **폰트**: Pretendard(본문), JetBrains Mono(코드), IBM Plex Mono(brutal 디자인)
- **CSS 변수**: `--primary`, `--secondary`, `--accent`, `--background` 등 사용
- `custom.css`의 글로벌 타이포그래피가 강력함 — 불필요하게 싸우지 말 것

### 6. 컴포넌트 규칙
- 함수형 컴포넌트만 사용
- Props는 interface/type으로 타입 정의, `any` 사용 금지
- 테마 래핑 시 원본 props spread 유지
- shadcn/ui 컴포넌트는 `src/components/ui/`에 위치

### 7. 특수 페이지 동작
- `/me` 라우트에서 Navbar 숨김 (`src/theme/Navbar/index.tsx`)
- `/login` 페이지: `sessionStorage` 기반 인증 (`customFields.authid/authpw` — 민감 정보)
- 블로그 날짜 형식: `useDateTimeFormat({year:'numeric', month:'numeric', day:'numeric'})` → `12/10/2025`

### 8. 빌드 & 배포
- **CI/CD**: `.github/workflows/ci.yml` — main push → Node 20 + yarn → build → GitHub Pages
- 배포 전 반드시: `yarn build` 성공 확인
- TS 코드 변경 시: `yarn typecheck` 실행
- UI 변경 시: 다크/라이트 모드 양쪽 확인
- `static/.nojekyll` 파일 삭제 금지

### 9. 테스트/린트
- Jest, Vitest, ESLint, Prettier 모두 미설정
- 테스트 명령어를 임의로 만들지 말 것
- 요청 시에만 테스트 도구 제안

### 10. Git 규칙
- 사용자 변경사항 리셋 금지
- 의도된 파일만 스테이징
- 명시적 요청 없이 커밋/푸시 금지
- `customFields`의 인증 정보 로그/노출 금지

## 주요 의존성 참조
- **UI 애니메이션**: framer-motion 12.x, motion 12.x
- **3D**: @react-three/fiber 8.x, three 0.159
- **터미널**: xterm 5.3
- **아이콘**: lucide-react 0.475
- **댓글**: @giscus/react 3.1
- **코드 하이라이팅**: prism-react-renderer 2.3

## 주의사항
- 이 프로젝트는 **Next.js가 아님**. Docusaurus 3 프로젝트임.
- Vercel 배포가 아닌 **GitHub Pages** 배포.
- `yarn` 외 다른 패키지 매니저 사용 금지.
- Docusaurus의 swizzle된 테마 컴포넌트 수정 시 Docusaurus 업그레이드 호환성 주의.
