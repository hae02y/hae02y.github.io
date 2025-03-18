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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-300 to-gray-500">
            <div className="text-center">
                {/* 프로필 이미지 */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white mx-auto shadow-lg">
                    <img src="/" alt="User Avatar" className="w-full h-full object-cover" />
                </div>

                {/* 사용자 이름 */}
                <h2 className="mt-4 text-white text-2xl font-semibold">훈이</h2>

                {/* 암호 입력 */}
                <form onSubmit={handleLogin} className="mt-4">
                    <input
                        type="password"
                        className="w-72 p-3 text-center text-gray-700 bg-white bg-opacity-50 rounded-full border-none focus:ring-2 focus:ring-white focus:outline-none placeholder-gray-200 transition-all"
                        placeholder="암호 입력"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="hidden"
                    />
                </form>

                {/* 에러 메시지 */}
                {error && <p className="mt-2 text-sm text-red-300">{error}</p>}

                {/* Touch ID 안내문 */}
                <p className="mt-4 text-white text-sm opacity-80">
                    <span className="font-semibold">Touch ID</span>를 활성화하려면 사용자 암호가 필요합니다.
                </p>
            </div>
        </div>
    );
}
