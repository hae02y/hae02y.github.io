/**
 * MIT License (c) Facebook, Inc. and its affiliates.
 * (LICENSE file in the project root)
 */

import React from 'react';
import Layout from '@theme/Layout';
import type {Props} from '@theme/BlogLayout';
import {Popover, PopoverButton, PopoverPanel, Transition} from "@headlessui/react";
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function BlogLayout(props: Props) {
    const {toc, children, ...layoutProps} = props;

    return (
        <>
            <Layout {...layoutProps}>
                {/* 상단 여백, 가운데 정렬, 좌우 패딩 */}
                <div
                    className="mx-auto min-w-full sm:min-w-[600px] md:min-w-[768px] lg:min-w-[1024px] xl:min-w-[1200px] mt-6 md:mt-10">
                    {/* 모바일에서는 flex-col, 데스크톱에서는 flex-row */}

                    {/* 메인 콘텐츠 영역 */}
                    <div
                        className={`mx-auto px-4 w-full`}
                    >
                        <div className="main-class">
                            <main
                                className={
                                    `mx-auto max-w-[750px] 2xl:max-w-[900px] px-4 w-full prose prose-lg`
                                }
                            >
                                {children}
                            </main>

                            {toc && (
                                <BrowserOnly>
                                    {() => (
                                        <div className="">
                                            <TocPopover toc={toc}/>
                                        </div>
                                    )}
                                </BrowserOnly>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
            <footer className={`h-[60px]`}></footer>
        </>
    );
}


const TocPopover = ({toc}: { toc: any }) => {

    return (
        <Popover className="relative block">
            {/* Popover 버튼 */}
            <PopoverButton className="fixed bottom-4 right-4">
                <div className="w-10 h-10 rounded-2xl relative hover:shadow-lg">
                    {/* 라이트모드 아이콘 */}
                    <img src="/img/index/black-index.svg" alt="index" className="w-full h-full block dark:hidden"/>
                    {/* 다크모드 아이콘 */}
                    <img src="/img/index/white-index.svg" alt="index-dark" className="w-full h-full hidden dark:block"/>
                </div>
            </PopoverButton>
            <PopoverPanel
                anchor="top"
                className="z-10 right-0 w-[240px] max-w-sm p-4 bg-white dark:bg-gray-900 whitespace-pre-line border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl text-sm
        opacity-0 scale-100 transition-opacity duration-200 ease-out
        data-[headlessui-state=open]:opacity-100"
            >
                <div className="text-left space-y-2">
                    {toc?.props?.toc
                        ?.filter((item) => item?.level <= 3)
                        .map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className="block text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
                            >
                                {item.value.replace(/<\/?[^>]+(>|$)/g, "")}
                            </a>
                        ))}
                </div>
            </PopoverPanel>
        </Popover>
    );
}

