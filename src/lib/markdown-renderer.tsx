import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function rewriteImageSrc(src: string | undefined, dirName?: string): string {
  if (!src) return '';
  // Already absolute URL or starts with /
  if (src.startsWith('http') || src.startsWith('/')) return src;
  // Relative path — rewrite to /blog/{dirName}/filename
  if (dirName) return `/blog/${dirName}/${src}`;
  return src;
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
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
