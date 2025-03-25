import { useState } from 'react';
import { Dialog, DialogContent } from '@site/src/components/ui/dialog';
import { motion, useAnimation } from 'framer-motion';
import {OrbitControls} from "@react-three/drei";
import { Canvas } from '@react-three/fiber';
import MovingCamel from '@site/src/components/MovingCamel';

const getRandomOffset = () => Math.floor(Math.random() * 200 - 100);

export default function FloatingTags() {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const myTags = [
        '#낙타',
        '#SpringBoot',
        '#React',
        '#Swagger장인',
        '#API디자인',
        '#JWT인증',
        '#기술문서화',
        '#풀스택개발자',
    ];

    const getTagContent = () => {
        if (selectedTag === '#낙타') {
            return (
                <div className="w-full h-[400px]">
                   
                </div>
            );
        }

        return (
            <div>
                <h2 className="text-lg font-bold mb-2">{selectedTag}</h2>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                    이 태그에 대한 설명을 여기에 작성할 수 있어요!
                </p>
            </div>
        );
    };

    return (
        <>
            <Dialog open={selectedTag !== null} onOpenChange={() => setSelectedTag(null)}>
                <DialogContent className="max-w-xl p-4">
                    {getTagContent()}
                </DialogContent>
            </Dialog>

            <div className="relative w-full h-full overflow-hidden flex flex-wrap justify-center items-center gap-4">
                {myTags.map((tag) => {
                    const controls = useAnimation();

                    const handleMouseEnter = () => {
                        controls.start({
                            x: getRandomOffset(),
                            y: getRandomOffset(),
                            transition: { type: 'spring', stiffness: 100, damping: 10 },
                        });
                    };

                    const handleClick = () => {
                        setSelectedTag(tag);
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
        </>
    );
}
