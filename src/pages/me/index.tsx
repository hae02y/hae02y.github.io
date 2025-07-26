import React from 'react';
import Layout from '@theme/Layout';
import { Github, Mail, Linkedin } from 'lucide-react';

export default function Me() {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
                {/* 프로필 섹션 */}
                <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-8">
                    {/* 프로필 이미지 */}
                    <div className="flex justify-center mb-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                            <img 
                                src="/img/me.jpg" 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* 이름과 직함 */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            정해영 (Hae02y)
                        </h1>
                        <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold">
                            Backend Developer
                        </p>
                    </div>

                    {/* 소개 */}
                    <div className="text-center mb-8">
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            안녕하세요! 백엔드 개발자 정해영입니다. 
                            <br />
                            Spring Boot, Java, JPA 등을 주로 사용하며, 
                            <br />
                            깔끔하고 효율적인 코드 작성을 지향합니다.
                        </p>
                    </div>

                    {/* 기술 스택 */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                            기술 스택
                        </h2>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['Java', 'Spring Boot', 'Spring Security', 'JPA', 'MySQL', 'Redis', 'Docker', 'AWS'].map((tech) => (
                                <span 
                                    key={tech}
                                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 소셜 링크 */}
                    <div className="flex justify-center space-x-6">
                        <a 
                            href="https://github.com/hae02y" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <Github size={24} />
                            <span>GitHub</span>
                        </a>
                        <a 
                            href="mailto:your.email@example.com" 
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <Mail size={24} />
                            <span>Email</span>
                        </a>
                    </div>
                </div>

                {/* 이력서 다운로드 버튼 */}
                <div className="text-center">
                    <a 
                        href="/resume.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        📄 이력서 보기
                    </a>
                </div>
            </div>
        </Layout>
    );
}
