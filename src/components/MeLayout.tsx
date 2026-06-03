import React from 'react';

type MeLayoutProps = {
  title?: string;
  children: React.ReactNode;
};

export default function MeLayout({ children }: MeLayoutProps) {
  return (
    <div className="resume-page">
      <div className="resume-container">{children}</div>
    </div>
  );
}
