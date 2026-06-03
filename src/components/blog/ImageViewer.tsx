'use client';

import { useState, useCallback, useEffect } from 'react';

interface ImageViewerProps {
  src: string;
  alt: string;
}

export default function ImageViewer({ src, alt }: ImageViewerProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, handleClose]);

  return (
    <>
      {/* Inline image */}
      <figure className="brunch-figure">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onClick={handleOpen}
          className="brunch-img"
        />
        {alt && alt !== '' && !alt.startsWith('image') && (
          <figcaption className="brunch-figcaption">{alt}</figcaption>
        )}
      </figure>

      {/* Lightbox */}
      {open && (
        <div className="lightbox-overlay" onClick={handleClose}>
          <button className="lightbox-close" onClick={handleClose}>✕</button>
          <img
            src={src}
            alt={alt}
            className="lightbox-img"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
