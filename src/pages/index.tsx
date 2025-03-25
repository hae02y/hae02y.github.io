import React, {Suspense} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import MovingCamel from '@site/src/components/MovingCamel';
import {OrbitControls} from "@react-three/drei";
import { Canvas } from '@react-three/fiber';
import TerminalDialog from "@site/src/components/TerminalDialog";
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';



function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();

    return (<header></header>
    );
}

// src/components/RecentPosts.tsx

function RecentPosts() {
    const blogPost = useBlogPost();

    return (
        <div className="w-full max-w-md p-4 space-y-4">
            <h2 className="text-xl font-bold text-white">📌 최근 게시글</h2>
            <ul className="space-y-3">
                {blogPost.slice(0, 5).map(({metadata}) => (
                    <li key={metadata.permalink}>
                        <Link
                            to={metadata.permalink}
                            className="block text-white hover:underline hover:text-blue-400 transition duration-300"
                        >
                            <span className="font-medium">{metadata.title}</span>
                            <br />
                            <span className="text-xs text-gray-400">{metadata.formattedDate}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}


function CamelSection() {
    const { siteConfig } = useDocusaurusContext();

    return (
        <div className="h-[calc(100vh-4rem)] dark:bg-[#23262C] flex">
            <div className="h-full flex w-full flex-col">
                <div className="lg:flex h-full bg-white dark:bg-gradient-to-br">
                    {/* 좌측: 3D Camel */}
                    <div
                        className="h-full w-full lg:h-full lg:w-1/2 flex items-center justify-center from-black via-gray-800 to-gray-900"
                    >
                        <TerminalDialog/>
                    </div>

                    {/* 우측: 프로필 + 다이얼로그 */}
                    <div
                        className="h-full w-full lg:h-full lg:w-1/2 flex items-center justify-center from-black via-gray-800 to-gray-900"
                    >

                    </div>
                </div>
            </div>
        </div>
    );
}


export default function Home() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.title} 블Lo그`}
            description="Description will go into a meta tag in <head />"
        >
            <main>
                <CamelSection/>
            </main>
        </Layout>
    );
}
