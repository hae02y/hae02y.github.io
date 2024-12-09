import React from 'react';
import Layout from '@theme/Layout';

export default function Me() {
    return (
        <Layout title="PDF Viewer" description="Simple PDF Viewer without library">
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <h1>PDF Viewer</h1>
                <object
                    data="/ff.pdf" // PDF 파일 경로
                    type="application/pdf"
                    width="80%"
                    height="600px"
                >
                    <p>PDF를 표시할 수 없습니다. <a href="/ff.pdf">여기를 클릭</a>하여 다운로드하세요.</p>
                </object>
            </div>
        </Layout>
    );
}
