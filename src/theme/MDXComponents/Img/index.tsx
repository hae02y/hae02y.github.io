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
            {/* 이미지 박스 */}
            <div className="grid place-items-center w-full">
                <div className="relative w-full aspect-video justify-items-center items-center overflow-hidden border border-gray-300 bg-gray-100 shadow-sm rounded-lg">
                    <LazyImage
                        decoding="async"
                        loading="lazy"
                        {...props}
                        className={transformImgClassName(props.className)}
                        onClick={togglePopup}
                        alt={props.alt ?? 'image'}
                    />
                </div>
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
                        onClick={(e) => e.stopPropagation()} // 클릭 막기
                        className="max-w-[90%] max-h-[90%] rounded shadow-lg"
                    />
                </div>
            )}
        </>
    );
}
