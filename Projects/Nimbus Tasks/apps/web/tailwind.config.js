/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@nimbus/ui/tailwind.config.js")],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};