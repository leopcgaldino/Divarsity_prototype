import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f0ff',
          100: '#ebe4ff',
          200: '#d6cfff',
          300: '#b8a8ff',
          400: '#9a7cff',
          500: '#7c4dff',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3e1a7a',
          950: '#2e1065',
        },
        pride: {
          red: '#FF0018',
          orange: '#FFA52C',
          yellow: '#FFFF41',
          green: '#008018',
          blue: '#0000F9',
          purple: '#86007D',
          lightBlue: '#00BCEE',
          pink: '#FC66C9',
          white: '#FFFFFF',
          brown: '#8C5E3C',
          black: '#2D2D2D',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#0F0F1A',
        },
      },
      backgroundImage: {
        'pride-gradient': 'linear-gradient(90deg, #FF0018, #FFA52C, #FFFF41, #008018, #0000F9, #86007D)',
        'pride-gradient-soft': 'linear-gradient(90deg, #FF001822, #FFA52C22, #FFFF4122, #00801822, #0000F922, #86007D22)',
        'primary-gradient': 'linear-gradient(135deg, #7c4dff 0%, #5b21b6 100%)',
      },
      boxShadow: {
        'pride': '0 0 20px rgba(255, 0, 24, 0.3), 0 0 40px rgba(134, 0, 125, 0.2)',
        'pride-sm': '0 0 10px rgba(255, 0, 24, 0.2), 0 0 20px rgba(134, 0, 125, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'pride-flow': 'prideFlow 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        prideFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundSize: {
        '300%': '300% 300%',
      },
    },
  },
  plugins: [],
}
export default config