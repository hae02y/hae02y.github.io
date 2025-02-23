import React from 'react';
import { listTagsByLetters, type TagLetterEntry } from '@docusaurus/theme-common';
import type { Props } from '@theme/TagsListByLetter';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // shadcn UI Tabs 컴포넌트
import Heading from '@theme/Heading';

type CustomTagProps = {
    label: string;
    permalink: string;
};

// 기존 <Tag>를 대체할 CustomTag 컴포넌트
const CustomTag: React.FC<CustomTagProps> = ({ label, permalink }) => {
    return (
        <a
            href={permalink}
            className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium transition-colors hover:bg-blue-200 dark:hover:bg-blue-800"
        >
            {label}
        </a>
    );
};

export default function TagsListByLetter({ tags }: Props) {
    const letterList = listTagsByLetters(tags);

    return (
        <div className="my-12 px-4">
            <Tabs defaultValue={letterList[0]?.letter || 'all'}>
                {/* 탭 리스트: 각 탭이 알파벳 그룹을 나타냄 */}
                <TabsList className="mb-4 flex flex-wrap justify-center gap-3">
                    {letterList.map((letterEntry) => (
                        <TabsTrigger
                            key={letterEntry.letter}
                            value={letterEntry.letter}
                            className="px-4 py-2 border rounded-md text-sm font-medium focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {letterEntry.letter}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {/* 각 탭 패널: 선택한 알파벳 그룹의 태그들을 보여줌 */}
                {letterList.map((letterEntry) => (
                    <TabsContent
                        key={letterEntry.letter}
                        value={letterEntry.letter}
                        className="p-4"
                    >
                        <Heading
                            as="h4"
                            id={letterEntry.letter}
                            className="mb-4 text-2xl font-bold text-center text-gray-900 dark:text-gray-100"
                        >
                            {letterEntry.letter} 그룹
                        </Heading>
                        <div className="flex flex-wrap justify-center gap-3">
                            {letterEntry.tags.map((tag) => (
                                <CustomTag
                                    key={tag.permalink}
                                    label={tag.label}
                                    permalink={tag.permalink}
                                />
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
