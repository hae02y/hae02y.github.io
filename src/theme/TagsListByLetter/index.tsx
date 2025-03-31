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
        <div className="my-12 px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 flex flex-wrap justify-center gap-3">
                    {letterList.map((letterEntry) => (
                        <TabsTrigger
                            key={letterEntry.letter}
                            value={letterEntry.letter}
                            onMouseEnter={() => setActiveTab(letterEntry.letter)}
                            className={`px-4 py-2 border rounded-md text-sm font-medium focus:outline-none transition-colors
                              ${activeTab === letterEntry.letter ? 'bg-gray-200 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                            `}
                        >
                            {letterEntry.letter}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {letterList.map((letterEntry) => (
                    <TabsContent
                        key={letterEntry.letter}
                        value={letterEntry.letter}
                        className="p-4"
                    >
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
