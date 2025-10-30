import daisyui from 'daisyui'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        linkedinDark: {
          primary: "#0A66C2",      // LinkedIn Blue (kept same for brand)
          secondary: "#1D2226",    // Dark background (main)
          accent: "#70B5F9",       // Blue accent for hover/links
          neutral: "#FFFFFF",      // White text
          "base-100": "#0E0E0E",   // Darker background layer
          info: "#A8A8A8",         // Light gray text for secondary info
          success: "#057642",      // Green for success
          warning: "#EAB308",      // Warm yellow for warning
          error: "#F44336",        // Red for errors
        },
      },
    ],
  },
}
