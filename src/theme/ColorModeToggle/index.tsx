import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import type ColorModeToggleType from '@theme/ColorModeToggle';
import type {WrapperProps} from '@docusaurus/types';
import clsx from 'clsx';
import {LightModeIcon} from "@site/src/icons/IconLightMode";
import {DarkModeIcon} from "@site/src/icons/IconDarkMode";

type Props = WrapperProps<typeof ColorModeToggleType>;

export default function ColorModeToggle({ className, ...props }) {
    const { colorMode, setColorMode } = useColorMode();
    const isDarkMode = colorMode === 'dark';

    return (
        <button
            type="button"
            className={clsx('clean-btn', className)}
            onClick={() => setColorMode(isDarkMode ? 'light' : 'dark')}
            {...props}
        >
            {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
        </button>
    );
}