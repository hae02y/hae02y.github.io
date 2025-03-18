import React, { useEffect, useState } from 'react';
import { useHistory } from '@docusaurus/router';
import OriginalLayout from '@theme-original/Layout';

export default function LayoutWrapper(props) {
    const history = useHistory();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 로그인 검증이 필요한 페이지 설정 (`/docs` 경로에서만 인증 필요)
    const authRequired = history.location.pathname.startsWith('/docs');

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (token) {
            setIsAuthenticated(true);
        } else if (authRequired) {
            history.push('/login'); // 인증이 필요한데 로그인 안 되어 있으면 로그인 페이지로 이동
        }
    }, [history.location.pathname]);

    if (authRequired && !isAuthenticated) {
        return null; // 로그인되지 않은 경우 `/docs` 내용을 숨김
    }

    return (
        <div className="custom-layout">
            <OriginalLayout {...props} />
        </div>
    );
}
