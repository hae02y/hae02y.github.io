'use client';

import { useEffect, useId, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const id = `mermaid-${useId().replace(/:/g, '')}`;
  const [svg, setSvg] = useState<string>();
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default',
        });
        const result = await mermaid.render(id, chart.trim());
        if (!cancelled) setSvg(result.svg);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    renderDiagram();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return <pre className="mermaid-error">이 다이어그램을 렌더링하지 못했습니다.{`\n\n`}{chart}</pre>;
  }

  return (
    <div
      className="mermaid-diagram"
      aria-label="Mermaid 다이어그램"
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}
