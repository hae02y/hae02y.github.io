import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import { useAllTags } from '@docusaurus/plugin-content-blog/client';

export function FloatingTags() {
    const allTags = useAllTags();
    const tags = Object.values(allTags).slice(0, 10); // 상위 10개만 예시

    return (
        <div className="relative w-full h-full overflow-hidden flex flex-wrap justify-center items-center gap-4">
            {tags.map(({ label, permalink }, index) => (
                <motion.div
                    key={label}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white shadow-lg cursor-pointer text-sm"
                    animate={{
                        y: [0, -10, 0],
                        x: [0, index % 2 === 0 ? 10 : -10, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2, // 각 태그마다 다른 속도
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Link to={permalink}>{label}</Link>
                </motion.div>
            ))}
        </div>
    );
}
