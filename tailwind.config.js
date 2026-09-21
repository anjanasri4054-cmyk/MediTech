/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        medbridge: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        telugu: ['Noto Sans Telugu', 'sans-serif'],
      },
      animation: {
        'scan-laser': 'scanLaser 2.5s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-bar': 'waveBar 1.2s ease-in-out infinite alternate',
        'glow-line': 'glowLine 2s linear infinite',
      },
      keyframes: {
        scanLaser: {
          '0%, 100%': { top: '5%', opacity: '0.8' },
          '50%': { top: '92%', opacity: '1' },
        },
        waveBar: {
          '0%': { height: '20%' },
          '100%': { height: '100%' },
        },
        glowLine: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        }
      }
    },
  },
  plugins: [],
}
