import { motion } from 'framer-motion';

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
            {myTags.map((tag, index) => (
                <motion.div
                    key={tag}
                    className="px-4 py-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl cursor-default text-sm font-medium"
                    animate={{
                        y: [0, -10, 0],
                        x: [0, index % 2 === 0 ? 10 : -10, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {tag}
                </motion.div>
            ))}
        </div>
    );
}
