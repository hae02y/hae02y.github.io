import React, { useEffect, useState } from 'react';
import { useHistory } from '@docusaurus/router';
import OriginalLayout from '@theme-original/Layout';

export default function LayoutWrapper(props) {
    const history = useHistory();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const authRequired = history.location.pathname.startsWith('/docs');
    const authRequired2 = history.location.pathname.startsWith('/me');

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');

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
