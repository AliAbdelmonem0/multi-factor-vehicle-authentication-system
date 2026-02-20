/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0F172A", // Deep Navy
                secondary: "#3B82F6", // Bright Blue
                accent: "#06B6D4", // Cyan
                surface: "#FFFFFF",
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
