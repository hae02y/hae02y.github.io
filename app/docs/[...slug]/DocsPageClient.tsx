'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DocContent from '@/components/docs/DocContent';

interface DocsPageClientProps {
  page: { title: string; content: string } | null;
}

export default function DocsPageClient({ page }: DocsPageClientProps) {
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

  if (!authed || !page) return null;

  return (
    <div className="mx-auto px-4 mt-6 md:mt-10 max-w-3xl">
      <DocContent page={{ slug: [], title: page.title, content: page.content }} />
    </div>
  );
}
