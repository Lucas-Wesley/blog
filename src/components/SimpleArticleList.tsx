import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import type { ArticleMetadata } from '@/lib/api';

interface Article {
  metadata: ArticleMetadata;
  content: string;
}

interface SimpleArticleListProps {
  articles: Article[];
}

/**
 * Lista simples de artigos sem infinite scroll
 * Usado como fallback durante a hidratação
 */
export default function SimpleArticleList({ articles }: SimpleArticleListProps) {
  return (
    <ul className="space-y-6 divide-y divide-gray-200">
      {articles.map((article) => (
        <li key={article.metadata.slug} className="pt-3 first:pt-0">
          <article className="hover:bg-gray-50 rounded-lg transition-colors">
            <Link 
              href={`/artigos/${article.metadata.slug}`}
              className="block"
            >
              <div className="flex items-center mb-0">
                <span className="text-sm text-gray-500">
                  {format(new Date(article.metadata.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </span>
                <span className="mx-2 text-gray-500">•</span>
                <span className="text-sm text-blue-600">{article.metadata.category}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{article.metadata.title}</h3>
              <p className="text-gray-600">{article.metadata.description}</p>
            </Link>
          </article>
        </li>
      ))}
    </ul>
  );
} 