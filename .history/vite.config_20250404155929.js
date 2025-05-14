import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'vite-plugin-compression';
import deletePlugin from 'rollup-plugin-delete';
import fs from 'fs';

// Get the directory name using ES modules compatible approach
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Custom plugin to copy _redirects file to the build directory
const copyRedirects = () => ({
    name: 'copy-redirects',
    closeBundle: () => {
        const redirectsPath = path.resolve(__dirname, 'public', '_redirects');
        const targetPath = path.resolve(__dirname, 'build', '_redirects');
        if (fs.existsSync(redirectsPath)) {
            fs.copyFileSync(redirectsPath, targetPath);
            console.log('✅ Copied _redirects file to build directory');
        }
    }
});

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        compression({
            ext: '.gz',
        }),
        deletePlugin({ targets: 'build/*', hook: 'buildEnd' }),
        copyRedirects()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    optimizeDeps: {
        exclude: [
            'puppeteer',
            'nodemailer',
            'fs',
            'fs/promises',
            'path',
            'express',
        ],
    },
    build: {
        outDir: 'build',
        sourcemap: true,
        chunkSizeWarningLimit: 400,
        assetsInlineLimit: 4096,
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                    return 'app';
                }
            },
            external: [
                'puppeteer',
                'nodemailer',
                'fs',
                'fs/promises',
                'path',
                'express',
            ],
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
        // Add history fallback for SPA routing
        historyApiFallback: true,
    }
});