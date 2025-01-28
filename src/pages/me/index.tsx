import React from 'react';
import Layout from '@theme/Layout';

export default function Me() {
    return (
        <Layout>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh',
                }}
            >
                <object
                    data="/resume.pdf" // PDF 파일 경로
                    type="application/pdf"
                    width="80%"
                    height="600px"
                >
                    <p>PDF를 표시할 수 없습니다. <a href="/resume.pdf">여기를 클릭</a>하여 다운로드하세요.</p>
                </object>
            </div>
        </Layout>
    );
}
