import React from "react";

export default function BounceDev() {
    return (
        <div className="font-mono">
            <p className="uppercase tracking-tight text-sm mb-2">해영님의 웹 공간</p>

            <h1 className="text-5xl font-bold leading-none mb-4">Hi, I'm Hae02y</h1>

            <p className="max-w-xl mb-6 text-base leading-relaxed">
                백엔드 개발자이며 Java, Spring Boot 기반의 안정적인 서버 개발을 추구합니다.<br />
                실용적인 아키텍처, 문서화, 협업을 중요하게 생각합니다.<br />
                요즘은 배포 자동화와 관찰 가능성에 관심이 많아요.
            </p>

            <a
                href="/blog/"
                className="text-blue-600 underline hover:text-black transition-colors"
            >
                → TECH 보러가기
            </a>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
                {[
                    "Java", "Spring Boot", "JPA", "MySQL", "Docker",
                    "Redis", "CI/CD", "GitHub Actions", "AWS", "문서화",
                ].map((tag) => (
                    <div
                        key={tag}
                        className="border border-black p-2 text-xs text-center"
                    >
                        {tag}
                    </div>
                ))}
            </div>
        </div>
    );
}
