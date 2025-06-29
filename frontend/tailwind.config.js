/** @type {import('tailwindcss').Config} */

export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}", // Broader match for all files in src
    ],
    theme: {
        extend: {
            colors: {
                primarycolor: "#F8B738",
                secondarycolor: "#F5F5F6",
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [],
}
