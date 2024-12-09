import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import MacTerminal from "@site/src/components/MacTerminal";

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={`h-screen`}>
            <div className="container text-center py-12 h-full w-full">
                <div className="flex justify-center h-[50%] lg:h-[70%]">
                    <MacTerminal version={`${siteConfig.tagline}`} title={`${siteConfig.title}`} />
                </div>
                <div className="flex justify-center h-[50%]">
                    <div className="mt-6">
                        <Link
                            className="inline-block bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-full transition duration-300"
                            to="/series/"
                        >
                            Series
                        </Link>
                        <Link
                            className="inline-block bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-full ml-4 transition duration-300"
                            to="/blog/"
                        >
                            Blog
                        </Link>
                        <div className="inline-block ml-4">
                            <iframe
                                src="https://ghbtns.com/github-btn.html?user=hae02y&repo=hae02y.github.io&type=star&count=true&size=large"
                                frameBorder="0"
                                scrolling="0"
                                width="120"
                                height="30"
                                title="GitHub Star"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function EmojiAvatarSection() {
    return (
        <section className="bg-gray-900 text-white text-center py-12">
            <div className="container">
                <div className="inline-block">
                    <img
                        src="/img/docusaurus.png"
                        alt="환호하는 이모지"
                        className="w-32 h-32 mx-auto animate-bounce"
                    />
                    <p className="text-sm text-gray-400 mt-4">
                        찌르거나 클릭해 보세요 👆 <br/>
                        다양한 제 표정을 볼 수 있어요!
                    </p>
                </div>
            </div>
        </section>
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
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`Welcome to ${siteConfig.title}`}
            description="Description will go into a meta tag in <head />"
        >
            <HomepageHeader />
            <main>
                <EmojiAvatarSection />
                <GuestBookSection />
            </main>
        </Layout>
    );
}
