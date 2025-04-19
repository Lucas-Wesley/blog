import { getArticleBySlug, getArticleSlugs } from '@/lib/api'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

interface NavigationLinks {
  previous?: {
    title: string
    url: string
  }
  next?: {
    title: string
    url: string
  }
}

function extractNavigationLinks(content: string): NavigationLinks {
  const navigationLinks: NavigationLinks = {}
  const navigationMatch = content.match(/\+\+\+start\+\+\+([\s\S]*?)\+\+\+end\+\+\+/)
  
  if (navigationMatch) {
    const navigationContent = navigationMatch[1]
    
    const previousMatch = navigationContent.match(/## Anterior\s*\[(.*?)\]\((.*?)\)/)
    if (previousMatch) {
      navigationLinks.previous = {
        title: previousMatch[1],
        url: previousMatch[2]
      }
    }
    
    const nextMatch = navigationContent.match(/## Próximo\s*\[(.*?)\]\((.*?)\)/)
    if (nextMatch) {
      navigationLinks.next = {
        title: nextMatch[1],
        url: nextMatch[2]
      }
    }
  }
  
  return navigationLinks
}

export async function generateStaticParams() {
  const slugs = getArticleSlugs()
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, '').split('/')
  }))
}

export default async function Article({ params }: { params: { slug?: string[] } }) {
  if (!params.slug) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
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

  // Remove a seção de navegação do conteúdo
  const contentWithoutNavigation = article.content.replace(/\+\+\+start\+\+\+[\s\S]*?\+\+\+end\+\+\+/g, '')

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(contentWithoutNavigation)

  const contentHtml = processedContent.toString()
  const navigationLinks = extractNavigationLinks(article.content)

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
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {article.metadata.title || 'Sem título'}
        </h1>
        <div className="flex items-center text-gray-600">
          <time dateTime={article.metadata.date}>
            {formatDate(article.metadata.date)}
          </time>
          <span className="mx-2">•</span>
          <span>{article.metadata.category || 'Sem categoria'}</span>
        </div>
      </header>

      <div 
        className="prose prose-lg max-w-none text-lg conteudo-blog"
        dangerouslySetInnerHTML={{ __html: contentHtml }} 
      />
      
      {(navigationLinks.previous || navigationLinks.next) && (
        <nav className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {navigationLinks.previous && (
            <a
              href={navigationLinks.previous.url}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="block text-sm text-gray-500">Anterior</span>
              <span className="block font-medium mt-1">
                {navigationLinks.previous.title}
              </span>
            </a>
          )}
          {navigationLinks.next && (
            <a
              href={navigationLinks.next.url}
              className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                !navigationLinks.previous ? 'md:col-start-2' : ''
              }`}
            >
              <span className="block text-sm text-gray-500">Próximo</span>
              <span className="block font-medium mt-1">
                {navigationLinks.next.title}
              </span>
            </a>
          )}
        </nav>
      )}
    </article>
  )
}