import React, { useState } from 'react';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from "@docusaurus/core/lib/client/exports/useDocusaurusContext";

export default function LoginPage() {
    const history = useHistory();
    const { siteConfig } = useDocusaurusContext(); // Docusaurus config 가져오기
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const AUTH_ID = siteConfig.customFields?.authid || 'default_id';
    const AUTH_PASSWORD = siteConfig.customFields?.authpw || 'default_password';

    const handleLogin = (e) => {
        e.preventDefault();

        console.log(id)
        console.log(password)
        console.log(AUTH_ID)
        console.log(AUTH_PASSWORD)

        if (id === AUTH_ID && password === AUTH_PASSWORD) {
            localStorage.setItem('authToken', 'authenticated');
            history.push('/docs/intro'); // 로그인 성공 시 이동할 페이지
        } else {
            setError('ID 또는 비밀번호가 잘못되었습니다.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center', padding: '50px' }}>
            <h2>로그인</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <button type="submit">로그인</button>
            </form>
        </div>
    );
}
