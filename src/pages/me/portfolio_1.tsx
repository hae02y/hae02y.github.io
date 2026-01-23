import React from 'react';
import PortfolioDetail from '@site/src/content/me/portfolio/portfolio_1.mdx';
import MeLayout from '@site/src/components/MeLayout';

export default function Portfolio1() {
  return (
    <MeLayout title="Portfolio 01">
      <PortfolioDetail />
    </MeLayout>
  );
}
