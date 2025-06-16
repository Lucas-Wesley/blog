import { getArticleBySlug, getArticleSlugs } from '@/lib/api'
import { 
  processMarkdown, 
  extractNavigationLinks, 
  getReadingTime,
  type NavigationLinks 
} from '@/lib/markdown'
import { 
  generateArticleMetadata,
  generateArticleSchema,
  generateBreadcrumbSchema,
  StructuredData 
} from '@/lib/seo'
import MarkdownContent from '@/components/MarkdownContent'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const slugs = getArticleSlugs()
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, '').split('/')
  }))
}

export async function generateMetadata({ params }: { params: { slug?: string[] } }): Promise<Metadata> {
  // Se não houver slug, retorna o título padrão
  if (!params.slug) {
    return {
      title: 'Artigos | Lucas Wesley - Blog',
      description: 'Todos os artigos sobre programação, tecnologia e desenvolvimento de software.'
    }
  }

  const decodedSlug = params.slug.map(segment => decodeURIComponent(segment))
  const fullPath = `${decodedSlug.join('/')}.md`
  const article = getArticleBySlug(fullPath)

  // Se não encontrar o artigo, retorna título padrão
  if (!article) {
    return {
      title: 'Artigo não encontrado | Lucas Wesley - Blog',
      description: 'O artigo solicitado não foi encontrado.'
    }
  }

  // Usa o sistema SEO otimizado
  const readingTime = getReadingTime(article.content)
  return generateArticleMetadata(article.metadata, readingTime)
}

export default async function Article({ params }: { params: { slug?: string[] } }) {
  if (!params.slug) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-4xl font-bold mb-8">Artigos</h1>
      </div>
    )
  }

  const decodedSlug = params.slug.map(segment => decodeURIComponent(segment))
  const fullPath = `${decodedSlug.join('/')}.md`
  const article = getArticleBySlug(fullPath)

  // Se não for um arquivo markdown, retorna null
  if (!article) {
    return null;
  }

  // Processa o markdown com cache e extrai informações
  const contentHtml = await processMarkdown(article.content, `article-${article.metadata.slug}`)
  const navigationLinks = extractNavigationLinks(article.content)
  const readingTime = getReadingTime(article.content)

  // Gera structured data para o artigo
  const articleSchema = generateArticleSchema({
    title: article.metadata.title,
    description: article.metadata.description,
    slug: article.metadata.slug,
    publishedTime: article.metadata.date,
    modifiedTime: article.metadata.date,
    author: article.metadata.autor,
    category: article.metadata.category,
    tags: article.metadata.tags,
    readingTime
  })

  // Gera breadcrumbs
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://lucaswesley.dev' },
    { name: 'Artigos', url: 'https://lucaswesley.dev/artigos' },
    { name: article.metadata.title, url: `https://lucaswesley.dev/artigos/${article.metadata.slug}` }
  ])

  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return 'Data não disponível'
      const date = parseISO(dateStr)
      return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch (error) {
      console.error(`Error formatting date: ${dateStr}`, error)
      return 'Data não disponível'
    }
  }

  return (
    <>
      {/* Structured Data para Artigo */}
      <StructuredData data={articleSchema} />
      
      {/* Structured Data para Breadcrumbs */}
      <StructuredData data={breadcrumbSchema} />
      
      <article className="container mx-auto px-4 py-8 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl md:text-3xl sm:text-2xl font-bold mb-4">
          {article.metadata.title || 'Sem título'}
        </h1>
        <div className="flex items-center text-gray-600 text-base sm:text-sm">
          <time dateTime={article.metadata.date}>
            {formatDate(article.metadata.date)}
          </time>
          <span className="mx-2">•</span>
          <span>{article.metadata.category || 'Sem categoria'}</span>
          <span className="mx-2">•</span>
          <span>{readingTime} min de leitura</span>
        </div>
      </header>

      <MarkdownContent 
        html={contentHtml}
        className="prose prose-lg sm:prose-base max-w-none text-lg sm:text-base conteudo-blog"
      />
      
      {(navigationLinks.previous || navigationLinks.next) && (
        <nav className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {navigationLinks.previous && (
            <a
              href={navigationLinks.previous.url}
              className="group p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ease-in-out relative overflow-hidden"
            >
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-2 font-medium">← Anterior</span>
                <span className="text-lg sm:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {navigationLinks.previous.title}
                </span>
              </div>
            </a>
          )}
          {navigationLinks.next && (
            <a
              href={navigationLinks.next.url}
              className={`group p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ease-in-out relative overflow-hidden ${
                !navigationLinks.previous ? 'md:col-start-2' : ''
              }`}
            >
              <div className="flex flex-col text-right">
                <span className="text-sm text-gray-500 mb-2 font-medium">Próximo →</span>
                <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {navigationLinks.next.title}
                </span>
              </div>
            </a>
                  )}
      </nav>
    )}
  </article>
  </>
  )
}