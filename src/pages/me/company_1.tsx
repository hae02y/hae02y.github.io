import React from 'react';
import CompanyDetail from '@site/src/content/me/portfolio/company_1.mdx';
import MeLayout from '@site/src/components/MeLayout';

export default function Company1() {
  return (
    <MeLayout title="Company Portfolio 01">
      <CompanyDetail />
    </MeLayout>
  );
}
