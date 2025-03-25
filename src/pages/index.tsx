import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import MacTerminal from "@site/src/components/MacTerminal";
import MovingCamel from '@site/src/components/MovingCamel';
import {OrbitControls} from "@react-three/drei";
import { Canvas } from '@react-three/fiber';

function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();

    return (
        <header className={`h-[calc(100vh-4rem)] bg-main dark:bg-[#23262C] hidden lg:flex`}>
                <div className="flex flex-col h-full w-full">
                    <div className="lg:h-full w-full lg:flex items-center justify-center">
                        <MacTerminal version={`${siteConfig.tagline}`} title={`${siteConfig.title}`}/>
                    </div>
                    {/* 하단 2/3 영역 */}
                </div>
        </header>
    );
}

function CamelSection() {
    return (
        <div className={`h-[calc(100vh-4rem)] dark:bg-[#23262C] flex`}>
            <div className="h-[100%] flex w-full flex-col">
                <div className="lg:flex h-[100%]">
                    {/* 좌측 이미지 영역 */}
                    <div className="h-1/2 w-full lg:h-[100%] lg:w-1/2 flex items-center justify-center">
                        <Canvas>
                            <ambientLight intensity={0.5}/>
                            <directionalLight position={[2, 5, 2]} intensity={1}/>
                            <MovingCamel/> {/* 3D 모델 추가 */}
                            <OrbitControls/>
                        </Canvas>
                    </div>

                    {/* 우측 텍스트 영역 */}
                    <div
                        className="h-1/2 w-full lg:h-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-gray-900">
                        <div
                            className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl ring-4 ring-white">
                            <img
                                src="/me.jpg"
                                alt="Profile"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                            />
                        </div>
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
