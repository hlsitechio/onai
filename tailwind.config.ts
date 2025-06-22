
import type { Config } from "tailwindcss";
import { themeConfig } from "./src/config/tailwind/theme";
import { colorsConfig } from "./src/config/tailwind/colors";
import { keyframesConfig, animationConfig } from "./src/config/tailwind/animations";
import { utilitiesPlugin } from "./src/config/tailwind/utilities";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		...themeConfig,
		extend: {
			...themeConfig.extend,
			colors: colorsConfig,
			keyframes: keyframesConfig,
			animation: animationConfig,
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography"),
		utilitiesPlugin
	],
} satisfies Config;
