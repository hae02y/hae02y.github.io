import React, { useState, useEffect } from 'react';

const DynamicTyper = () => {
    const texts = ['열심히하는 개발자', '#게임중!', '#코딩중', '#빌드중']; // 교체될 텍스트
    const [currentText, setCurrentText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);
    const [speed, setSpeed] = useState(150); // 기본 타이핑 속도

    useEffect(() => {
        const handleTyping = () => {
            const fullText = texts[textIndex];

            if (deleting) {
                // 글자 삭제 중
                setCurrentText((prev) => fullText.substring(0, prev.length - 1));
                setSpeed(100); // 삭제 속도
            } else {
                // 글자 입력 중
                setCurrentText((prev) => fullText.substring(0, prev.length + 1));
                setSpeed(150); // 입력 속도
            }

            // 텍스트 입력 완료
            if (!deleting && currentText === fullText) {
                setSpeed(1000); // 텍스트 유지 시간
                setTimeout(() => setDeleting(true), 1000);
            }

            // 텍스트 삭제 완료
            if (deleting && currentText === '') {
                setDeleting(false);
                setTextIndex((prev) => (prev + 1) % texts.length); // 다음 텍스트
            }
        };

        const typingTimeout = setTimeout(handleTyping, speed);
        return () => clearTimeout(typingTimeout);
    }, [currentText, deleting, textIndex, speed, texts]);

    return (
        <div className="typer-container">
            <div className="text">{currentText}</div>
            <div className="hi"></div>
        </div>
    );
};

export default DynamicTyper;
