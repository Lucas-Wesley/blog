import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://lucaswesley.dev' // Atualizar com URL real

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/private/',
          '*.json$',
        ]
      },
      {
        userAgent: 'GPTBot',
        disallow: '/' // Opcional: bloquear bots de IA se desejar
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
} 