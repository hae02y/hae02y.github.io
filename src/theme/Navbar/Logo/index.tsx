import React, {useState, useEffect} from 'react';
import {Router} from "lucide-react";

export default function NavbarLogo(){
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(theme === 'dark');
    };

    // 초기 체크
    checkTheme();

    // 테마 변경 감지
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  const logoSrc = isDarkMode 
    ? '/img/logo/darkmode.png' 
    : '/img/logo/whitemode.png';

  return (
      <a className="btn flex items-center" href={'/'}>
        <img 
          src={logoSrc} 
          alt="Logo" 
          className="h-20 w-auto object-contain"
        />
      </a>
  );
}
