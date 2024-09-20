/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
		colors: {
			'brand': '#0FD862',
			'brand-secondary': '#0EC359',
			'brandBg': '#0FD86299',
			'primary': '#2b2b2c',
			'secondary': '#9a9da5',
			'background': '#fbfafb',
			'background-secondary': '#DFDFE0',
			'background-accent': '#EAEAEA',
			'background-footer': '#00ad3b',
			'furniture-card-button': '#5ea13c',
			'alert': '#FF1919'
		}
	},
	plugins: [],
}
