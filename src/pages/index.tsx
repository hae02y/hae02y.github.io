import React, {Suspense} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import MovingCamel from '@site/src/components/MovingCamel';
import {OrbitControls} from "@react-three/drei";
import { Canvas } from '@react-three/fiber';
import TerminalDialog from "@site/src/components/TerminalDialog";


function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();

    return (<header></header>
    );
}


function CamelSection() {
    const { siteConfig } = useDocusaurusContext();

    return (
        <div className="h-[calc(100vh-4rem)] dark:bg-[#23262C] flex">
            <div className="h-full flex w-full flex-col">
                <div className="lg:flex h-full">
                    {/* 좌측: 3D Camel */}
                    <div
                        className="h-full w-full lg:h-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-gradient-to-br from-black via-gray-800 to-gray-900"
                    >
                        <TerminalDialog/>
                    </div>

                    {/* 우측: 프로필 + 다이얼로그 */}
                    <div
                        className="h-1/2 w-full lg:h-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-gray-900"
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
