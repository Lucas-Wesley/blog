'use client';

import { useState, useCallback, useEffect } from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { INFINITE_SCROLL_CONFIG } from '@/config/infiniteScroll';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import type { ArticleMetadata } from '@/lib/api';

interface Article {
  metadata: ArticleMetadata;
  content: string;
}

interface InfiniteArticleListProps {
  initialArticles: Article[];
  totalArticles: number;
}

export default function InfiniteArticleList({ 
  initialArticles, 
  totalArticles 
}: InfiniteArticleListProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialArticles.length < totalArticles);
  const [currentPage, setCurrentPage] = useState(2); // Página 1 já foi carregada
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Garante que o componente só ative o infinite scroll após ser montado no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadMoreArticles = useCallback(async () => {
    if (isLoading || !hasMore || !isMounted) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/articles?page=${currentPage}&limit=${INFINITE_SCROLL_CONFIG.LOAD_MORE_LIMIT}`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao carregar artigos');
      }

      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        setArticles(prev => [...prev, ...data.articles]);
        setCurrentPage(prev => prev + 1);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError('Erro ao carregar mais artigos. Tente novamente.');
      console.error('Erro ao carregar artigos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, hasMore, isLoading, isMounted]);

  const { loadingRef } = useInfiniteScroll({
    hasMore: hasMore && isMounted,
    isLoading,
    onLoadMore: loadMoreArticles,
    rootMargin: INFINITE_SCROLL_CONFIG.ROOT_MARGIN,
    threshold: INFINITE_SCROLL_CONFIG.THRESHOLD,
    debounceMs: INFINITE_SCROLL_CONFIG.DEBOUNCE_MS,
  });

  return (
    <div>
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

      {/* Loading trigger e estados - só aparece após componente ser montado */}
      {isMounted && (
        <div ref={loadingRef} className="mt-8 flex justify-center">
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm">Carregando mais artigos...</span>
            </div>
          )}
          
          {error && (
            <div className="text-center">
              <p className="text-red-600 text-sm mb-2">{error}</p>
              <button 
                onClick={loadMoreArticles}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Tentar novamente
              </button>
            </div>
          )}
          
          {!hasMore && !isLoading && articles.length > 0 && (
            <div className="text-center text-gray-500 text-sm">
              <p>Você viu todos os {articles.length} artigos! 🎉</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 