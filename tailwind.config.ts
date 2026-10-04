import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-inter)', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f6f1ff',
          100: '#ede4ff',
          200: '#dccbff',
          300: '#c2a3ff',
          400: '#a372ff',
          500: '#8645f5',
          600: '#7329e0',
          700: '#5f1fbb',
          800: '#4e1c96',
          900: '#3f1a78',
          950: '#270b52',
        },
        magenta: {
          50: '#fff0f7',
          100: '#ffe2f0',
          400: '#f5559d',
          500: '#e6307f',
          600: '#c81c66',
          700: '#a31552',
        },
        ink: {
          DEFAULT: '#17111f',
          soft: '#241b30',
          muted: '#6b6378',
        },
        cream: {
          DEFAULT: '#fbf8f4',
          dark: '#f3ede5',
        },
        pride: {
          red: '#E40303',
          orange: '#FF8C00',
          yellow: '#FFED00',
          green: '#008026',
          blue: '#24408E',
          purple: '#732982',
          lightBlue: '#5BCEFA',
          pink: '#F5A9B8',
          white: '#FFFFFF',
          brown: '#784F17',
          black: '#1A1A1A',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#0F0F1A',
        },
      },
      backgroundImage: {
        'pride-gradient': 'linear-gradient(90deg, #E40303, #FF8C00, #FFED00, #008026, #24408E, #732982)',
        'pride-stripe': 'linear-gradient(90deg, #E40303 0 16.66%, #FF8C00 16.66% 33.33%, #FFED00 33.33% 50%, #008026 50% 66.66%, #24408E 66.66% 83.33%, #732982 83.33% 100%)',
        'pride-gradient-soft': 'linear-gradient(90deg, #E4030318, #FF8C0018, #FFED0018, #00802618, #24408E18, #73298218)',
        'primary-gradient': 'linear-gradient(135deg, #e6307f 0%, #7329e0 100%)',
      },
      boxShadow: {
        'pride': '0 10px 40px -10px rgba(230, 48, 127, 0.45), 0 10px 30px -15px rgba(115, 41, 224, 0.4)',
        'pride-sm': '0 6px 20px -8px rgba(230, 48, 127, 0.45)',
        'soft': '0 1px 2px rgba(23, 17, 31, 0.04), 0 8px 24px -12px rgba(23, 17, 31, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'pride-flow': 'prideFlow 8s linear infinite',
        'marquee': 'marquee 40s linear infinite',
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
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
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
