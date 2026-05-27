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
        primary: '#2563eb', // Blue-600
        secondary: '#1e293b', // Slate-800
        accent: '#10b981', // Emerald-500
        dark: '#0f172a',
        light: '#f8fafc',
      }
    },
  },
  plugins: [],
}
