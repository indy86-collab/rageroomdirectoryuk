/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
        display: ['var(--font-bebas)', 'sans-serif'],
      },
      colors: {
        // Enhanced rage room color system
        rage: {
          50: '#FFF5F0',
          100: '#FFE8DC',
          200: '#FFCAB3',
          300: '#FFAC8A',
          400: '#FF8E61',
          500: '#F97316', // Primary orange
          600: '#EA580C',
          700: '#DC2626', // Red accent
          800: '#B91C1C',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        dark: {
          50: '#E5E5E5',
          100: '#B3B3B3',
          200: '#808080',
          300: '#4D4D4D',
          400: '#262626',
          500: '#1A1A1A', // Primary dark
          600: '#141414',
          700: '#0F0F0F',
          800: '#0A0A0A',
          900: '#050505',
          950: '#000000',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-rage': 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #DC2626 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(249, 115, 22, 0.3)',
        'glow': '0 0 20px rgba(249, 115, 22, 0.4)',
        'glow-lg': '0 0 30px rgba(249, 115, 22, 0.5)',
        'rage': '0 4px 20px rgba(220, 38, 38, 0.3)',
        'rage-lg': '0 8px 40px rgba(220, 38, 38, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(249, 115, 22, 0.6)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}




