import {useState} from 'react';
import {Dialog, DialogContent} from '@/components/ui/dialog';
import {motion, useAnimation} from 'framer-motion';

const getRandomShift = () => Math.floor(Math.random() * 30 - 15);

export default function FloatingTags() {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const blogPluginData = useGlobalData();
    console.log(blogPluginData);
    // const blogData = globalData['docusaurus-plugin-content-docs'].default;
    // console.log(blogData);
    // const tags : BlogTags = blogData?.blogTags; // 태그 객체

    const myTags = [
        '#Java',
        '#SpringBoot',
        '#SpringSecurity',
        '#SpringMVC',
        '#SpringDataJPA',
        '#Hibernate', '#JPA',
        '#MyBatis',
        '#기술문서화',
        '#JWT인증',
        '#OAuth2',
        '#세션관리',
        '#CORS설정',
        '#상태코드관리',
        '#H2DB',
        '#MySQL',
        '#Redis',
        '#스케줄링',
        '#메일전송',
        '#FCM',
        '#Push알림',
        '#Thymeleaf',
        '#SSR',
        '#S3연동',
        '#로컬파일저장',
    ];

    const getTagContent = () => (
        <div>
            <h2 className="text-lg font-bold mb-2 text-black dark:text-white">
                {selectedTag}
            </h2>
            <p className="text-sm text-black dark:text-white">
                이 태그에 대한 설명을 여기에 작성할 수 있어요!
            </p>
        </div>
    );

    return (
        <>
            <Dialog open={selectedTag !== null} onOpenChange={() => setSelectedTag(null)}>
                <DialogContent className="max-w-xl p-4 bg-white dark:bg-black border border-black dark:border-white">
                    {getTagContent()}
                </DialogContent>
            </Dialog>

            {/* 상단 소개 영역 */}
            <div className="font-mono text-black dark:text-white text-sm leading-relaxed space-y-4 px-4">
                <div>
                    <p>―――</p>
                    <p className={`font-mono text-sm text--bold`}>
                        Backend developer who writes code that works,<br/>
                        documents what matters, and deploys with intent.<br/>
                        Obsessed with structure, clarity, and no-nonsense design.
                    </p>
                    <p>―――</p>
                    <div className={`flex gap-6`}>
                        <a href="/me" className="font-mono text-blue-600 underline">Resume</a>
                        <a href="/blog" className="font-mono text-blue-600 underline">Blog</a>
                        <a href="/insight" className="font-mono text-blue-600 underline">Insight</a>
                    </div>
                </div>
            </div>

            {/* 태그 영역 */}
            <div
                className="relative w-full min-h-[60vh] overflow-hidden flex flex-wrap justify-start items-start gap-2 px-4 py-8 font-mono">
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

                    const initialX = getRandomShift();
                    const initialY = getRandomShift();

                    return (
                        <motion.div
                            key={tag}
                            className={`
                px-2 py-1 text-xs font-bold
                text-black dark:text-white
                bg-white dark:bg-black
                border border-black dark:border-white
                hover:bg-black hover:text-white
                dark:hover:bg-white dark:hover:text-black
                cursor-pointer transition-all
              `}
                            initial={{x: initialX, y: initialY}}
                            animate={controls}
                            onMouseEnter={handleMouseEnter}
                            onClick={handleClick}
                            whileTap={{scale: 0.95}}
                        >
                            {tag}
                        </motion.div>
                    );
                })}
            </div>
        </>
    );
}
