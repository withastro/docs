import starlightPlugin from '@astrojs/starlight-tailwind';

// Generated color palettes
const accent = { 200: '#f1b6c3', 600: '#c30c5e', 900: '#5a132c', 950: '#3e1220' };
const gray = { 100: '#f6f6f7', 200: '#edeeef', 300: '#c1c2c4', 400: '#8a8b8f', 500: '#56585b', 700: '#37383b', 800: '#25272a', 900: '#171819' };

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: { accent, gray },
        },
    },
    plugins: [starlightPlugin()],
};
