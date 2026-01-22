AGENTS GUIDE

Purpose: give agents a fast, opinionated playbook to work safely in this repo. Keep answers concise and leave user content unchanged unless asked.

Stack Snapshot
- Framework: Docusaurus 3 (TypeScript, React 18)
- Styling: TailwindCSS + custom global CSS (`src/css/custom.css`), shadcn/ui components
- Package manager: yarn@1.22 (Node >=18)
- Paths/aliases (`tsconfig.json`): `@/*`, `@site/*`, `@/components/*`, `@/ui/*`, `@/lib/*`
- i18n: defaultLocale en; theme expects dark-mode via `class`/`data-theme="dark"`
- Comments: Giscus wired in `src/components/Comments`

Install & Tooling
- Install: `yarn`
- Start dev: `yarn start`
- Build (prod): `yarn build`
- Serve built output: `yarn serve`
- Deploy (GitHub Pages): `yarn deploy` (requires `GIT_USER` or `USE_SSH=true`)
- Clear cache: `yarn clear`
- Type check: `yarn typecheck`
- Transl. helpers: `yarn write-translations`, `yarn write-heading-ids`
- Swizzle components: `yarn swizzle`
- Tests/Lint: none configured. Do not invent commands. To run a “single test,” none exists; suggest adding test tooling only if requested.

Running a Single Check (current state)
- TypeScript: no per-file mode; use `yarn typecheck` (whole project). Optionally scope by editing `tsconfig` includes, but avoid unless user asks.
- No Jest/Vitest/ESLint/Prettier set up.

Repo Layout Highlights
- `src/pages` and `src/theme`: Docusaurus overrides and pages
- `src/components`: shared UI (Tailwind + shadcn patterns)
- `src/lib/utils.ts`: `cn` helper (clsx + tailwind-merge); use for className merges
- `blog/`: MD/MDX posts in dated folders; frontmatter with `slug`, `title`, `authors`, `tags`
- `docs/`: docs content; sidebar auto-generated via `sidebars.ts`
- `static/`: assets and fonts (do not move font files referenced in CSS)

Imports & Module Style
- Order imports: React/types first → external libs → Docusaurus packages → site aliases (`@site/*`, `@/*`) → relative paths.
- Prefer named imports; keep default React import only when JSX runtime requires.
- Use existing aliases; avoid deep relative paths when an alias fits.
- Use `cn` for Tailwind class merging; avoid manual string concatenation.

Components & Hooks
- Functional components only. Keep hooks at top level; respect React hook rules.
- Type props with interfaces/types; avoid `any`. For wrappers, reuse Docusaurus types (e.g., `WrapperProps`, `Props` from theme modules).
- For optional props, provide sensible defaults; guard against `undefined` (e.g., optional metadata).
- When wrapping theme components, preserve original props spread to maintain behavior.

Styling Guidance
- Tailwind-first. Reuse tokens from `tailwind.config.js` (colors based on CSS variables). Keep dark-mode compatibility; prefer utility classes that work in both themes.
- Global typography is aggressive in `src/css/custom.css`; avoid fighting it unless necessary. If adjusting global styles, document why.
- Component styles: keep responsive classes consistent with existing patterns (flex layouts, h-[calc(...)] usage).
- Do not remove `important: true` Tailwind setting; it is intentional for Docusaurus overrides.

Content & MDX
- Blog posts: keep assets in the same post folder; use relative paths. Frontmatter supports `comments` (boolean) to toggle Giscus (default true in `src/theme/BlogPostItem/index.tsx`).
- Docs: sidebar auto via filesystem; keep `_category_.json` when adding sections.
- Links/images: prefer relative paths; let Docusaurus handle baseUrl.

Navbar/Footer Customizations
- Navbar hidden on `/me` routes via `src/theme/Navbar/index.tsx`; respect that guard.
- Avoid breaking `useLocation` checks; keep pathname comparisons strict.

Date/Reading Time Display
- Date formatting lives in `src/theme/BlogPostItem/Header/Info/index.tsx` using `useDateTimeFormat({year:'numeric', month:'numeric', day:'numeric'})`; renders like `12/10/2025`. Reading time via `usePluralForm`. Adjust formatting there if requested.

Forms/Auth Notes
- `docusaurus.config.ts` stores `customFields.authid/authpw` for `/login`. Treat as sensitive; never log or expose beyond intended usage. Login page: `src/pages/login.tsx` uses `sessionStorage` token.

Error Handling & Edge Cases
- Prefer graceful fallbacks (null checks on metadata, images, optional config).
- Avoid throwing in render paths; log to console only when actionable.
- When fetching config/customFields, default safely to avoid runtime crashes.

Accessibility & Semantics
- Preserve semantics in theme overrides (headings, time tags). Keep `VisuallyHidden` for dialog titles where present.
- Ensure interactive elements remain keyboard-usable (`asChild` triggers, buttons with type submit where forms exist).

Performance
- Use React.lazy/Suspense only if already patterned. Avoid heavy work in render; memoize where beneficial but do not overuse.
- Images: prefer optimized sizes in `static/`; use `loading="lazy"` where possible.

When Adding New UI
- Match existing tone (monospace + minimal chrome). Respect dark/light modes. Use Tailwind utilities; avoid inline styles unless necessary.
- If introducing new fonts or colors, extend `tailwind.config.js` instead of ad-hoc hex values.

Tests/Linting Policy
- None present. If user requests tests/lint, propose appropriate tooling (e.g., Vitest + React Testing Library, ESLint + Prettier) but do not add without instruction.

Data & Privacy
- Do not commit secrets. Review `customFields` and env-like values before logging. `docusaurus.config.ts` contains identifiers; keep them in config only.

Static Assets
- Fonts loaded from `/font/...` via `custom.css`; do not rename/move without updating URLs.
- `.nojekyll` exists in `static/`; leave intact for GitHub Pages.

Working with Tailwind Animations
- Accordion animations defined in `tailwind.config.js` (`accordion-down/up`) used by shadcn components; keep classNames when editing.

Deployment Notes
- `yarn build && yarn serve` to verify production output locally.
- GitHub Pages deploy via `yarn deploy`; requires repo permissions and correct `baseUrl` (currently `/`).

Git Hygiene for Agents
- Never reset user changes. Stage only intended files. No commits unless explicitly requested. Do not push unless asked.

If You Must Tweak Core Config
- Docusaurus config: keep `plugins`, `themes`, `presets` structure intact; JSON-LD objects near top. Update `siteUrl`/`favicon` only on request.
- Tailwind config: preserve `important: true`, `darkMode` settings, and font families.

Quick Checks Before Finishing Work
- Run `yarn typecheck` when TS code changes.
- Run `yarn build` before release/deploy-impacting changes.
- Verify dark/light rendering if UI changes touch colors or backgrounds.
- For blog/docs changes, build or at least `yarn start` preview if feasible.

No Cursor/Copilot Rules
- No `.cursor/rules/` or `.cursorrules`. No `.github/copilot-instructions.md`. Nothing special to import.

Communication Style for Agents
- Be concise. Mention commands you ran. Point to paths (e.g., `src/theme/BlogPostItem/Header/Info/index.tsx`). Avoid dumping large diffs; summarize.

End of guide.
