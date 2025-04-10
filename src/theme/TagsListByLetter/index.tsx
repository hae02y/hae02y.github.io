import React, {useState} from 'react';
import { listTagsByLetters, type TagLetterEntry } from '@docusaurus/theme-common';
import type { Props } from '@theme/TagsListByLetter';


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
    const activeEntry = letterList.find((entry) => entry.letter === activeTab);

    return (
        <div className="my-12 px-4">
            <div className="max-w-screen-lg mx-auto max-h-[70%] flex border border-gray-200 dark:border-gray-800 rounded-lg shadow overflow-hidden bg-white dark:bg-gray-900">

                {/* 왼쪽: 문자 목록 */}
                <div className="w-24 sm:w-32 overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-2">
                    <div className="flex flex-col gap-2">
                        {letterList.map((letterEntry) => (
                            <button
                                key={letterEntry.letter}
                                onClick={() => setActiveTab(letterEntry.letter)}
                                className={`px-3 py-2 rounded-md text-sm font-medium text-center transition-colors
                                    ${
                                    activeTab === letterEntry.letter
                                        ? 'bg-gray-200 dark:bg-gray-900 font-semibold'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                }
                                `}
                            >
                                {letterEntry.letter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 오른쪽: 태그 리스트 */}
                <div className="flex-1 overflow-y-auto p-4">
                    {activeEntry ? (
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {activeEntry.tags.map((tag) => (
                                <CustomTag
                                    key={tag.permalink}
                                    label={tag.label}
                                    permalink={tag.permalink}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">태그가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}


