import React from 'react';
import Layout from '@theme/Layout';

type MeLayoutProps = {
  title?: string;
  children: React.ReactNode;
};

export default function MeLayout({title, children}: MeLayoutProps) {
  return (
    <Layout title={title}>
      <style>{`
        @font-face {
          font-family: 'Pretendard';
          font-weight: 900;
          font-display: swap;
          src: local('Pretendard Black'), url('/font/pretendard/Pretendard-Black.woff2') format('woff2'), url('/font/pretendard/Pretendard-Black.woff') format('woff');
        }
        @font-face {
          font-family: 'Pretendard';
          font-weight: 800;
          font-display: swap;
          src: local('Pretendard ExtraBold'), url('/font/pretendard/Pretendard-ExtraBold.woff2') format('woff2'), url('/font/pretendard/Pretendard-ExtraBold.woff') format('woff');
        }
        @font-face {
          font-family: 'Pretendard';
          font-weight: 700;
          font-display: swap;
          src: local('Pretendard Bold'), url('/font/pretendard/Pretendard-Bold.woff2') format('woff2'), url('/font/pretendard/Pretendard-Bold.woff') format('woff');
        }
        @font-face {
          font-family: 'Pretendard';
          font-weight: 600;
          font-display: swap;
          src: local('Pretendard SemiBold'), url('/font/pretendard/Pretendard-SemiBold.woff2') format('woff2'), url('/font/pretendard/Pretendard-SemiBold.woff') format('woff');
        }
        @font-face {
          font-family: 'Pretendard';
          font-weight: 500;
          font-display: swap;
          src: local('Pretendard Medium'), url('/font/pretendard/Pretendard-Medium.woff2') format('woff2'), url('/font/pretendard/Pretendard-Medium.woff') format('woff');
        }
        @font-face {
          font-family: 'Pretendard';
          font-weight: 400;
          font-display: swap;
          src: local('Pretendard Regular'), url('/font/pretendard/Pretendard-Regular.woff2') format('woff2'), url('/font/pretendard/Pretendard-Regular.woff') format('woff');
        }
        @font-face {
          font-family: 'Pretendard';
          font-weight: 300;
          font-display: swap;
          src: local('Pretendard Light'), url('/font/pretendard/Pretendard-Light.woff2') format('woff2'), url('/font/pretendard/Pretendard-Light.woff') format('woff');
        }
        @font-face {
          font-family: 'Pretendard';
          font-weight: 200;
          font-display: swap;
          src: local('Pretendard ExtraLight'), url('/font/pretendard/Pretendard-ExtraLight.woff2') format('woff2'), url('/font/pretendard/Pretendard-ExtraLight.woff') format('woff');
        }
        @font-face {
          font-family: 'Pretendard';
          font-weight: 100;
          font-display: swap;
          src: local('Pretendard Thin'), url('/font/pretendard/Pretendard-Thin.woff2') format('woff2'), url('/font/pretendard/Pretendard-Thin.woff') format('woff');
        }
        .navbar,
        .navbar-sidebar,
        .navbar-sidebar__backdrop {
          display: none !important;
        }
        body {
          margin: 0;
          padding-top: 0 !important;
          background: #fff;
        }
        .main-wrapper {
          padding-top: 0 !important;
        }
        .resume-page,
        .resume-page * {
          // all: revert;
          box-sizing: border-box;
        }
        .resume-page {
          font-family: Pretendard, -apple-system, BlinkMacSystemFont, Bazier Square, Noto Sans KR, Segoe UI, Apple SD Gothic Neo, Roboto, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
          letter-spacing: -0.2px;
          color: #334155;
          background: #fff;
          padding-bottom: 2rem;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        [data-theme='dark'] .resume-page {
          color: #334155;
          background: #fff;
        }
        [data-theme='dark'] .resume-page h1,
        [data-theme='dark'] .resume-page h2,
        [data-theme='dark'] .resume-page h3,
        [data-theme='dark'] .resume-page h4,
        [data-theme='dark'] .resume-page h5 {
          color: #0f172a;
        }
        [data-theme='dark'] .resume-page p,
        [data-theme='dark'] .resume-page li,
        [data-theme='dark'] .resume-page .resume-timeline-project-summary,
        [data-theme='dark'] .resume-page .portfolio-detail-summary {
          color: #334155;
        }
        [data-theme='dark'] .resume-page a,
        [data-theme='dark'] .resume-page .resume-project-link {
          color: #3a7bd5;
        }
        [data-theme='dark'] .resume-page a:hover,
        [data-theme='dark'] .resume-page .resume-project-link:hover {
          color: #00d2ff;
        }
        [data-theme='dark'] .resume-page .resume-project-card,
        [data-theme='dark'] .resume-page .portfolio-card,
        [data-theme='dark'] .resume-page .portfolio-timeline-card,
        [data-theme='dark'] .resume-page .resume-certification-item,
        [data-theme='dark'] .resume-page .portfolio-toc {
          background: #fff;
          border-color: #e2e8f0;
        }
        .resume-container {
          width: 100%;
          max-width: 50rem;
          margin: auto;
          padding: 2.5rem 2rem 0;
        }
        .me-tabs {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .me-tab {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0.55rem 1.1rem;
          font-size: 0.9rem;
          font-weight: 700;
          border: 1px solid #e2e8f0;
          color: #334155;
          text-decoration: none;
          transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
        }
        .me-tab:hover {
          border-color: #94a3b8;
        }
        .me-tab.is-active {
          background: #0f172a;
          border-color: #0f172a;
          color: #fff;
        }
        .resume-page h1 { font-size: 2.8rem; line-height: 1.2; margin: 0 0 0.8rem; color: #0f172a; }
        @media (max-width: 960px) { .resume-page h1 { font-size: 2.2rem; } }
        .resume-page h2 { font-size: 2rem; line-height: 1.35; margin: 2.5rem 0 1rem; color: #0f172a; }
        .resume-page h3, .resume-page h4 { font-size: 1.4rem; line-height: 1.4; margin: 1.2rem 0 0.6rem; color: #0f172a; }
        @media (max-width: 960px) { .resume-page h4 { font-size: 1.25rem; } }
        .resume-page h5 { font-size: 1.15rem; margin: 0 0 0.5rem; color: #0f172a; }
        .resume-page p { margin: 0 0 0.75rem; font-size: 1.02rem; line-height: 1.62; }
        .resume-page a { color: #3a7bd5; transition: color 0.3s ease; }
        .resume-page a:hover { color: #00d2ff; }
        .resume-page ul { list-style: none; padding: 0; margin: 0 0 0.65rem; font-size: 0.98rem; line-height: 1.5; }
        .resume-page ul > li { position: relative; padding: 0.1rem 0 0.1rem 1.05rem; margin-bottom: 0.15rem; }
        .resume-page ul > li:before { position: absolute; left: 0; display: inline-block; content: "•"; color: #3a7bd5; }
        .resume-page .period-mark { color: #3a7bd5; }
        .resume-page .big-paragraph { font-size: 1.4rem; line-height: 1.6; font-weight: 500; margin-bottom: 1.8rem; color: #0f172a; }
        @media (max-width: 960px) { .resume-page .big-paragraph { font-size: 1.2rem; } }
        .resume-page {
          display: flex;
          flex-direction: column;
          min-height: 90vh;
        }
        .resume-projects { display: flex; flex-direction: column; gap: 1.2rem; }
        .resume-project-card {
          border: 1px solid #e2e8f0;
          border-radius: 0.9rem;
          padding: 1.1rem 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          background: #fff;
        }
        .resume-project-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }
        .resume-project-org { font-size: 1.02rem; font-weight: 400; color: #64748b; }
        .resume-project-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: #0f172a;
          display: flex;
          align-items: center;
        }
        .resume-project-period { font-size: 0.9rem; color: #64748b; white-space: nowrap; }
        .resume-project-list { margin: 0; padding: 0; list-style: none; font-size: 0.98rem; line-height: 1.5; }
        .resume-project-list li { position: relative; padding-left: 1rem; margin-bottom: 0.2rem; }
        .resume-project-list li:before { position: absolute; left: 0; content: "•"; color: #3a7bd5; }
        .resume-project-techstack { font-size: 0.9rem; color: #64748b; margin-top: 0.2rem; }
        .resume-project-group-list { display: flex; flex-direction: column; gap: 0.7rem; }
        .resume-project-group-title { font-size: 0.95rem; font-weight: 600; color: #334155; margin-bottom: 0.2rem; }
        .resume-project-link { font-size: 0.92rem; color: #3a7bd5; font-weight: 600; }
        .resume-inline-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1rem;
          height: 1rem;
          color: #3a7bd5;
          flex-shrink: 0;
          margin-right: 0.4rem;
        }
        .resume-activities { display: flex; flex-direction: column; gap: 1.1rem; }
        .resume-activity-item { display: flex; flex-direction: column; gap: 0.4rem; }
        .resume-activity-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }
        .resume-activity-title { font-size: 1.02rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; }
        .resume-activity-subtitle { font-size: 0.95rem; color: #64748b; }
        .resume-activity-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .resume-activity-tag {
          font-size: 0.78rem;
          font-weight: 600;
          color: #1e3a8a;
          background: #e0edff;
          border-radius: 999px;
          padding: 0.2rem 0.55rem;
        }
        .resume-activity-list { margin: 0; padding: 0; list-style: none; font-size: 0.98rem; line-height: 1.5; }
        .resume-activity-list li { position: relative; padding-left: 1rem; margin-bottom: 0.2rem; }
        .resume-activity-list li:before { position: absolute; left: 0; content: "•"; color: #3a7bd5; }
        .resume-activity-group-list { display: flex; flex-direction: column; gap: 0.6rem; }
        .resume-activity-group-title { font-size: 0.95rem; font-weight: 400; color: #64748b; margin-bottom: 0.2rem; }
        .resume-education {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .resume-certifications {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.8rem 1.4rem;
        }
        .resume-education-item,
        .resume-certification-item {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .resume-certification-item {
          border: 1px solid #e2e8f0;
          border-radius: 0.8rem;
          padding: 0.8rem 0.9rem;
          background: #fff;
        }
        .resume-education-school,
        .resume-certification-name {
          font-size: 1.02rem;
          font-weight: 700;
          color: #0f172a;
          word-break: keep-all;
          display: block;
        }
        .resume-education-school,
        .resume-certification-name { display: flex; align-items: center; }
        .resume-education-program { font-size: 0.98rem; color: #334155; }
        .resume-education-period,
        .resume-certification-meta {
          font-size: 0.9rem;
          color: #64748b;
          word-break: keep-all;
          display: block;
        }
        .resume-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 1.2rem;
        }
        .resume-link-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.98rem;
          font-weight: 600;
          color: #334155;
          text-decoration: none;
        }
        .resume-link-item:hover { color: #0f172a; }
        .resume-link-icon { width: 1rem; height: 1rem; color: #3a7bd5; }
        .resume-timeline { display: flex; flex-direction: column; gap: 2rem; }
        .resume-timeline-item { display: flex; gap: 2rem; padding-bottom: 2rem; }
        .resume-timeline-item:last-child { padding-bottom: 0; }
        .resume-timeline-left { position: relative; flex: 0 0 14rem; padding-left: 1.8rem; }
        .resume-timeline-meta { display: flex; flex-direction: column; gap: 0.35rem; }
        .resume-timeline-company-row {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .resume-timeline-company {
          font-size: 1.14rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .resume-experience-total {
          margin-left: 0.6rem;
          font-size: 0.95rem;
          font-weight: 400;
          color: #475569;
        }
        .resume-timeline-icon {
          display: inline-block;
          width: 1.05rem;
          height: 1.05rem;
          color: #3a7bd5;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.6;
        }
        .resume-timeline-icon * {
          stroke: currentColor;
          fill: none;
        }
        .resume-timeline-role { font-size: 0.95rem; font-weight: 600; color: #334155; }
        .resume-timeline-period { font-size: 0.9rem; color: #64748b; }
        .resume-timeline-highlight { font-size: 0.95rem; color: #334155; }
        .resume-timeline-summary { font-size: 0.98rem; color: #334155; line-height: 1.5; }
        .resume-timeline-right { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; }
        .portfolio-company-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .portfolio-company-marker {
          position: relative;
          width: 1.2rem;
          display: flex;
          justify-content: center;
        }
        .portfolio-company-dot {
          width: 0.55rem;
          height: 0.55rem;
          border-radius: 999px;
          background: #3a7bd5;
          margin-top: 0.35rem;
        }
        .portfolio-company-connector {
          position: absolute;
          top: 1.05rem;
          bottom: -1.6rem;
          width: 2px;
          background: #d7e3f4;
        }
        .resume-experience-timeline { --experience-timeline-gap: 1.2rem; gap: 1.2rem; }
        .resume-experience-timeline .resume-timeline-item { padding-bottom: 1.2rem; }
        .resume-experience-timeline .resume-timeline-item:last-child { padding-bottom: 0; }
        .resume-experience-timeline .portfolio-company-marker { align-self: stretch; }
        .resume-experience-timeline .portfolio-company-connector {
          bottom: calc(-1 * (var(--experience-timeline-gap) + 0.625rem));
        }
        .company-timeline-collapsed {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
          padding-left: 0.2rem;
        }
        .company-timeline-item {
          position: relative;
          display: grid;
          grid-template-columns: 1.1rem minmax(0, 1fr);
          column-gap: 0.75rem;
          align-items: flex-start;
        }
        .company-timeline-dot {
          width: 0.55rem;
          height: 0.55rem;
          border-radius: 999px;
          background: #3a7bd5;
          margin-top: 0.35rem;
          flex-shrink: 0;
        }
        .resume-timeline-project-group {
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
        }
        .resume-project-item { display: flex; gap: 1rem; }
        .resume-project-separator {
          position: relative;
          width: 1.2rem;
          display: flex;
          justify-content: center;
        }
        .resume-project-dot {
          width: 0.55rem;
          height: 0.55rem;
          border-radius: 999px;
          background: #3a7bd5;
          margin-top: 0.35rem;
        }
        .resume-project-connector {
          position: absolute;
          top: 1.05rem;
          bottom: -1.6rem;
          width: 2px;
          background: #d7e3f4;
        }
        .resume-project-content { flex: 1; }
        .resume-timeline-project-title {
          font-size: 1.05rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .resume-project-icon {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          color: #3a7bd5;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.6;
        }
        .resume-project-icon * {
          stroke: currentColor;
          fill: none;
        }
        .resume-timeline-project-summary { font-size: 0.98rem; color: #334155; margin-bottom: 0.35rem; }
        .resume-timeline-project-list { margin: 0; padding: 0; list-style: none; }
        .resume-timeline-project-list li { position: relative; padding-left: 1rem; margin-bottom: 0.25rem; font-size: 0.98rem; line-height: 1.5; }
        .resume-timeline-project-list li:before { position: absolute; left: 0; content: "•"; color: #3a7bd5; }
        .resume-timeline-project-tech { font-size: 0.95rem; color: #475569; }
        @media (max-width: 960px) {
          .resume-timeline-item { flex-direction: column; }
          .resume-timeline-left { flex: 1; padding-left: 1.8rem; }
          .resume-project-header { flex-direction: column; align-items: flex-start; }
          .resume-project-period { white-space: normal; }
          .resume-activity-header { flex-direction: column; align-items: flex-start; }
          .resume-certifications { grid-template-columns: 1fr; }
        }
        .portfolio-section { margin-bottom: 3rem; }
        .portfolio-section h2 { margin-top: 0; }
        .portfolio-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .portfolio-toc-wrapper {
          position: fixed;
          right: 0.4rem;
          top: 9rem;
          z-index: 10;
        }
        .portfolio-toc-handle {
          width: 0.6rem;
          height: 3.8rem;
          border-radius: 999px;
          background: linear-gradient(180deg, #e2e8f0 0%, #c7d2fe 100%);
          border: 1px solid rgba(148, 163, 184, 0.6);
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.18);
          opacity: 0.95;
        }
        .portfolio-toc-wrapper:hover .portfolio-toc-handle,
        .portfolio-toc-wrapper:focus-within .portfolio-toc-handle {
          opacity: 1;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.22);
        }
        .portfolio-toc {
          margin-top: 0.75rem;
          max-height: calc(100vh - 12rem);
          overflow: auto;
          border-left: 1px solid #e2e8f0;
          padding-left: 1.25rem;
          font-size: 0.92rem;
          color: #64748b;
          background: rgba(255, 255, 255, 0.95);
          padding-right: 0.25rem;
          opacity: 0;
          transform: translateX(8px);
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .portfolio-toc-wrapper:hover .portfolio-toc,
        .portfolio-toc-wrapper:focus-within .portfolio-toc {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
        }
        .portfolio-toc ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .portfolio-toc a {
          color: inherit;
          text-decoration: none;
        }
        .portfolio-toc a:hover {
          color: #0f172a;
        }
        .portfolio-toc a.is-active {
          color: #0f172a;
          font-weight: 700;
        }
        .portfolio-toggle {
          width: 2rem;
          height: 2rem;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #0f172a;
          font-size: 1.1rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
        }
        .portfolio-toggle:hover {
          border-color: #94a3b8;
          background: #f8fafc;
        }
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.5rem;
        }
        .portfolio-card {
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          background: #fff;
          transition: border-color 0.2s ease;
        }
        .portfolio-card:hover {
          border-color: #94a3b8;
        }
        .portfolio-card-header {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .portfolio-card-header h3 { margin: 0; font-size: 1.15rem; }
        .portfolio-card-period { font-size: 0.9rem; color: #64748b; }
        .portfolio-card-summary { margin: 0; font-size: 0.98rem; color: #334155; }
        .portfolio-card-meta { font-size: 0.9rem; color: #64748b; }
        .portfolio-card-link { font-weight: 600; }
        @media (max-width: 960px) {
          .portfolio-toc-wrapper { display: none; }
        }
        .portfolio-detail-meta {
          font-size: 0.95rem;
          color: #64748b;
          margin-bottom: 0.35rem;
        }
        .portfolio-detail-summary {
          margin: 0 0 0.75rem;
          font-size: 1.02rem;
          line-height: 1.62;
          color: #334155;
        }
        .portfolio-timeline-card {
          padding: 0.2rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .portfolio-timeline-card .resume-timeline-project-summary,
        .portfolio-timeline-card .resume-timeline-project-tech {
          margin: 0;
        }
        .resume-project-link-wrapper {
          text-decoration: none;
          color: inherit;
        }
        .resume-project-item:hover .portfolio-timeline-card {
          background: #f8fafc;
          border-radius: 0.75rem;
        }
        .resume-project-item:hover .resume-project-dot {
          background: #2563eb;
        }
        .resume-project-link-wrapper:hover .resume-project-icon {
          color: #2563eb;
        }
        .resume-timeline-item.is-collapsed {
          padding-bottom: 1.1rem;
          border-bottom: 1px solid #eef2f7;
        }
        .resume-timeline-item.is-collapsed:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }
        .resume-timeline-item.is-collapsed .resume-timeline-left {
          flex: 1;
        }
        @media (max-width: 960px) {
          .portfolio-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="resume-page">
        <div className="resume-container">{children}</div>
      </div>
    </Layout>
  );
}
