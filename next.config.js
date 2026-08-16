/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 86400,
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [64, 128, 256, 384, 512],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'hrjvxwqvxvibtwyfoyca.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: 'classie-eta.vercel.app', pathname: '/**' },
    ],
  },
  async redirects() {
    return [
      // /shop/bow → /shop/clips (bow products moved to shoe-charms)
      {
        source: '/shop/bow',
        destination: '/shop/clips',
        permanent: true,
      },
      // /shipping-policy → /shipping
      {
        source: '/shipping-policy',
        destination: '/shipping',
        permanent: true,
      },
      // /products → /collections (old Shopify URL)
      {
        source: '/products',
        destination: '/collections',
        permanent: true,
      },
      // /collections/the-festive-edit/Heel+heel → /collections/the-festive-edit
      {
        source: '/collections/the-festive-edit/:tag',
        destination: '/collections/the-festive-edit',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
