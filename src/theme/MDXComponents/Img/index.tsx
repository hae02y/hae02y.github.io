import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import type { Props } from '@theme/MDXComponents/Img';
import styles from './styles.module.css';

function transformImgClassName(className?: string): string {
    return clsx(className, styles.img, 'cursor-pointer object-cover w-full');
}

export default function MDXImg(props: Props): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);

    // 모달 열릴 때 body 스크롤 막기
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    const togglePopup = () => setIsOpen(prev => !prev);

    return (
        <>
            {/* 썸네일: 정사각형 네모에 꽉차게 보여야 함 */}
            <figure className="w-full">
                <div
                    className="relative w-full sm:w-[75%] md:w-[50%] mx-auto aspect-square overflow-hidden border border-gray-300 bg-gray-100 shadow-lg rounded-lg">
                    <img
                        decoding="async"
                        {...props}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={togglePopup}
                        alt={props.alt ?? 'image'}
                    />
                </div>
                {props.alt && (
                    <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                        {props.alt}
                    </figcaption>
                )}
            </figure>


            {/* 팝업 */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80"
                >
                    {/* X 버튼 */}
                    <button
                        onClick={togglePopup}
                        className="absolute top-6 right-6 text-white text-2xl font-bold hover:text-gray-300 transition"
                        aria-label="Close image popup"
                    >
                        &times;
                    </button>

                    {/* 확대된 이미지 */}
                    <div className="max-w-[90vw] max-h-[90vh]">
                        <img
                            src={props.src}
                            alt={props.alt}
                            className="max-w-[90%] max-h-[90%] object-contain rounded shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
