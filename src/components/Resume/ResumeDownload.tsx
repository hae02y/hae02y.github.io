import React from 'react';
import { Download } from 'lucide-react';

interface ResumeDownloadProps {
  resumeUrl: string;
}

export default function ResumeDownload({ resumeUrl }: ResumeDownloadProps) {
  return (
    <div className="text-center">
      <a 
        href={resumeUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium group shadow-lg hover:shadow-xl"
      >
        <Download size={20} className="mr-2 group-hover:scale-110 transition-transform duration-200" />
        Resume
      </a>
    </div>
  );
} 