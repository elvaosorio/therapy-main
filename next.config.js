const withPWA = require("next-pwa")({
    dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
    eslint: {
        ignoreDuringBuilds: true,
    },
});

module.exports = nextConfig;
// module.exports = {};

