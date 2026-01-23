import React from 'react';
import {useLocation} from '@docusaurus/router';
import NavbarLayout from '@theme/Navbar/Layout';
import NavbarContent from '@theme/Navbar/Content';

export default function Navbar() {
  const {pathname} = useLocation();

  const hide = /^\/me(\/|$)/.test(pathname);

  if (hide) return null;

  return (
    <NavbarLayout>
      <NavbarContent />
    </NavbarLayout>
  );
}
