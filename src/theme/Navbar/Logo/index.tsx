import React, {useEffect, useState} from 'react';

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
      <a
        className="inline-flex items-center border-2 border-black dark:border-white bg-white dark:bg-black brutal-shadow px-3 py-2 transition-transform hover:-translate-y-0.5"
        href={'/'}
      >
        <img
          src={logoSrc}
          alt="Logo"
          className="h-8 w-auto object-contain"
        />
      </a>
  );
}
