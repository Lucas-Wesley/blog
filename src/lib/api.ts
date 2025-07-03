import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'artigos');

export type ArticleMetadata = {
  title: string;
  date: string;
  status: 'draft' | 'published' | 'disabled';
  description: string;
  slug: string;
  category: string;
  tags?: string[];
  autor?: string;
};

// Cache para melhorar performance
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutos em desenvolvimento

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Função otimizada para buscar slugs com cache
export function getArticleSlugs(): string[] {
  const cacheKey = 'article-slugs';
  const cached = getCachedData<string[]>(cacheKey);
  
  if (cached) {
    return cached;
  }

  const allFiles: string[] = [];
  
  function getAllFiles(dirPath: string) {
    try {
      const files = fs.readdirSync(dirPath);
      
      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const relativePath = path.relative(articlesDirectory, filePath)
          .split(path.sep)
          .join('/');
        
        if (fs.statSync(filePath).isDirectory()) {
          getAllFiles(filePath);
        } else if (path.extname(file) === '.md' && !relativePath.includes('/imagens/')) {
          allFiles.push(relativePath);
        }
      });
    } catch (error) {
      console.error(`Erro ao ler diretório ${dirPath}:`, error);
    }
  }
  
  getAllFiles(articlesDirectory);
  setCachedData(cacheKey, allFiles);
  return allFiles;
}

// Função para buscar apenas slugs de artigos publicados
export function getPublishedArticleSlugs(): string[] {
  const cacheKey = 'published-article-slugs';
  const cached = getCachedData<string[]>(cacheKey);
  
  if (cached) {
    return cached;
  }

  const allSlugs = getArticleSlugs();
  const publishedSlugs = allSlugs.filter(slug => {
    const article = getArticleBySlug(slug);
    return article && article.metadata.status === 'published';
  });
  
  setCachedData(cacheKey, publishedSlugs);
  return publishedSlugs;
}

// Função de validação e normalização de metadados
function validateAndNormalizeMetadata(data: any, slug: string, content: string): ArticleMetadata {
  // Extrai título do conteúdo se não existir nos metadados
  let title = data.title;
  if (!title) {
    const h1Match = content.match(/^#\s+(.+)$/m);
    title = h1Match ? h1Match[1].trim() : 'Sem título';
  }

  // Extrai categoria do caminho se não existir
  let category = data.category;
  if (!category) {
    const pathParts = slug.split('/');
    category = pathParts.length > 1 
      ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1)
      : 'Sem categoria';
  }

  // Normaliza data
  let date: string;
  try {
    date = data.date ? new Date(data.date).toISOString() : new Date().toISOString();
  } catch (error) {
    console.warn(`Data inválida para ${slug}:`, data.date);
    date = new Date().toISOString();
  }

  // Valida status
  const validStatuses = ['draft', 'published', 'disabled'] as const;
  const status = validStatuses.includes(data.status) ? data.status : 'published';

  // Normaliza tags
  const tags = Array.isArray(data.tags) ? data.tags : [];

  return {
    slug: slug.replace(/\.md$/, ''),
    title,
    date,
    status,
    description: data.description || '',
    category,
    tags,
    autor: data.autor || 'Lucas Wesley Moreira Tinta',
  };
}

export function getArticleBySlug(slug: string): { metadata: ArticleMetadata, content: string } | null {
  // Verifica se é um arquivo Markdown válido
  if (!slug.endsWith('.md') || slug.includes('/imagens/')) {
    return null;
  }

  const cacheKey = `article-${slug}`;
  const cached = getCachedData<{ metadata: ArticleMetadata, content: string }>(cacheKey);
  
  if (cached) {
    return cached;
  }

  const fullPath = path.join(articlesDirectory, slug);
  
  // Verifica se o arquivo existe
  if (!fs.existsSync(fullPath)) {
    console.error(`Arquivo não encontrado: ${fullPath}`);
    return null;
  }

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const metadata = validateAndNormalizeMetadata(data, slug, content);
    
    const result = {
      metadata,
      content,
    };
    
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`Erro ao processar artigo ${slug}:`, error);
    return null;
  }
}

export function getAllArticles(options?: {
  category?: string;
  limit?: number;
  status?: 'published' | 'draft' | 'disabled';
  includeContent?: boolean;
}): { metadata: ArticleMetadata, content: string }[] {
  const cacheKey = `all-articles-${JSON.stringify(options)}`;
  const cached = getCachedData<{ metadata: ArticleMetadata, content: string }[]>(cacheKey);
  
  if (cached) {
    return cached;
  }

  const slugs = getArticleSlugs();
  let articles = slugs
    .map((slug) => getArticleBySlug(slug))
    .filter((article): article is NonNullable<typeof article> => article !== null);

  // Filtrar por status
  if (options?.status) {
    articles = articles.filter((article) => article.metadata.status === options.status);
  } else {
    // Por padrão, mostrar apenas artigos publicados
    articles = articles.filter((article) => article.metadata.status === 'published');
  }

  // Filtrar por categoria - comparação case insensitive
  if (options?.category) {
    articles = articles.filter((article) => 
      article.metadata.category.toLowerCase() === (options.category?.toLowerCase() ?? '')
    );
  }

  // Ordenar por data (mais recentes primeiro)
  articles = articles.sort((a, b) => {
    try {
      return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
    } catch (error) {
      console.error('Erro ao ordenar artigos por data:', error);
      return 0;
    }
  });

  // Limitar número de artigos
  if (options?.limit) {
    articles = articles.slice(0, options.limit);
  }

  // Remove conteúdo se não solicitado para economizar memória
  if (!options?.includeContent) {
    articles = articles.map(article => ({
      ...article,
      content: '', // Remove conteúdo para listagens
    }));
  }

  setCachedData(cacheKey, articles);
  return articles;
}

