'use client';

import React from 'react';
import MeLayout from '@/components/MeLayout';

type PortfolioDetailPageProps = {
  title?: string;
  content?: React.ReactNode;
};

export default function PortfolioDetailPage({ title, content }: PortfolioDetailPageProps) {
  return (
    <MeLayout title={title}>
      <div className="portfolio-detail">
        {content}
      </div>
    </MeLayout>
  );
}
