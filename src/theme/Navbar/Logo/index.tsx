import React from 'react';
import {Router} from "lucide-react";

export default function NavbarLogo(){
  return (
      <a className="btn hidden md:block" href={'/'}>
        {/* 라이트 모드용 로고 */}
        <img
            src="/img/logo/Hae02y-dark.svg"
            alt="Logo Light"
            className="hidden dark:block h-[20px]"
        />

        {/* 다크 모드용 로고 */}
        <img
            src="/img/logo/Hae02y-white.svg"
            alt="Logo Dark"
            className="block dark:hidden h-[20px]"
        />
      </a>
  );
}
