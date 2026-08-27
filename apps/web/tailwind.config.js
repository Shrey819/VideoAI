/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#090a0f',
          surface: '#11131c',
          panel: '#181b28',
          border: '#23273b',
          borderLight: '#323854',
          accent: '#8b5cf6', // Electric Purple
          accentHover: '#7c3aed',
          cyan: '#06b6d4',
          emerald: '#10b981',
          gold: '#facc15',
          textMuted: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        glowCyan: '0 0 25px -5px rgba(6, 182, 212, 0.35)',
      },
    },
  },
  plugins: [],
};
