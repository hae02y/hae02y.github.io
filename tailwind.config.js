/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx,ts,tsx,mdx}',
        './src/**/*.{js,jsx,ts,tsx,mdx,css,html}',
    ],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        mode: 'jit',
        extend: {
            fontFamily: {
                brutal: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
                sans: ['Pretendard', 'Cera Round Pro', 'sans-serif'],
                free: ['Pretendard', 'sans-serif'],
                mono: ['JetBrains Mono', 'Cera Round Pro', 'monospace']
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
            },
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0'
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)'
                    }
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)'
                    },
                    to: {
                        height: '0'
                    }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        }
    },
    important: true,
    plugins: [require("tailwindcss-animate")],
    corePlugins: {
        preflight: true,
    },
}

