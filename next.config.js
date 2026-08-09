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
