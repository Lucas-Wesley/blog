import { getAllArticles, getAllCategories } from '@/lib/api'
import { staticPages } from '@/lib/seo'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://lucaswesley.dev' // Atualizar com URL real

  // Páginas estáticas
  const staticRoutes = staticPages.map(page => ({
    url: `${baseUrl}${page.url}`,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority
  }))

  // Artigos publicados
  const articles = getAllArticles({ 
    status: 'published',
    includeContent: false 
  })
  
  const articleRoutes = articles.map(article => ({
    url: `${baseUrl}/artigos/${article.metadata.slug}`,
    lastModified: new Date(article.metadata.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))

  // Categorias
  const categories = getAllCategories()
  const categoryRoutes = categories.map(category => ({
    url: `${baseUrl}/categoria/${encodeURIComponent(category.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6
  }))

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...categoryRoutes
  ]
} 