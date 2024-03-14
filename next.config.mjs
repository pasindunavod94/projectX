/** @type {import('next').NextConfig} */
const nextConfig = {
   output: "export",
   eslint: {
     // Warning: This allows production builds to successfully complete even if
     // your project has ESLint errors.
     ignoreDuringBuilds: true,
   },
   experimental: {
     missingSuspenseWithCSRBailout: false,
   },
};

export default nextConfig;
