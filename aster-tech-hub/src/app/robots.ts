import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/dashboard',
        '/pending',
        '/pending-verification',
        '/reset-password',
        '/forgot-password',
      ],
    },
    sitemap: 'https://www.astertechhub.in/sitemap.xml',
  }
}
