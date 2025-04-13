import { useState } from 'react';
import { Dialog, DialogContent } from '@site/src/components/ui/dialog';
import { motion, useAnimation } from 'framer-motion';

// 랜덤 offset 함수
const getRandomShift = () => Math.floor(Math.random() * 30 - 15); // -15 ~ +15px

export default function FloatingTags() {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const myTags = [
        '#Java', '#SpringBoot', '#SpringSecurity', '#SpringMVC', '#SpringDataJPA',
        '#Hibernate', '#JPA', '#MyBatis', '#기술문서화', '#JWT인증',
        '#OAuth2', '#세션관리', '#CORS설정', '#상태코드관리', '#H2DB',
        '#MySQL', '#Redis', '#스케줄링', '#메일전송', '#FCM',
        '#Push알림', '#Thymeleaf', '#SSR', '#S3연동', '#로컬파일저장',
    ];

    const getTagContent = () => {
        return (
            <div>
                <h2 className="text-lg font-bold mb-2">{selectedTag}</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">
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

            <div className="relative w-full min-h-[60vh] overflow-hidden flex flex-wrap justify-start items-start gap-2 px-4 py-8">
                {myTags.map((tag) => {
                    const controls = useAnimation();

                    const handleMouseEnter = () => {
                        controls.start({
                            x: getRandomShift(),
                            y: getRandomShift(),
                            transition: {
                                type: 'spring',
                                duration: 0.2,
                            },
                        });
                    };

                    const handleClick = () => setSelectedTag(tag);

                    // 태그 생성 시 바로 흩어진 위치로 초기화
                    const initialX = getRandomShift();
                    const initialY = getRandomShift();

                    return (
                        <motion.div
                            key={tag}
                            className="relative px-3 py-1.5 rounded-xl bg-white/80 dark:bg-[#333] text-sm text-black dark:text-white shadow-md dark:shadow-lg border border-gray-300 dark:border-gray-600 hover:shadow-xl transition-all cursor-pointer"
                            initial={{ x: initialX, y: initialY }}
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
