/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#10B981",
        accent: "#F97316",
        neutral: "#1F2937",
        "base-100": "#ffffff",
        "base-200": "#F3F4F6",
        "base-300": "#E5E7EB",
        info: "#3ABFF8",
        success: "#36D399",
        warning: "#FBBD23",
        error: "#F87272",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        'neubrutalism': '5px 5px 0px 0px rgba(0,0,0,0.9)',
        'neubrutalism-sm': '3px 3px 0px 0px rgba(0,0,0,0.9)',
        'neubrutalism-lg': '8px 8px 0px 0px rgba(0,0,0,0.9)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        neurolearn: {
          "primary": "#3B82F6",
          "secondary": "#10B981",
          "accent": "#F97316",
          "neutral": "#1F2937",
          "base-100": "#ffffff",
          "base-200": "#F3F4F6",
          "base-300": "#E5E7EB",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
} 