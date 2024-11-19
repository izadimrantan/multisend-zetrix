/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    distDir: 'out', // Where to export all pages
    trailingSlash: false,
    // assetPrefix: assetPrefix,

    // time in seconds of no pages generating during static
    // generation before timing out
    staticPageGenerationTimeout: 1000,
    reactStrictMode: true
};

export default nextConfig;
