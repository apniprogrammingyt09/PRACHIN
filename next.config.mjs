/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com;"
          }
        ]
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude MongoDB and related native modules from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        'util/types': false,
      }
      
      config.externals = [
        ...(config.externals || []),
        {
          'mongodb': 'mongodb',
          'mongodb-client-encryption': 'mongodb-client-encryption',
          'kerberos': 'kerberos',
          '@napi-rs/snappy-linux-x64-gnu': '@napi-rs/snappy-linux-x64-gnu',
          '@napi-rs/snappy-linux-x64-musl': '@napi-rs/snappy-linux-x64-musl',
        }
      ]
    }
    return config
  },
  // Updated property name for Next.js 15+
  serverExternalPackages: ['mongodb', 'mongodb-client-encryption'],
  
  // Allow Razorpay domains
  async rewrites() {
    return [
      {
        source: '/api/razorpay/:path*',
        destination: 'https://api.razorpay.com/:path*'
      }
    ]
  }
}

export default nextConfig
