/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['dragonball-api.com'],
        remotePatterns: [{
            protocol: 'https',
            hostname: 'dragonball-api.com',
            port: '',
            pathname: '/**',
        }, ],
    },
};

export default nextConfig;