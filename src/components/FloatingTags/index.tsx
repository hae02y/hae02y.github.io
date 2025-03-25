import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

const getRandomOffset = () => Math.floor(Math.random() * 200 - 100); // -100 ~ +100

export default function FloatingTags() {
    const myTags = [
        '#정해영',
        '#SpringBoot',
        '#React',
        '#Swagger장인',
        '#API디자인',
        '#JWT인증',
        '#기술문서화',
        '#풀스택개발자',
    ];

    return (
        <div className="relative w-full h-full overflow-hidden flex flex-wrap justify-center items-center gap-4">
            {myTags.map((tag, index) => {
                const controls = useAnimation();

                const handleMouseEnter = () => {
                    controls.start({
                        x: getRandomOffset(),
                        y: getRandomOffset(),
                        transition: { type: 'spring', stiffness: 100, damping: 10 },
                    });
                };

                return (
                    <motion.div
                        key={tag}
                        className="px-4 py-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl cursor-pointer text-sm font-medium"
                        animate={controls}
                        onMouseEnter={handleMouseEnter}
                    >
                        {tag}
                    </motion.div>
                );
            })}
        </div>
    );
}
