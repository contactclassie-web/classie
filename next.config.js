/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'hrjvxwqvxvibtwyfoyca.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: 'classie-eta.vercel.app', pathname: '/**' },
    ],
  },
}

module.exports = nextConfig
