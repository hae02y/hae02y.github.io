'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Auth-protected docs pages
export default function DocsPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      setAuthed(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!authed) return null;

  return (
    <div className="mx-auto px-4 mt-6 md:mt-10 max-w-3xl">
      <p className="text-[var(--secondary)]">Docs content will be rendered here.</p>
    </div>
  );
}
