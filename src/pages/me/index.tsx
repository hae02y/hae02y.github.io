import React, { useState } from 'react';
import Layout from '@theme/Layout';
import {PdfViewer} from "@naverpay/react-pdf";

export default function Me() {
    const [numPages, setNumPages] = useState<number | null>(null);

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                <PdfViewer pdfUrl={"/resume.pdf"} onPageChange={setNumPages} />
            </div>
        </Layout>
    );
}
