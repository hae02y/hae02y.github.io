import React from 'react';

interface Experience {
  company: string;
  position: string;
  period: string;
  description?: string;
  responsibilities: Array<{
    title: string;
    technologies: string[];
    details: string[];
  }>;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-[var(--primary)] uppercase mb-6">
        #Career
      </h2>
      
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="space-y-4">
            {/* 회사명, 직급, 기간 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-xl font-bold text-[var(--primary)]">
                  {exp.company}
                </div>
                <span className="text-[var(--primary)]">
                  {exp.position}
                </span>
                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                  {exp.period}
                </span>
              </div>
            </div>

            {/* 회사 설명 (있는 경우) */}
            {exp.description && (
              <p className="text-[var(--secondary)]">
                {exp.description}
              </p>
            )}

            {/* 업무 세부사항 */}
            <div className="space-y-4">
              {exp.responsibilities.map((resp, respIndex) => (
                <div key={respIndex} className="space-y-2">
                  {/* 업무 제목과 기술 */}
                  <div className="flex items-start space-x-2">
                    <div className="flex-1">
                      <div className="text-[var(--primary)] font-semibold inline">
                        {resp.title}
                      </div>
                    </div>
                  </div>

                  {/* 세부 업무 내용 */}
                  <div className="ml-6 space-y-1">
                    {resp.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start space-x-2">
                        <span className="text-[var(--secondary)] mt-1 text-xs">•</span>
                        <p className="text-[var(--secondary)] leading-relaxed">
                          {detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 