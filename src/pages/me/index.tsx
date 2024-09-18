import React from 'react';
import Layout from '@theme/Layout';

export default function Me() {
  return (
    <Layout title="me" description="Hello React Page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '20px',
        }}>
        <p>
          안녕하세요 저입니다.
        </p>
      </div>
    </Layout>
  )
};
