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
};

export function getArticleSlugs() {
  const allFiles: string[] = [];
  
  function getAllFiles(dirPath: string) {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const relativePath = path.relative(articlesDirectory, filePath)
        .split(path.sep)
        .join('/'); // Normaliza separadores para forward slash
      
      if (fs.statSync(filePath).isDirectory()) {
        getAllFiles(filePath);
      } else if (path.extname(file) === '.md') {
        allFiles.push(relativePath);
      }
    });
  }
  
  getAllFiles(articlesDirectory);
  return allFiles;
}

export function getArticleBySlug(slug: string) {
  const fullPath = path.join(articlesDirectory, slug);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // Tenta extrair o título do conteúdo Markdown se não houver nos metadados
  let title = data.title;
  if (!title) {
    // Procura por um cabeçalho H1 (#) no conteúdo
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      title = h1Match[1].trim();
    }
  }

  // Tenta extrair a categoria do caminho do arquivo se não houver nos metadados
  let category = data.category;
  if (!category) {
    const pathParts = slug.split('/');
    if (pathParts.length > 1) {
      category = pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1);
    }
  }
  
  // Garante valores padrão para todos os campos
  const articleData: ArticleMetadata = {
    slug: slug.replace(/\.md$/, ''),
    title: title || 'Sem título',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    status: data.status || 'published',
    description: data.description || '',
    category: category || 'Sem categoria',
  };

  return {
    metadata: articleData,
    content,
  };
}

export function getAllArticles(options?: {
  status?: 'published' | 'draft' | 'disabled';
  category?: string;
  limit?: number;
}) {
  const slugs = getArticleSlugs();
  let articles = slugs.map((slug) => getArticleBySlug(slug));

  // Filtrar por status
  if (options?.status) {
    articles = articles.filter((article) => article.metadata.status === options.status);
  } else {
    // Por padrão, mostrar apenas artigos publicados
    articles = articles.filter((article) => article.metadata.status === 'published');
  }

  // Filtrar por categoria
  if (options?.category) {
    articles = articles.filter((article) => article.metadata.category === options.category);
  }

  // Ordenar por data (mais recentes primeiro)
  articles = articles.sort((a, b) => {
    try {
      return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
    } catch (error) {
      console.error('Error sorting articles by date:', error);
      return 0;
    }
  });

  // Limitar número de artigos
  if (options?.limit) {
    articles = articles.slice(0, options.limit);
  }

  return articles;
}

// Obter todas as categorias disponíveis
export function getAllCategories(): string[] {
  const articles = getAllArticles();
  const categories = new Set(articles.map((article) => article.metadata.category));
  return Array.from(categories).sort();
}

// Obter artigos relacionados (mesma categoria)
export function getRelatedArticles(currentSlug: string, limit: number = 3) {
  const currentArticle = getArticleBySlug(currentSlug);
  const articles = getAllArticles({
    category: currentArticle.metadata.category,
  }).filter((article) => article.metadata.slug !== currentArticle.metadata.slug);
  
  return articles.slice(0, limit);
}

// Obter artigos por ano/mês
export function getArticlesByDate(year?: number, month?: number) {
  const articles = getAllArticles();
  
  return articles.filter((article) => {
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
      console.error('Error filtering articles by date:', error);
      return false;
    }
  });
}

// Pesquisar artigos
export function searchArticles(query: string) {
  const articles = getAllArticles();
  const searchTerm = query.toLowerCase();
  
  return articles.filter((article) => {
    const searchableText = `
      ${article.metadata.title}
      ${article.metadata.description}
      ${article.metadata.category}
      ${article.content}
    `.toLowerCase();
    
    return searchableText.includes(searchTerm);
  });
}