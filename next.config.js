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
      // /collections/the-festive-edit(/Heel+heel) → /shop/the-festive-edit
      // (old Shopify collection URL — /collections/the-festive-edit itself was
      // never a real page here, so the previous version of this redirect sent
      // visitors from one 404 straight into another)
      {
        source: '/collections/the-festive-edit/:tag',
        destination: '/shop/the-festive-edit',
        permanent: true,
      },
      {
        source: '/collections/the-festive-edit',
        destination: '/shop/the-festive-edit',
        permanent: true,
      },
      // /the-festive-edit (missing /shop prefix) → /shop/the-festive-edit
      {
        source: '/the-festive-edit',
        destination: '/shop/the-festive-edit',
        permanent: true,
      },
      // /product/:slug (singular — old Shopify pattern still linked/indexed
      // from before this migration) → /products/:slug, the real route
      {
        source: '/product/:slug',
        destination: '/products/:slug',
        permanent: true,
      },
      // /track (old/incorrect link) → /track-order
      {
        source: '/track',
        destination: '/track-order',
        permanent: true,
      },
      // Footer used to link to a "Press" page that was never built — send
      // any lingering links/bookmarks to About instead of a 404.
      {
        source: '/press',
        destination: '/about',
        permanent: true,
      },
      // A specific blog post URL Google has indexed that no longer resolves
      // to any post — send it to the blog listing instead of a dead end.
      {
        source: '/blog/how-to-pick-shoe-charm-for-wedding',
        destination: '/blog',
        permanent: true,
      },
      // Bots/crawlers occasionally probe "<page>.json" hoping for a raw data
      // endpoint (e.g. /products/crovia.json) — send them to the real page
      // instead of a 404, on every route that has a dynamic slug.
      {
        source: '/products/:slug.json',
        destination: '/products/:slug',
        permanent: true,
      },
      {
        source: '/shop/:slug.json',
        destination: '/shop/:slug',
        permanent: true,
      },
      {
        source: '/blog/:slug.json',
        destination: '/blog/:slug',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
