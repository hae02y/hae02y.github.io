'use client';

import ExperienceSummary from '@/components/Resume/ExperienceSummary';
import ExperienceTimeline from '@/components/Resume/ExperienceTimeline';
import ProjectTimeline from '@/components/Resume/ProjectTimeline';
import ActivitySection from '@/components/Resume/ActivitySection';
import ResumeLinks from '@/components/Resume/ResumeLinks';
import EducationSection from '@/components/Resume/EducationSection';
import CertificationSection from '@/components/Resume/CertificationSection';
import { experienceItems } from '@/data/resume-experience';
import { resumeAutomation } from '@/data/resume-automation';
import { resumeProjects } from '@/data/resume-projects';
import { activityItems } from '@/data/resume-activities';
import { resumeLinks } from '@/data/resume-links';
import { educationItems } from '@/data/resume-education';
import { certificationItems } from '@/data/resume-certifications';

export default function ResumePage() {
  return (
    <div>
      <h1>정해영</h1>
      <p>godud1118@gmail.com</p>
      <p>
        백엔드와 인프라 전반을 아우르며 시스템을 설계·개선해온 개발자로, 문제의 본질을 이해하고 구조적으로 해결하는 것을 중요하게 생각합니다.
        실무에 적용 가능한 AI 기술을 포함해, 기술적 판단의 배경을 투명하게 공유하며 팀과 함께 성장하는 개발을 지향합니다.
      </p>

      <h2>경력 <ExperienceSummary items={experienceItems} /></h2>
      <ExperienceTimeline items={experienceItems} />

      <h2>주요 업무</h2>
      <ProjectTimeline projects={resumeProjects} />

      <h3>개발 생산성 · 업무 자동화</h3>
      <ProjectTimeline projects={resumeAutomation} />

      <h2>활동</h2>
      <ActivitySection items={activityItems} />

      <h2>교육</h2>
      <EducationSection items={educationItems} />

      <h2>자격증</h2>
      <CertificationSection items={certificationItems} />

      <h2>링크</h2>
      <ResumeLinks links={resumeLinks} />
    </div>
  );
}
