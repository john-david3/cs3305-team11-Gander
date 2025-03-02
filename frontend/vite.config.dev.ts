import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [
		react({
			// Add development-specific React plugin options
			jsxRuntime: "automatic",
		}),
	],
	server: {
		port: 5173,
		proxy: {
			"/api": {
				target: "http://localhost:8080",
				changeOrigin: true,
				secure: false,
			},
			"/socket.io": {
				target: "http://localhost:8080",
				changeOrigin: true,
				ws: true,
      },
      "/stream": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
			"/images": {
				target: "http://localhost:8080",
				changeOrigin: true,
			},
			"/user": {
				target: "http://localhost:8080",
				changeOrigin: true,
			},
		},
	},
	build: {
		sourcemap: true,
		outDir: "dist",
	},
	optimizeDeps: {
		exclude: ["@vite/client", "@vite/env"],
	},
	esbuild: {
		logOverride: { "this-is-undefined-in-esm": "silent" },
	},
});
