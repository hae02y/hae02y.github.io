'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Highlight, themes } from 'prism-react-renderer';

function rewriteImageSrc(src: string | undefined, dirName?: string): string {
  if (!src) return '';
  if (src.startsWith('http') || src.startsWith('/')) return src;
  if (dirName) return `/blog/${dirName}/${src}`;
  return src;
}

const COLLAPSE_THRESHOLD = 5;

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const language = className?.replace('language-', '') || 'text';
  const code = String(children).replace(/\n$/, '');
  const lines = code.split('\n');
  const isLong = lines.length > COLLAPSE_THRESHOLD;
  const [expanded, setExpanded] = useState(!isLong);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      {/* Header */}
      <div className="code-block-header">
        <span className="code-block-lang">{language}</span>
        <button onClick={handleCopy} className="code-block-copy">
          {copied ? '복사됨' : '복사'}
        </button>
      </div>

      {/* Code */}
      <div className={`code-block-body ${!expanded ? 'code-collapsed' : ''}`}>
        <Highlight theme={themes.oneDark} code={code} language={language as any}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre style={{ ...style, margin: 0, padding: '1rem 1.2rem', background: 'transparent', fontSize: '13.5px', lineHeight: 1.65, overflowX: 'auto' }}>
              <code>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    <span className="code-line-number">{i + 1}</span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          )}
        </Highlight>
      </div>

      {/* Expand/Collapse */}
      {isLong && (
        <button onClick={() => setExpanded(!expanded)} className="code-block-toggle">
          {expanded ? `접기 ▲` : `펼치기 (${lines.length}줄) ▼`}
        </button>
      )}
    </div>
  );
}

export function renderMarkdown(content: string, dirName?: string) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        img: ({ src, alt, ...props }) => (
          <img
            src={rewriteImageSrc(src, dirName)}
            alt={alt || ''}
            loading="lazy"
            {...props}
          />
        ),
        code: ({ children, className, ...props }) => {
          const isBlock = className?.startsWith('language-');
          if (isBlock) {
            return <CodeBlock className={className}>{String(children)}</CodeBlock>;
          }
          return <code className="inline-code" {...props}>{children}</code>;
        },
        pre: ({ children }) => <>{children}</>,
        blockquote: ({ children }) => (
          <blockquote className="brunch-blockquote">{children}</blockquote>
        ),
        a: ({ href, children }) => (
          <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
