import React from 'react';
import OriginalLayout from '@theme-original/Layout';

export default function LayoutWrapper(props) {
    return (
        <div className="custom-layout">
            <OriginalLayout {...props} />
        </div>
    );
}