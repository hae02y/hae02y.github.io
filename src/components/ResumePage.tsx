'use client';

import ExperienceSummary from '@/components/Resume/ExperienceSummary';
import ExperienceTimeline from '@/components/Resume/ExperienceTimeline';
import ProjectTimeline from '@/components/Resume/ProjectTimeline';
import ActivitySection from '@/components/Resume/ActivitySection';
import ResumeLinks from '@/components/Resume/ResumeLinks';
import EducationSection from '@/components/Resume/EducationSection';
import CertificationSection from '@/components/Resume/CertificationSection';
import { meConfig } from '@/config/me';

export default function ResumePage() {
  const { profile, resume } = meConfig;

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>{profile.email}</p>
      {profile.summary.map(paragraph => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      <h2>경력 <ExperienceSummary items={resume.experiences} /></h2>
      <ExperienceTimeline items={resume.experiences} />

      <h2>주요 업무</h2>
      <ProjectTimeline projects={resume.projects} />

      <h3>개발 생산성 · 업무 자동화</h3>
      <ProjectTimeline projects={resume.automation} />

      <h2>활동</h2>
      <ActivitySection items={resume.activities} />

      <h2>교육</h2>
      <EducationSection items={resume.education} />

      <h2>자격증</h2>
      <CertificationSection items={resume.certifications} />

      <h2>링크</h2>
      <ResumeLinks links={resume.links} />
    </div>
  );
}
