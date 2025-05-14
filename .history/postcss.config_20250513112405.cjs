/** @type {import('postcss-load-config').Config} */
module.exports = {
    plugins: {
        tailwindcss: require('./tailwind.config.cjs'),
        autoprefixer: {},
    },
};