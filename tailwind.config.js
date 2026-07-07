/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "juris-bg": "#FAF9F6",
        "juris-text": "#1E293B",
        "juris-card": "#FFFFFF",
        "juris-accent": "#800020",
        // Keep old ones temporarily to prevent crash during transition
        "juris-navy": "#002147",
        "juris-cream": "#F5F5DC",
        "juris-burgundy": "#800020",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};
