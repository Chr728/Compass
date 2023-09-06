import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      blue: "#0880ae",
      yellow: "#f2ac57",
      green: "#14a38b",
      red: "#ff7171",
      darkgrey: "#2c2738",
      grey: "#756f86",
      slateblue: "#7c9cbf",
      white: "#ffffff",
      lightgrey: "#dbe2ea",
      eggshell: "#ebf4f8",
    },
    fontFamily: {
      sans: ["IBM Plex Sans", "sans-serif"],
    }
  },
  extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
  },
  plugins: [],
}
export default config
