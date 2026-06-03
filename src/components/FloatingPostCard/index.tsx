import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FloatingPostCard({ title, permalink, date }: {
    title: string;
    permalink: string;
    date: string;
}) {
    return (
        <motion.div
            className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10"
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 3,
                ease: "easeInOut"
            }}
        >
            <Link href={permalink} className="block text-white hover:text-blue-400 transition">
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-gray-300">{date}</p>
            </Link>
        </motion.div>
    );
}
