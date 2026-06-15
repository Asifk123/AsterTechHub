import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aster Tech Hub',
    short_name: 'Aster Tech',
    description: 'IT Services | Digital Marketing | Innovation Hub - Pioneering the next generation of digital infrastructure from Davangere, India.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0f',
    theme_color: '#0a0a0f',
    icons: [
      {
        src: '/favicon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/splash-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
