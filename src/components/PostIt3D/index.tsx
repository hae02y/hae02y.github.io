import React, { useRef, useEffect, useState, useCallback } from 'react';

interface PostIt3DProps {
  onClick: () => void;
}

export default function PostIt3D({ onClick }: PostIt3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia('(hover: none)').matches);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setTilt({ x: -y * 12, y: x * 12 });
    },
    [isMobile],
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHover(false);
  }, []);

  return (
    <div
      style={{
        perspective: '800px',
        width: 'fit-content',
      }}
    >
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          width: 340,
          minHeight: 260,
          background: 'linear-gradient(165deg, #f7e87d 0%, #f0d94e 40%, #e8cf3a 100%)',
          borderRadius: '2px 2px 2px 24px',
          padding: '44px 32px 32px',
          cursor: 'pointer',
          fontFamily: "'Architects Daughter', cursive",
          color: '#2a2a2a',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHover ? 'translateZ(12px) scale(1.02)' : ''}`,
          transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
          transformStyle: 'preserve-3d',
          boxShadow: isHover
            ? `${tilt.y * 0.8}px ${8 + tilt.x * 0.5}px 28px rgba(0,0,0,0.22),
               ${tilt.y * 0.3}px ${3 + tilt.x * 0.2}px 8px rgba(0,0,0,0.12)`
            : '2px 4px 16px rgba(0,0,0,0.15), 1px 2px 4px rgba(0,0,0,0.08)',
          userSelect: 'none',
        }}
      >
        {/* Tape */}
        <div
          style={{
            position: 'absolute',
            top: -8,
            left: 28,
            width: 80,
            height: 22,
            background: 'linear-gradient(180deg, rgba(220,220,220,0.8) 0%, rgba(200,200,200,0.6) 100%)',
            borderRadius: 2,
            transform: 'rotate(-3deg)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            zIndex: 2,
          }}
        />

        {/* Sticky strip (top adhesive area) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 36,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, transparent 100%)',
            borderRadius: '2px 2px 0 0',
          }}
        />

        {/* Faint lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 24,
              right: 24,
              top: 80 + i * 38,
              height: 1,
              background: 'rgba(180, 160, 60, 0.15)',
            }}
          />
        ))}

        {/* Title */}
        <p
          style={{
            fontSize: 28,
            fontWeight: 700,
            margin: '0 0 4px',
            lineHeight: 1.2,
            transform: 'rotate(-1deg)',
            letterSpacing: '0.5px',
          }}
        >
          hi, i'm hae02y
        </p>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 20,
            margin: '0 0 20px',
            color: '#4a4a3a',
            transform: 'rotate(0.5deg)',
            letterSpacing: '0.3px',
          }}
        >
          backend developer.
        </p>

        {/* Body */}
        <p
          style={{
            fontSize: 17,
            margin: '0 0 24px',
            color: '#3a3a30',
            lineHeight: 1.7,
            transform: 'rotate(-0.3deg)',
          }}
        >
          how are you?
          <br />
          thank you for visiting here :)
        </p>

        {/* Click hint */}
        <p
          style={{
            fontSize: 14,
            margin: 0,
            color: '#8a8a60',
            fontStyle: 'italic',
            transform: 'rotate(0.8deg)',
          }}
        >
          {'> click to open terminal'}
        </p>

        {/* Corner curl effect */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 40,
            height: 40,
            background: 'linear-gradient(315deg, transparent 50%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.02) 100%)',
            borderRadius: '0 0 0 24px',
          }}
        />
      </div>
    </div>
  );
}
