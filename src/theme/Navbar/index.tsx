import React from 'react';
import {useLocation} from '@docusaurus/router';
import NavbarLayout from '@theme/Navbar/Layout';
import NavbarContent from '@theme/Navbar/Content';

export default function Navbar() {
  const {pathname} = useLocation();

  // Hide navbar on /me
  if (pathname === '/me') {
    return null;
  }

  return (
    <NavbarLayout>
      <NavbarContent />
    </NavbarLayout>
  );
}
