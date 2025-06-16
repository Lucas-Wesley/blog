import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

export interface NavigationLinks {
  previous?: {
    title: string
    url: string
  }
  next?: {
    title: string
    url: string
  }
}

// Cache para HTML processado
const markdownCache = new Map<string, { html: string, timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 10 // 10 minutos

function isMarkdownCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL
}

// Extrai links de navegação de forma otimizada
export function extractNavigationLinks(content: string): NavigationLinks {
  const navigationLinks: NavigationLinks = {}
  
  // Busca mais específica e otimizada
  const navigationMatch = content.match(/\+\+\+start\+\+\+([\s\S]*?)\+\+\+end\+\+\+/)
  
  if (!navigationMatch) return navigationLinks
  
  const navigationContent = navigationMatch[1]
  
  // Regex mais robusta para capturar links
  const previousMatch = navigationContent.match(/##\s+Anterior\s*\[(.*?)\]\((.*?)\)/i)
  if (previousMatch) {
    navigationLinks.previous = {
      title: previousMatch[1].trim(),
      url: previousMatch[2].trim()
    }
  }
  
  const nextMatch = navigationContent.match(/##\s+Próximo\s*\[(.*?)\]\((.*?)\)/i)
  if (nextMatch) {
    navigationLinks.next = {
      title: nextMatch[1].trim(),
      url: nextMatch[2].trim()
    }
  }
  
  return navigationLinks
}

// Remove seção de navegação do conteúdo
export function removeNavigationSection(content: string): string {
  return content.replace(/\+\+\+start\+\+\+[\s\S]*?\+\+\+end\+\+\+/g, '').trim()
}

// Processa markdown com cache
export async function processMarkdown(content: string, cacheKey?: string): Promise<string> {
  const key = cacheKey || `markdown-${Buffer.from(content).toString('base64').slice(0, 32)}`
  
  // Verifica cache
  const cached = markdownCache.get(key)
  if (cached && isMarkdownCacheValid(cached.timestamp)) {
    return cached.html
  }

  try {
    // Remove navegação antes de processar
    const cleanContent = removeNavigationSection(content)
    
    // Pipeline de processamento simplificado sem highlight (será aplicado no cliente)
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkRehype, { 
        allowDangerousHtml: true,
        clobberPrefix: 'user-content-' // Previne conflitos de ID
      })
      .use(rehypeRaw)
      .use(rehypeStringify, {
        allowDangerousHtml: true
      })
      .process(cleanContent)

    const html = processedContent.toString()
    
    // Armazena no cache
    markdownCache.set(key, {
      html,
      timestamp: Date.now()
    })
    
    return html
  } catch (error) {
    console.error('Erro ao processar markdown:', error)
    // Retorna conteúdo sem processar em caso de erro
    return `<div class="error">Erro ao processar conteúdo</div>`
  }
}

// Extrai resumo do artigo (primeiros N caracteres sem markdown)
export function extractSummary(content: string, maxLength: number = 200): string {
  // Remove markdown e HTML
  const cleanContent = removeNavigationSection(content)
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove code inline
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Remove links
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '') // Remove images
    .replace(/\n+/g, ' ') // Substitui quebras por espaços
    .trim()

  if (cleanContent.length <= maxLength) {
    return cleanContent
  }

  // Corta no espaço mais próximo para não quebrar palavras
  const truncated = cleanContent.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > maxLength * 0.8 
    ? truncated.slice(0, lastSpace) + '...'
    : truncated + '...'
}

// Extrai tempo estimado de leitura (baseado em 200 palavras por minuto)
export function getReadingTime(content: string): number {
  const cleanContent = removeNavigationSection(content)
  const wordCount = cleanContent.split(/\s+/).length
  const wordsPerMinute = 200
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return Math.max(1, minutes) // Mínimo 1 minuto
}

// Extrai todos os headers do conteúdo para criar índice
export function extractTableOfContents(content: string) {
  const cleanContent = removeNavigationSection(content)
  const headers: Array<{ level: number; title: string; id: string }> = []
  
  const headerRegex = /^(#{1,6})\s+(.+)$/gm
  let match
  
  while ((match = headerRegex.exec(cleanContent)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    
    headers.push({ level, title, id })
  }
  
  return headers
}

// Limpa cache do markdown
export function clearMarkdownCache(): void {
  markdownCache.clear()
}

// Obtém estatísticas do cache
export function getMarkdownCacheStats() {
  const entries = Array.from(markdownCache.values())
  const validEntries = entries.filter(entry => 
    isMarkdownCacheValid(entry.timestamp)
  )
  
  return {
    totalEntries: markdownCache.size,
    validEntries: validEntries.length,
    hitRate: validEntries.length / Math.max(1, markdownCache.size),
    memoryUsage: entries.reduce((sum, entry) => sum + entry.html.length, 0)
  }
} 