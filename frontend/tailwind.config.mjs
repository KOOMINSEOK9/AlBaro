/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideOverPanel: {
          '0%': {
            opacity: '0',
            transform: 'translateX(10%)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        slideOverPanelClose: {
          '0%': {
            opacity: '1',
            transform: 'translateX(0)'
          },
          '100%': {
            opacity: '0',
            transform: 'translateX(10%)'
          }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        slideOverPanel: 'slideOverPanel 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        slideOverPanelClose: 'slideOverPanelClose 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        fadeOut: 'fadeOut 0.2s ease-out'
      }
    },
  },
  plugins: [],
};