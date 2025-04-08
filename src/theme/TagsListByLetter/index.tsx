import React, {useState} from 'react';
import { listTagsByLetters, type TagLetterEntry } from '@docusaurus/theme-common';
import type { Props } from '@theme/TagsListByLetter';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@site/src/components/ui/tabs'; // shadcn UI Tabs 컴포넌트
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
            className="px-3 py-1 rounded-full text-sm font-medium
                 bg-gray-100 text-gray-800
                 dark:bg-gray-800 dark:text-gray-200
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 transition-colors"
        >
            {label}
        </a>
    );
};


export default function TagsListByLetter({ tags }: Props) {
    const letterList = listTagsByLetters(tags);
    const [activeTab, setActiveTab] = useState(letterList[0]?.letter || 'ALL');

    return (
        <div className="my-12 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-6">
                {/* 왼쪽 문자 목록 */}
                <div className="sm:w-32 flex sm:flex-col flex-wrap justify-center gap-2 sm:gap-3">
                    {letterList.map((letterEntry) => (
                        <button
                            key={letterEntry.letter}
                            onClick={() => setActiveTab(letterEntry.letter)}
                            className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors 
                                ${
                                activeTab === letterEntry.letter
                                    ? 'bg-gray-200 dark:bg-gray-800'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }
                            `}
                        >
                            {letterEntry.letter}
                        </button>
                    ))}
                </div>

                {/* 오른쪽 태그 리스트 */}
                <div className="flex-1">
                    {letterList.map((letterEntry) =>
                        letterEntry.letter === activeTab ? (
                            <div key={letterEntry.letter} className="flex flex-wrap gap-2 sm:gap-3">
                                {letterEntry.tags.map((tag) => (
                                    <CustomTag
                                        key={tag.permalink}
                                        label={tag.label}
                                        permalink={tag.permalink}
                                    />
                                ))}
                            </div>
                        ) : null
                    )}
                </div>
            </div>
        </div>
    );
}


