// src/components/LazyImage.tsx
import React, { useState } from 'react';

type LazyImageProps = {
    src: string;
    alt?: string;
    className?: string;
    loaderSize?: number;
    onClick?: () => void;
};

const LazyImage: React.FC<LazyImageProps> = ({
                                                 src,
                                                 alt = '',
                                                 className = '',
                                                 loaderSize = 24,
                                                 onClick,
                                             }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`relative ${className}`}>
            {/* 로딩 중일 때 스피너 */}
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <div
                        className="animate-spin rounded-full border-2 border-gray-400 border-t-transparent"
                        style={{ width: loaderSize, height: loaderSize }}
                    />
                </div>
            )}

            {/* 실제 이미지 */}
            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                onClick={onClick} // ✅ 클릭 이벤트 적용됨!
                className={`transition-opacity duration-300 ease-in-out w-full h-auto ${
                    loaded ? 'opacity-100' : 'opacity-0'
                }`}
            />
        </div>
    );
};

export default LazyImage;
