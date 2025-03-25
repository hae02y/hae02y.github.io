import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import MacTerminal from "@site/src/components/MacTerminal";
import MovingCamel from '@site/src/components/MovingCamel';
import {OrbitControls} from "@react-three/drei";
import { Canvas } from '@react-three/fiber';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogClose,
} from "@site/src/components/ui/dialog";


function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();

    return (
        <header className={`h-[calc(100vh-4rem)] bg-main dark:bg-[#23262C] hidden lg:flex`}>
                {/*<div className="flex flex-col h-full w-full">*/}
                {/*    <div className="lg:h-full w-full lg:flex items-center justify-center">*/}
                {/*        <MacTerminal version={`${siteConfig.tagline}`} title={`${siteConfig.title}`}/>*/}
                {/*    </div>*/}
                {/*    /!* 하단 2/3 영역 *!/*/}
                {/*</div>*/}
        </header>
    );
}

function CamelSection() {
    const { siteConfig } = useDocusaurusContext();

    return (
        <div className="h-[calc(100vh-4rem)] dark:bg-[#23262C] flex">
            <div className="h-full flex w-full flex-col">
                <div className="lg:flex h-full">
                    {/* 좌측: 3D Camel */}
                    <div className="h-1/2 w-full lg:h-full lg:w-1/2 flex items-center justify-center">
                        <Canvas>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[2, 5, 2]} intensity={1} />
                            <MovingCamel />
                            <OrbitControls />
                        </Canvas>
                    </div>

                    {/* 우측: 프로필 + 다이얼로그 */}
                    <div
                        className="h-1/2 w-full lg:h-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-gray-900"
                    >
                        <Dialog>
                            <DialogTrigger asChild>
                                <div
                                    className="cursor-pointer relative w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl ring-4 ring-white transition-transform hover:scale-105"
                                >
                                    <img
                                        src="/me.jpg"
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                                <MacTerminal
                                    title={siteConfig.title}
                                    version={siteConfig.tagline}
                                />
                            </DialogContent>
                        </Dialog>
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
            <HomepageHeader/>
            <main>
                <CamelSection/>
            </main>
        </Layout>
    );
}
