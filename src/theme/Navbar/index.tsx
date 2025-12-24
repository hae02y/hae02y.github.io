import React from 'react';
import {useLocation} from '@docusaurus/router';
import NavbarLayout from '@theme/Navbar/Layout';
import NavbarContent from '@theme/Navbar/Content';

export default function Navbar() {
  const {pathname} = useLocation();

  // 안전하게: /me, /me/, .../me, .../me/ 전부 커버
  const hide = pathname === '/me' || pathname === '/me/' || pathname.endsWith('/me') || pathname.endsWith('/me/');

  if (hide) return null;

  return (
    <NavbarLayout>
      <NavbarContent />
    </NavbarLayout>
  );
}