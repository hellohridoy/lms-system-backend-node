/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'app-primary': '#4f46e5',
        'app-secondary': '#6366f1',
        'app-dark': '#111827',
        'app-light': '#f9fafb',
      }
    },
  },
  plugins: [],
}
