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
        <div className={`relative w-full h-full ${className}`}>
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md">
                    <div
                        className="animate-spin rounded-full border-2 border-gray-400 border-t-transparent"
                    />
                </div>
            )}
            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                onClick={onClick}
                className={`transition-opacity duration-300 ease-in-out w-full h-full object-cover rounded-md ${
                    loaded ? 'opacity-100' : 'opacity-0'
                }`}
            />
        </div>
    );
};

export default LazyImage;
