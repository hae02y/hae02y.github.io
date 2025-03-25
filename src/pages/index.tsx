import React, {Suspense} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import TerminalDialog from "@site/src/components/TerminalDialog";
import FloatingTags from "@site/src/components/FloatingTags";



function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();

    return (<header></header>
    );
}


function CamelSection() {

    return (
        <div className="h-[calc(100vh-4rem)] dark:bg-[#23262C] flex">
            <div className="h-full flex w-full flex-col">
                <div className="lg:flex h-full bg-gradient-to-br from-white via-gray-200 to-gray-300 dark:from-black dark:via-gray-800 dark:to-gray-900">
                    {/* 좌측: 3D Camel */}
                    <div
                        className="h-full w-full lg:h-full lg:w-1/2 flex items-center justify-center"
                    >
                        <TerminalDialog/>
                    </div>

                    {/* 우측: 프로필 + 다이얼로그 */}
                    <div
                        className="h-full w-full lg:h-full lg:w-1/2 flex items-center justify-center"
                    >
                    <FloatingTags />
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

