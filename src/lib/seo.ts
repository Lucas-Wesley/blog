import type { ArticleMetadata } from './api'
import type { Metadata } from 'next'

// Configurações SEO centralizadas
export const siteConfig = {
  name: 'Lucas Wesley - Blog',
  description: 'Blog sobre programação, tecnologia e desenvolvimento de software. Artigos documentando meus estudos.',
  url: 'https://lucaswesley.dev',
  ogImage: 'https://lucaswesley.dev/og-image.jpg', // ⚠️ Imagem será criada no próximo passo
  author: {
    name: 'Lucas Wesley Moreira Tinta',
    linkedin: 'https://www.linkedin.com/in/lucaswesleey/',
    url: 'https://lucaswesley.dev',
    avatar: 'https://lucaswesley.dev/avatar.jpg' // ⚠️ Avatar será criado no próximo passo
  },
  keywords: [
    'programação',
    'desenvolvimento',
    'software',
    'javascript',
    'typescript',
    'node.js',
    'react',
    'next.js',
    'DDD',
    'domain-driven design',
    'inteligência artificial',
    'tecnologia'
  ]
}

// Gera meta tags otimizadas para páginas
export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image = siteConfig.ogImage,
  url = siteConfig.url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors = [siteConfig.author.name],
  category
}: {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  category?: string
}): Metadata {
  const fullTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`
  const allKeywords = [...siteConfig.keywords, ...keywords]

  const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: authors.map(name => ({ name })),
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ],
      other: [
        { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#1E3A8A' }
      ]
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      googleBot: 'index, follow'
    },
    alternates: {
      canonical: url,
      types: {
        'application/rss+xml': `${siteConfig.url}/feed.xml`
      }
    },
    openGraph: {
      type: type as any,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/jpeg'
        }
      ],
      locale: 'pt_BR',
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: authors,
        section: category,
        tags: allKeywords
      })
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          alt: title
        }
      ]
    },
    other: {
      'article:author': siteConfig.author.url,
      'article:publisher': siteConfig.url
    }
  }

  return metadata
}

// Gera structured data (JSON-LD) para artigos
export function generateArticleSchema({
  title,
  description,
  slug,
  publishedTime,
  modifiedTime,
  author = siteConfig.author.name,
  category,
  tags = [],
  readingTime,
  image = siteConfig.ogImage
}: {
  title: string
  description: string
  slug: string
  publishedTime: string
  modifiedTime?: string
  author?: string
  category?: string
  tags?: string[]
  readingTime?: number
  image?: string
}) {
  const url = `${siteConfig.url}/artigos/${slug}`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: [image],
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author,
      url: siteConfig.author.url,
      sameAs: [
        siteConfig.author.linkedin
      ].filter(Boolean)
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author.name,
      logo: {
        '@type': 'ImageObject',
        url: siteConfig.author.avatar
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    url,
    isPartOf: {
      '@type': 'Blog',
      name: siteConfig.name,
      url: siteConfig.url
    },
    inLanguage: 'pt-BR',
    about: category && {
      '@type': 'Thing',
      name: category
    },
    keywords: tags.join(', '),
    timeRequired: readingTime && `PT${readingTime}M`,
    wordCount: readingTime && Math.round(readingTime * 200), // 200 palavras por minuto
    isFamilyFriendly: true
  }
}

// Gera structured data para o website
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: 'pt-BR',
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.author.url
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/pesquisa?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

// Gera structured data para breadcrumbs
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

// Gera meta tags específicas para artigos
export function generateArticleMetadata(article: ArticleMetadata, readingTime?: number): Metadata {
  const url = `${siteConfig.url}/artigos/${article.slug}`
  const image = `${siteConfig.url}/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category || '')}`

  return generateSEOMetadata({
    title: article.title,
    description: article.description,
    keywords: article.tags || [],
    image,
    url,
    type: 'article',
    publishedTime: article.date,
    modifiedTime: article.date, // Adicionar campo de modificação nos artigos
    authors: [article.autor || siteConfig.author.name],
    category: article.category
  })
}



// Lista de páginas importantes para sitemap
export const staticPages = [
  {
    url: '/',
    changeFrequency: 'daily' as const,
    priority: 1.0,
    lastModified: new Date()
  },
  {
    url: '/contato',
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    lastModified: new Date()
  },
  {
    url: '/pesquisa',
    changeFrequency: 'weekly' as const,
    priority: 0.5,
    lastModified: new Date()
  }
] 