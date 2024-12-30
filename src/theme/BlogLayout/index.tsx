/**
 * MIT License (c) Facebook, Inc. and its affiliates.
 * (LICENSE file in the project root)
 */

import React, {useState, Fragment, useEffect} from 'react';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';
import type {Props} from '@theme/BlogLayout';
import {Popover, Transition} from "@headlessui/react";

export default function BlogLayout(props: Props): JSX.Element {
    const {toc, children, ...layoutProps} = props;
    const [showToc, setShowToc] = useState(typeof toc !== null ? toc : undefined);

    return (
        <Layout {...layoutProps}>
            {/* 상단 여백, 가운데 정렬, 좌우 패딩 */}
            <div className="mx-auto min-w-full sm:min-w-[600px] md:min-w-[768px] lg:min-w-[1024px] xl:min-w-[1200px] mt-6 md:mt-10">
                {/* 모바일에서는 flex-col, 데스크톱에서는 flex-row */}

                    {/* 메인 콘텐츠 영역 */}
                <div
                    className={`mx-auto px-4 w-full`}
                >
                    <div className="flex flex-col lg:flex-row gap-8">
                        <main
                            className={
                                `mx-auto max-w-[800px] px-4 ${showToc ? 'xl:w-9/12' : 'lg:w-full'} prose prose-lg`
                            }
                        >
                            {children}
                        </main>

                        {/* TOC(목차) - 데스크톱에서만 보이도록 */}
                        {toc && (
                            <div className="block xl:hidden">
                                <TocPopover toc={toc} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function TocPopover({toc}: { toc: React.ReactNode }) {
    return (
        <Popover className="relative inline-block">
            {/* Popover 버튼 */}
            <Popover.Button
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow
                   hover:bg-blue-600 transition-colors"
            >
                TOC 열기
            </Popover.Button>

            {/* Popover.Panel (Transition으로 애니메이션) */}
            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <Popover.Panel
                    className="absolute z-10 mt-2 w-[200px] p-4 bg-white border border-gray-200
                     rounded shadow-md"
                >
                    {/* 실제 TOC 내용 */}
                    {toc}
                </Popover.Panel>
            </Transition>
        </Popover>
    );
}
