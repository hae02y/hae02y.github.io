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

function EmojiAvatarSection() {
    const {siteConfig} = useDocusaurusContext();
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
                        className="h-1/2 w-full lg:h-[100%] lg:w-1/2 bg-gray-200 opacity-40 flex items-center justify-center">
                        안녕하세요
                    </div>
                </div>
            </div>
        </div>
    );
}

function GuestBookSection() {
    return (
        <section className="container mx-auto py-12">
            <h2 className="text-center text-2xl font-bold mb-6">방명록 ✍️</h2>
            <div className="flex justify-center">
                <iframe
                    src="https://utteranc.es/utterances.html?repo=parkgang/parkgang.github.io&issue-term=pathname&label=comment&theme=github-dark"
                    title="Guest Book"
                    className="w-full max-w-4xl h-96 border-2 border-gray-200 rounded-lg"
                ></iframe>
            </div>
        </section>
    );
}

export default function Home(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`Welcome to ${siteConfig.title}`}
            description="Description will go into a meta tag in <head />"
        >
            <HomepageHeader/>
            <main>
                <EmojiAvatarSection/>
                {/*<GuestBookSection />*/}
            </main>
        </Layout>
    );
}
