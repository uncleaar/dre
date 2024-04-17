/// <reference types="vitest" />

import path from "path";
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "./src/app/styles/_mantine";`
			}
		}
	},

	server: {
		port: 4000,
		watch: {
			usePolling: true
		}
	},

	resolve: {
		alias: {
			pages: path.resolve(__dirname, "./src/pages"),
			widgets: path.resolve(__dirname, "./src/widgets"),
			shared: path.resolve(__dirname, "./src/shared"),
			app: path.resolve(__dirname, "./src/app"),
			features: path.resolve(__dirname, "./src/features"),
			services: path.resolve(__dirname, "./src/services")
		}
	}
});
