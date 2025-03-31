import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { Document, Page, pdfjs } from 'react-pdf';

// ✅ CDN에서 pdf.worker.min.js 불러오기 (UMD 방식)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function Me() {
    const [numPages, setNumPages] = useState<number | null>(null);

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                <div className="w-full max-w-4xl bg-white shadow rounded p-4">
                    <Document
                        file="/resume.pdf"
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading="PDF 로딩 중..."
                    >
                        {Array.from({ length: numPages || 0 }, (_, index) => (
                            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                        ))}
                    </Document>
                </div>
            </div>
        </Layout>
    );
}
