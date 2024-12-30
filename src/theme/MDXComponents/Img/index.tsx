import React, { useState } from 'react';
import clsx from 'clsx';
import type { Props } from '@theme/MDXComponents/Img';
import styles from './styles.module.css';

function transformImgClassName(className?: string): string {
  return clsx(className, styles.img, 'cursor-pointer');
}

export default function MDXImg(props: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => setIsOpen((prev) => !prev);

  return (
      <>
        {/* 이미지 자체 */}
        <img
            decoding="async"
            loading="lazy"
            {...props}
            className={transformImgClassName(props.className)}
            onClick={togglePopup} // 클릭 이벤트 추가
         alt={'image'}/>

        {/* 팝업 */}
        {isOpen && (
            <div
                className="fixed tooltip inset-0 z-70 flex items-center justify-center bg-black bg-opacity-75"
                onClick={togglePopup} // 팝업 클릭 시 닫기
            >
              <img
                  src={props.src}
                  alt={props.alt}
                  className="max-w-[90%] max-h-[90%] rounded shadow-lg"
              />
            </div>
        )}
      </>
  );
}
