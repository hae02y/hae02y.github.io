import React from 'react';

interface SkillCategory {
  name: string;
  skills: string[];
}

interface SkillsSectionProps {
  categories: SkillCategory[];
}

export default function SkillsSection({ categories }: SkillsSectionProps) {
  return (
    <div className="mb-8">
      <div className="text-xl uppercase font-bold text-[var(--primary)] mb-3">
        #Skills
      </div>
      
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.name} className="space-y-2">
            <div className="font-medium text-[var(--secondary)]">
              {category.name}
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span 
                  key={skill}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 