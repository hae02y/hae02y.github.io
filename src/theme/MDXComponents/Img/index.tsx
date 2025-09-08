// src/theme/MDXComponents/Img/index.tsx
import React, { useState } from 'react';
import clsx from 'clsx';
import type { Props } from '@theme/MDXComponents/Img';
import styles from './styles.module.css';
import LazyImage from '@site/src/components/LazyImage'; // ✅ LazyImage 사용

function transformImgClassName(className?: string): string {
    return clsx(className, styles.img, 'cursor-pointer object-cover w-full');
}

export default function MDXImg(props: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => setIsOpen((prev) => !prev);

    return (
        <>
            {/* 이미지 */}
            <div className={`mb-5`}>
                <LazyImage
                    decoding="async"
                    loading="lazy"
                    {...props}
                    className={transformImgClassName(props.className)} // ✅ mx-auto
                    onClick={togglePopup}
                    alt={props.alt}
                />
                <p className={'text-center text-gray-400 font-free text-sm mt-1'}>{props.alt}</p>
            </div>

            {/* 팝업 확대 */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-75"
                    onClick={togglePopup}
                >
                    <img
                        src={props.src}
                        alt={props.alt}
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-[90%] max-h-[90%] rounded shadow-lg"
                    />
                </div>
            )}
        </>
    );
}
