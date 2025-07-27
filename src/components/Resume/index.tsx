import React from 'react';
import ProfileSection from './ProfileSection';
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import LinksSection from './LinksSection';
import ResumeDownload from './ResumeDownload';

interface ResumeProps {
  profile: {
    name: string;
    title: string;
    description: string;
    image: string;
  };
  skills: {
    categories: Array<{
      name: string;
      skills: string[];
    }>;
  };
  experience: Array<{
    company: string;
    position: string;
    period: string;
    description?: string;
    responsibilities: Array<{
      title: string;
      technologies: string[];
      details: string[];
    }>;
  }>;
  links: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
  resumeUrl: string;
}

export default function Resume({ profile, skills, experience, links, resumeUrl }: ResumeProps) {
  return (
    <div className="max-w-4xl w-full rounded-lg p-8">
      {/* 프로필 섹션 */}
      <ProfileSection 
        name={profile.name}
        title={profile.title}
        description={profile.description}
        image={profile.image}
      />

       {/* 링크 섹션 */}
       <LinksSection links={links} />

        {/* 이력서 다운로드 */}
         <ResumeDownload resumeUrl={resumeUrl} />

      {/* 기술 스택 섹션 */}
      <SkillsSection categories={skills.categories} />

      {/* 경력 사항 섹션 */}
      <ExperienceSection experiences={experience} />

    </div>
  );
}

// 개별 컴포넌트들도 export
export { ProfileSection, SkillsSection, ExperienceSection, LinksSection, ResumeDownload }; 