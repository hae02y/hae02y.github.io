'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_ID = process.env.NEXT_PUBLIC_AUTH_ID || 'hae02y';
const AUTH_PASSWORD = process.env.NEXT_PUBLIC_AUTH_PW || 'qwe123,.';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === AUTH_PASSWORD) {
      sessionStorage.setItem('authToken', 'authenticated');
      router.push('/docs/intro');
    } else {
      setError('ID 또는 비밀번호가 잘못되었습니다.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-300 to-gray-500" style={{ marginTop: '-64px', paddingTop: '64px' }}>
      <div className="text-center">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white mx-auto shadow-lg">
          <img src="/img/sitelogo.png" alt="User Avatar" className="w-full h-full object-cover" />
        </div>
        <h2 className="mt-4 text-white text-2xl font-semibold">{AUTH_ID}</h2>
        <form onSubmit={handleLogin} className="mt-4">
          <input
            type="password"
            className="w-72 p-3 text-center text-gray-700 bg-white bg-opacity-50 rounded-full border-none focus:ring-2 focus:ring-white focus:outline-none placeholder-gray-400 transition-all"
            placeholder="암호 입력"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="hidden" />
        </form>
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
        <p className="mt-4 text-white text-sm opacity-80">
          <span className="font-semibold">Works</span>를 활성화하려면 사용자 암호가 필요합니다.
        </p>
        <p onClick={() => router.push('/')} className="cursor-pointer mt-4 text-white text-sm opacity-80">
          <span className="font-semibold">뒤로가기</span>
        </p>
      </div>
    </div>
  );
}
