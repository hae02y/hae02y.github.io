import React from 'react';

interface ProfileSectionProps {
  name: string;
  title: string;
  description: string;
  image: string;
}

export default function ProfileSection({ name, title, description, image }: ProfileSectionProps) {
  return (
    <div className="text-center mb-8">
      {/* 프로필 이미지 */}
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-lg">
          <img 
            src={image} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 이름과 직함 */}
      <div className="mb-6">
        <h1 className="text-3xl font-mono font-bold text-[var(--primary)] mb-2">
          {name}
        </h1>
        <p className="text-xl font-mono text-[var(--secondary)] font-semibold">
          {title}
        </p>
      </div>

      {/* 소개 */}
      <div className="text-center">
        <p className="text-[var(--secondary)] text-lg leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      </div>
    </div>
  );
} 