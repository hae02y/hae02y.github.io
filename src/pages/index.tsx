import React, {Suspense} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import TerminalDialog from "@site/src/components/TerminalDialog";
import BouncyDev from "@site/src/components/BounceDev";
import TerminalDialog2 from '@site/src/components/TerminalDialog2';



function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();
    return (<header></header>
    );
}

function CamelSection() {

    return (
        <div className="h-[calc(100dvh-64px)] dark:bg-[#23262C] flex overflow-hidden">
            <div className="h-full flex w-full flex-col">
                <div className="lg:flex h-full dark:from-[#1B1B1D] dark:bg-[#1B1B1D]">
                    {/* 좌측: 3D Camel */}
                    <div
                        className="h-full w-full lg:h-full lg:w-1/2 flex items-center justify-center"
                    >
                        <TerminalDialog/>
                    </div>

                    {/* 우측: 프로필 + 다이얼로그 */}
                    <div
                        className="hidden lg:h-full lg:w-1/2 lg:flex items-center justify-center"
                    >

                        <div className={`flex-col`}>
                            <BouncyDev />
                            {/* <FloatingTags /> */}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function HomepageContent() {

    return (
        <div className="h-[calc(100dvh-64px)] dark:bg-[#23262C] flex overflow-hidden">
            <div className="h-full flex w-full flex-col">
                <div className="lg:flex h-full dark:from-[#1B1B1D] dark:bg-[#1B1B1D]">
                    <div className="h-full font-mono w-full lg:h-full lg:w-1/2 flex items-center justify-center">
                      <TerminalDialog2 />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Home() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`개발 공장`}
            description="정해영 기술블로그"
        >
            <main>
                {/* <CamelSection/> */}
                <HomepageContent/>
            </main>
        </Layout>
    );
}
