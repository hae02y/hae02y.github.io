import React, { useEffect, useState } from 'react';
import { useHistory } from '@docusaurus/router';
import OriginalLayout from '@theme-original/Layout';

export default function LayoutWrapper(props) {
    const history = useHistory();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isNavbarHidden, setIsNavbarHidden] = useState(false);

    const authRequired = history.location.pathname.startsWith('/docs');

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');

        if (token) {
            setIsAuthenticated(true);
        } else if (authRequired) {
            history.push('/login'); // 인증이 필요한데 로그인 안 되어 있으면 로그인 페이지로 이동
        }
    }, [history.location.pathname]);

    // 네비게이션 바 상태 감지
    useEffect(() => {
        const checkNavbarState = () => {
            const navbar = document.querySelector('.navbar--fixed-top');
            if (navbar) {
                const isHidden = navbar.classList.contains('navbar--hidden');
                setIsNavbarHidden(isHidden);
            }
        };

        // 초기 체크
        checkNavbarState();

        // 네비게이션 바 상태 변경 감지
        const observer = new MutationObserver(checkNavbarState);
        const navbar = document.querySelector('.navbar--fixed-top');
        if (navbar) {
            observer.observe(navbar, {
                attributes: true,
                attributeFilter: ['class']
            });
        }

        return () => observer.disconnect();
    }, []);

    if (authRequired && !isAuthenticated) {
        return null; // 로그인되지 않은 경우 `/docs` 내용을 숨김
    }

    return (
        <div className="custom-layout">
            <div className={`main-wrapper ${isNavbarHidden ? 'navbar-hidden' : ''}`}>
                <OriginalLayout {...props} />
            </div>
        </div>
    );
}
