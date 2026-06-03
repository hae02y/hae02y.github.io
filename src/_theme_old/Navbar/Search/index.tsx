import React from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/Navbar/Search';

export default function NavbarSearch({
  children,
  className,
}: Props) {
  return (
    <div className={clsx(className)}>
      {children}
    </div>
  );
}
