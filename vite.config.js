// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    publicDir: 'public',
    build: {
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'src/popup.html'),  // Adjust to your actual HTML
            },
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`
            }
        },
        outDir: 'dist',
        emptyOutDir: true,
    }
})
