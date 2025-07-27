import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Resume from '@site/src/components/Resume';

export default function Me() {
    const {siteConfig} = useDocusaurusContext();
    const {profile, skills, experience, links, resume} = siteConfig.customFields as any;

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
                <Resume 
                    profile={profile}
                    skills={skills}
                    experience={experience}
                    links={links}
                    resumeUrl={resume}
                />
            </div>
        </Layout>
    );
}
