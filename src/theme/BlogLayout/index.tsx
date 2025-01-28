/**
 * MIT License (c) Facebook, Inc. and its affiliates.
 * (LICENSE file in the project root)
 */

import React, {useState, Fragment, useEffect} from 'react';
import Layout from '@theme/Layout';
import type {Props} from '@theme/BlogLayout';
import {Popover, PopoverButton, PopoverPanel, Transition} from "@headlessui/react";
import {list} from "postcss";

export default function BlogLayout(props: Props): JSX.Element {
    const {toc, children, ...layoutProps} = props;

    return (
        <Layout {...layoutProps}>
            {/* 상단 여백, 가운데 정렬, 좌우 패딩 */}
            <div className="mx-auto min-w-full sm:min-w-[600px] md:min-w-[768px] lg:min-w-[1024px] xl:min-w-[1200px] mt-6 md:mt-10">
                {/* 모바일에서는 flex-col, 데스크톱에서는 flex-row */}

                    {/* 메인 콘텐츠 영역 */}
                <div
                    className={`mx-auto px-4 w-full`}
                >
                    <div className="main-class">
                        <main
                            className={
                                `mx-auto max-w-[900px] px-4 w-full prose prose-lg`
                            }
                        >
                            {children}
                        </main>

                        {/* TOC(목차) - 데스크톱에서만 보이도록 */}
                        {toc && (
                            <div className="">
                                <TocPopover toc={toc} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}


const TocPopover = ({toc}: { toc: any }) => {

    console.log(toc)

    return (
        <Popover className="relative block">
            {/* Popover 버튼 */}
            <PopoverButton
                className="fixed bottom-4 right-4"
            >
                <div className={`w-16 h-16`}>
                    <img src="/img/logo.png" alt=""/>
                </div>
            </PopoverButton>
            <PopoverPanel
                    transition
                    anchor="top"
                    className="z-10 right-0 w-[200px] h-auto max-w-none p-4 bg-white whitespace-pre-line border border-gray-200 rounded-lg shadow-lg"
                >
                    {/* 실제 TOC 내용 */}
                    <div className="text-left text-xs">
                        {toc?.props?.toc
                            ?.filter((item) => item?.level <= 3) // level이 3 이상인 항목만 필터링
                            .map((item) => (
                                <a key={item.id} href={`#${item.id}`} className="block mb-2 text-gray-500 hover:text-opacity-60 dark:text-white dark:hover:text-opacity-80 transition-colors">
                                    {item.value.replace(/<\/?[^>]+(>|$)/g, "")}
                                </a>
                            ))}
                    </div>
                </PopoverPanel>
        </Popover>
    );
}

