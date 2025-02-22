import React from 'react';
import { listTagsByLetters, type TagLetterEntry } from '@docusaurus/theme-common';
import Tag from '@theme/Tag';
import type { Props } from '@theme/TagsListByLetter';
import Heading from '@theme/Heading';

function TagLetterEntryItem({ letterEntry }: { letterEntry: TagLetterEntry }) {
    return (
        <article className="my-8 p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800">
            <Heading
                as="h4"
                id={letterEntry.letter}
                className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100 text-center"
            >
                {letterEntry.letter}
            </Heading>
            <ul className="flex flex-wrap justify-center gap-3 list-none">
                {letterEntry.tags.map((tag) => (
                    <li key={tag.permalink} className="flex-shrink-0">
                        {...tag}
                    </li>
                ))}
            </ul>
            <hr className="mt-6 border-gray-300 dark:border-gray-600" />
        </article>
    );
}

export default function TagsListByLetter({ tags }: Props) {
    const letterList = listTagsByLetters(tags);
    return (
        <section className="my-12 px-4">
            {letterList.map((letterEntry) => (
                <TagLetterEntryItem key={letterEntry.letter} letterEntry={letterEntry} />
            ))}
        </section>
    );
}
