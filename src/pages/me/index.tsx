import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {resumeData, type ResumeData} from '@site/src/data/resume';

type SkillCategory = { name: string; skills: string[] };
type WorkProject = {
    title: string;
    period?: string;
    description?: string;
    tasks?: string[];
    techStack?: string[];
    link?: string;
};
type WorkItem = {
    company: string;
    role: string;
    period: string;
    description?: string;
    projects?: WorkProject[];
};
type OtherItem = { title: string; role?: string; period?: string; description?: string; link?: string };
type Profile = {
    name: string;
    title: string;
    description?: string;
    resumeUrl?: string;
};
type Links = { name: string; url: string; icon?: string }[];

function SkillList({categories}: {categories: SkillCategory[]}) {
    if (!categories?.length) return null;
    return (
        <section>
            <h2 className="text-3xl font-semibold mb-8">Skills<span className="text-cyan-500 period-mark">.</span></h2>
            {categories.map((cat) => (
                <div key={cat.name} className="other">
                    <h3 className="text-2xl font-semibold mb-1">
                        {cat.name}
                        <span className="text-cyan-500 period-mark">.</span>
                    </h3>
                    <ul className="list-none p-0 m-0 text-[1.1rem] leading-[1.4]">
                        {cat.skills.map((skill) => (
                            <li key={skill} className="relative pl-4 py-1 before:content-['•'] before:absolute before:left-0 before:text-cyan-500">
                                {skill}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );
}

function ExperienceList({items}: {items: ExperienceItem[]}) {
    return (
        <section>
            <h2 className="text-3xl font-semibold mb-8">Work Experience<span className="text-cyan-500 period-mark">.</span></h2>
            {items.map((exp) => (
                <div key={`${exp.company}-${exp.period}`} className="row border-b border-[#eee]">
                    <div className="row-left">
                        <h3 className="text-2xl font-semibold mb-1">
                            {exp.company}
                            <span className="text-cyan-500 period-mark">.</span>
                        </h3>
                        <span className="role text-base font-medium">{exp.role}</span>
                        <span className="text-sm text-[#555]">{exp.period}</span>
                    </div>
                    <div className="row-right">
                        {exp.projects?.map((p) => (
                            <div key={p.title} className="project">
                                <h4 className="text-2xl font-semibold mb-1">
                                    {p.title}
                                    <span className="text-cyan-500 period-mark">.</span>
                                </h4>
                                {p.period && <span className="time text-sm text-[#555]">{p.period}</span>}
                                {p.description && (
                                    <>
                                        <h5 className="text-[1.3rem] font-semibold text-[#333] mb-1">Description<span className="text-cyan-500 period-mark">.</span></h5>
                                        <p className="text-[1.1rem] leading-[1.4]">{p.description}</p>
                                    </>
                                )}
                                {p.tasks?.length ? (
                                    <>
                                        <h5 className="text-[1.3rem] font-semibold text-[#333] mb-1">What did I do<span className="text-cyan-500 period-mark">.</span></h5>
                                        <ul className="text-[1.1rem] leading-[1.4]">
                                            {p.tasks.map((t) => (
                                                <li key={t} className="relative pl-4 py-[0.2rem] before:content-['•'] before:absolute before:left-0 before:text-cyan-500">
                                                    {t}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : null}
                                {p.techStack?.length ? (
                                    <>
                                        <h5 className="text-[1.3rem] font-semibold text-[#333] mb-1">Tech Stack<span className="text-cyan-500 period-mark">.</span></h5>
                                        <p className="text-[1.1rem] leading-[1.4]">{p.techStack.join(', ')}</p>
                                    </>
                                ) : null}
                                {p.link && (
                                    <div className="mt-2">
                                        <Link className="text-[#3a7bd5] hover:text-[#00d2ff] transition-colors" to={p.link} target="_blank">
                                            Link
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}

function OtherSection({items}: {items: OtherItem[]}) {
    if (!items?.length) return null;
    return (
        <section>
            <h2 className="text-3xl font-semibold mb-8">Other Experiences<span className="text-cyan-500 period-mark">.</span></h2>
            {items.map((item) => (
                <div key={`${item.title}-${item.period}`} className="other">
                    <h3 className="text-2xl font-semibold mb-1">
                        {item.title}
                        <span className="text-cyan-500 period-mark">.</span>
                    </h3>
                    {item.role && <span className="role text-base font-medium">{item.role}</span>}
                    {item.period && <span className="time text-sm text-[#555] block">{item.period}</span>}
                    {item.description && <p className="text-[1.1rem] leading-[1.4] mt-2">{item.description}</p>}
                    {item.link && (
                        <div className="mt-2">
                            <Link className="text-[#3a7bd5] hover:text-[#00d2ff] transition-colors" to={item.link} target="_blank">
                                Link
                            </Link>
                        </div>
                    )}
                </div>
            ))}
        </section>
    );
}

function ContactLinks({links}: {links: Links}) {
    if (!links?.length) return null;
    return (
        <section>
            <h2 className="text-3xl font-semibold mb-8">Contact<span className="text-cyan-500 period-mark">.</span></h2>
            <ul className="list-none p-0 m-0 text-[1.1rem] leading-[1.4]">
                {links.map((l) => (
                    <li key={l.url} className="relative pl-4 py-[0.2rem] before:content-['•'] before:absolute before:left-0 before:text-cyan-500">
                        <Link className="text-[#3a7bd5] hover:text-[#00d2ff] transition-colors" to={l.url} target="_blank">
                            {l.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function HeroCard({intro, profile}: {intro: ResumeData['intro']; profile: Profile}) {
    return (
        <section className="space-y-4">
            <h1 className="text-[5rem] leading-[1.1] font-bold whitespace-pre-line">
                {intro.headline}
                <span className="text-cyan-500 period-mark">.</span>
            </h1>
            <p className="big-paragraph">{intro.description}</p>
        </section>
    );
}

export default function Me() {
    const {intro, profile, skills, work, other, contact} = resumeData;
    return (
        <Layout noNavbar>
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
                padding-top: 0 !important;
              }
              .main-wrapper {
                padding-top: 0 !important;
              }
              .resume-page {
                font-family: Pretendard,-apple-system,BlinkMacSystemFont,Bazier Square,Noto Sans KR,Segoe UI,Apple SD Gothic Neo,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
                letter-spacing: -0.3px;
                color: #222;
                padding-bottom: 2rem;
                overflow-x: hidden;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              .resume-page .container {
                width: 100%;
                max-width: 50rem;
                margin: auto;
                padding: 0 2rem;
              }
              .resume-page h1 { font-size: 5rem; line-height: 1.1; margin: 0 0 1rem; }
              @media (max-width: 960px) { .resume-page h1 { font-size: 3rem; } }
              .resume-page h2 { font-size: 3rem; margin: 4rem 0 2rem; }
              .resume-page h3, .resume-page h4 { font-size: 2rem; margin: 0 0 1rem; }
              @media (max-width: 960px) { .resume-page h4 { font-size: 1.5rem; } }
              .resume-page h5 { font-size: 1.3rem; margin: 0 0 0.5rem; color: #333; }
              .resume-page p { margin: 0 0 1rem; font-size: 1.1rem; line-height: 1.4; }
              .resume-page a { color: #3a7bd5; transition: color .3s ease; }
              .resume-page a:hover { color: #00d2ff; }
              .resume-page ul { list-style: none; padding: 0; margin: 0 0 1rem; font-size: 1.1rem; }
              .resume-page ul > li { position: relative; padding: 0.2rem 0 0.2rem 1rem; }
              .resume-page ul > li:before { position: absolute; left: 0; display: inline-block; content: "•"; color: #3a7bd5; }
              .resume-page .period-mark { color: #3a7bd5; }
              .resume-page .big-paragraph { font-size: 2rem; line-height: 1.4; font-weight: 500; margin-bottom: 2rem; }
              @media (max-width: 960px) { .resume-page .big-paragraph { font-size: 1.5rem; } }
              .resume-page .row { display: flex; padding: 3rem 0; border-bottom: 1px solid #eee; gap: 1.5rem; }
              .resume-page .row-left { flex-basis: 18rem; padding-right: 1rem; flex-shrink: 0; }
              .resume-page .row-right { flex: 1; }
              @media (max-width: 960px) {
                .resume-page .row { flex-direction: column; }
                .resume-page .row-left { flex-basis: 100%; padding-right: 0; padding-bottom: 1rem; }
              }
              .resume-page .other { padding: 3rem 0; border-bottom: 1px solid #eee; }
              .resume-page .role { display: block; }
              .resume-page .project { padding: 1.5rem 0; }
              .resume-page .project:first-child { padding-top: 0; }
              .resume-page .time { display: block; margin-bottom: 1.5rem; }
            `}</style>
            <div className="resume-page flex flex-col min-h-[90vh]">
                <div className="container py-10 space-y-10">
                    <HeroCard intro={intro} profile={profile}/>

                    <ExperienceList items={work}/>
                    <OtherSection items={other}/>
                    <SkillList categories={skills?.categories ?? []}/>
                    <ContactLinks links={contact}/>
                </div>
            </div>
        </Layout>
    );
}
