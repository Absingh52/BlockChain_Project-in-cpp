/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#13a4ec',
        'primary-glow': 'rgba(19, 164, 236, 0.4)',
        'background-light': '#f6f7f8',
        'background-dark': '#101c22',
        'surface-dark': '#1c262d',
        'surface-darker': '#0b1216',
        'card-dark': '#162026',
        'border-dark': '#2a373f',
        'accent-green': '#0bda57',
        'accent-red': '#fa5f38',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(19, 164, 236, 0.3)',
        'glow-hover': '0 0 30px rgba(19, 164, 236, 0.6)',
        'glow-primary': '0 0 15px rgba(19, 164, 236, 0.25)',
        'neon': '0 0 10px rgba(19, 164, 236, 0.3), 0 0 20px rgba(19, 164, 236, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
