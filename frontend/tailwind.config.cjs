/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'sidebar-gradient': 'linear-gradient(180deg, #0f1117 0%, #151928 100%)',
                'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
            },
            boxShadow: {
                'glow': '0 0 30px rgba(99, 102, 241, 0.15)',
                'glow-sm': '0 0 15px rgba(99, 102, 241, 0.1)',
            },
            backgroundColor: {
                'surface': '#151928',
                'surface-2': '#1a2035',
            },
        },
    },
    plugins: [],
}
