import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';

export default function CustomToggle() {
    const { colorMode, setColorMode } = useColorMode();
    const isDarkMode = colorMode === 'dark';

    return (
        <button
            onClick={() => setColorMode(isDarkMode ? 'light' : 'dark')}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:opacity-75 transition-all"
        >
            {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
    );
}
