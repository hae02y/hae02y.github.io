import { motion, useAnimation } from 'framer-motion';

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
            {myTags.map((tag) => {
                const controls = useAnimation();

                const handleMouseEnter = () => {
                    controls.start({
                        x: getRandomOffset(),
                        y: getRandomOffset(),
                        transition: { type: 'spring', stiffness: 30, damping: 5 },
                    });
                };

                const handleClick = () => {
                    console.log(`🧠 태그 클릭됨: ${tag}`);
                    alert(`이 태그는 "${tag}" 입니다.`);
                };

                return (
                    <motion.div
                        key={tag}
                        className="px-4 py-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl cursor-pointer text-sm font-medium select-none"
                        animate={controls}
                        onMouseEnter={handleMouseEnter}
                        onClick={handleClick}
                        whileTap={{ scale: 0.95 }}
                    >
                        {tag}
                    </motion.div>
                );
            })}
        </div>
    );
}
