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
                    <div className="h-1/2 w-full lg:h-full lg:w-1/2 flex items-center justify-center">
                        <TerminalDialog />
                    </div>

                    {/* 우측: 프로필 + 다이얼로그 */}
                    <div
                        className="h-1/2 w-full lg:h-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-gray-900"
                    >
                        <Canvas
                            style={{ background: 'skyblue' }} // 하늘 배경
                            camera={{ position: [0, 3, 7], fov: 50 }}
                        >
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[5, 10, 5]} intensity={1.2} />

                            <Suspense fallback={null}>
                                <MovingCamel />
                            </Suspense>

                            {/* 바닥 풀판 */}
                            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                                <planeGeometry args={[50, 50]} />
                                <meshStandardMaterial color="green" />
                            </mesh>

                            <OrbitControls />
                        </Canvas>
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
