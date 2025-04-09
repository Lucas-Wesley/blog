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
      if (fs.statSync(filePath).isDirectory()) {
        getAllFiles(filePath);
      } else if (path.extname(file) === '.md') {
        allFiles.push(filePath);
      }
    });
  }
  
  getAllFiles(articlesDirectory);
  return allFiles;
}

export function getArticleBySlug(slug: string) {
  const fullPath = slug;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const articleData: ArticleMetadata = {
    slug: slug.replace(articlesDirectory, '').replace(/\.md$/, ''),
    title: data.title,
    date: data.date,
    status: data.status,
    description: data.description,
    category: data.category,
  };

  console.log(articleData.slug)

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
  articles = articles.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());

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
    const date = new Date(article.metadata.date);
    if (year && month) {
      return date.getFullYear() === year && date.getMonth() === month - 1;
    }
    if (year) {
      return date.getFullYear() === year;
    }
    return true;
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