// Obter todas as categorias disponíveis com cache
export function getAllCategories(): string[] {
  const cacheKey = 'all-categories';
  const cached = getCachedData<string[]>(cacheKey);
  
  if (cached) {
    return cached;
  }

  const articles = getAllArticles({ status: 'published', includeContent: false });
  const categories = new Set(
    articles
      .map((article) => article.metadata.category)
      .filter((category) => category && category !== 'Sem categoria') // Filtra categorias inválidas
  );
  const result = Array.from(categories).sort();
  
  setCachedData(cacheKey, result);
  return result;
}

// Função para limpar cache específico das categorias
export function clearCategoriesCache(): void {
  cache.delete('all-categories');
}

// Função para forçar atualização das categorias (limpa cache e recria)
export function refreshCategories(): string[] {
  clearCategoriesCache();
  return getAllCategories();
}

// Obter artigos relacionados otimizado
export function getRelatedArticles(currentSlug: string, limit: number = 3) {
  const currentArticle = getArticleBySlug(currentSlug);
  if (!currentArticle) return [];

  const articles = getAllArticles({
    category: currentArticle.metadata.category,
    includeContent: false
  }).filter((article) => article.metadata.slug !== currentArticle.metadata.slug);
  
  return articles.slice(0, limit);
}

// Obter artigos por ano/mês otimizado
export function getArticlesByDate(year?: number, month?: number): { metadata: ArticleMetadata, content: string }[] {
  const cacheKey = `articles-by-date-${year}-${month}`;
  const cached = getCachedData<{ metadata: ArticleMetadata, content: string }[]>(cacheKey);
  
  if (cached) {
    return cached;
  }

  const articles = getAllArticles({ includeContent: false });
  
  const result = articles.filter((article) => {
    try {
      const date = new Date(article.metadata.date);
      if (year && month) {
        return date.getFullYear() === year && date.getMonth() === month - 1;
      }
      if (year) {
        return date.getFullYear() === year;
      }
      return true;
    } catch (error) {
      console.error('Erro ao filtrar artigos por data:', error);
      return false;
    }
  });

  setCachedData(cacheKey, result);
  return result;
}

// Pesquisar artigos otimizado
export function searchArticles(query: string): { metadata: ArticleMetadata, content: string }[] {
  if (!query.trim()) return [];

  const cacheKey = `search-${query.toLowerCase()}`;
  const cached = getCachedData<{ metadata: ArticleMetadata, content: string }[]>(cacheKey);
  
  if (cached) {
    return cached;
  }

  const articles = getAllArticles({ includeContent: true });
  const searchTerm = query.toLowerCase().trim();
  
  const result = articles.filter((article) => {
    // Busca ponderada: título e descrição têm mais peso
    const titleMatch = article.metadata.title.toLowerCase().includes(searchTerm);
    const descriptionMatch = article.metadata.description.toLowerCase().includes(searchTerm);
    const categoryMatch = article.metadata.category.toLowerCase().includes(searchTerm);
    const contentMatch = article.content.toLowerCase().includes(searchTerm);
    const tagMatch = article.metadata.tags?.some(tag => 
      tag.toLowerCase().includes(searchTerm)
    );
    
    return titleMatch || descriptionMatch || categoryMatch || contentMatch || tagMatch;
  }).sort((a, b) => {
    // Ordena por relevância: título > descrição > categoria > tags > conteúdo
    const aScore = (
      (a.metadata.title.toLowerCase().includes(searchTerm) ? 100 : 0) +
      (a.metadata.description.toLowerCase().includes(searchTerm) ? 50 : 0) +
      (a.metadata.category.toLowerCase().includes(searchTerm) ? 25 : 0) +
      (a.metadata.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ? 10 : 0)
    );
    
    const bScore = (
      (b.metadata.title.toLowerCase().includes(searchTerm) ? 100 : 0) +
      (b.metadata.description.toLowerCase().includes(searchTerm) ? 50 : 0) +
      (b.metadata.category.toLowerCase().includes(searchTerm) ? 25 : 0) +
      (b.metadata.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ? 10 : 0)
    );
    
    return bScore - aScore;
  });

  setCachedData(cacheKey, result);
  return result;
}

// Função para limpar cache manualmente (útil em desenvolvimento)
export function clearCache(): void {
  cache.clear();
}

// Função para obter estatísticas do blog
export function getBlogStats(): {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  categories: number;
  lastUpdated: string | null;
} {
  const cacheKey = 'blog-stats';
  const cached = getCachedData<{
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    categories: number;
    lastUpdated: string | null;
  }>(cacheKey);
  
  if (cached) {
    return cached;
  }

  // Obter todos os artigos (incluindo drafts) para estatísticas internas
  const publishedArticles = getAllArticles({ status: 'published', includeContent: false });
  const draftArticles = getAllArticles({ status: 'draft', includeContent: false });
  const categories = getAllCategories();
  
  const result = {
    totalArticles: publishedArticles.length + draftArticles.length,
    publishedArticles: publishedArticles.length,
    draftArticles: draftArticles.length,
    categories: categories.length,
    lastUpdated: publishedArticles.length > 0 ? publishedArticles[0].metadata.date : null,
  };

  setCachedData(cacheKey, result);
  return result;
}