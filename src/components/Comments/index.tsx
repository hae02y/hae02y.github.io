import React from "react";
import Giscus from "@giscus/react";
import { useColorMode } from "@docusaurus/theme-common";

export default function Comments() {
    const { colorMode } = useColorMode();

    return (
        <div>
            <Giscus
                id="comments"
                repo="hae02y/hae02y.github.io"
                repoId="R_kgDOKoTAvA"
                category="Announcements"
                categoryId="DIC_kwDOKoTAvM4CvOH1"
                mapping="pathname"
                strict="0"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="bottom"
                theme={colorMode === "dark" ? "dark_tritanopia" : "light_tritanopia"}
                lang="ko"
                loading="lazy"
            />
        </div>
    );
}