'use client';

import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
  debounceMs?: number;
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = '100px',
  threshold = 0.1,
  debounceMs = 200,
}: UseInfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  // Atualiza a referência da função sem causar re-render
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const element = loadingRef.current;
    if (!element || typeof window === 'undefined') return;

    // Limpa observer anterior se existir
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting && hasMore && !isLoading) {
        // Limpa debounce anterior se existir
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        // Aplica debounce para evitar chamadas múltiplas
        debounceRef.current = setTimeout(() => {
          onLoadMoreRef.current();
        }, debounceMs);
      }
    };

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin,
      threshold,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [hasMore, isLoading, rootMargin, threshold, debounceMs]);

  return { loadingRef };
} 