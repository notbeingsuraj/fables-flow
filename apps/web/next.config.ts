import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@fables-flow/ui',
    '@fables-flow/types',
    '@fables-flow/validation',
    '@fables-flow/config',
    '@fables-flow/utils',
  ],
};

export default nextConfig;
