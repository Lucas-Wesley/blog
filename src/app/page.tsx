import { getAllArticles, getAllCategories, type ArticleMetadata } from '@/lib/api';
import { generateSEOMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import { StructuredData } from '@/components/StructuredData';
import InfiniteArticleList from '@/components/InfiniteArticleList';
import SimpleArticleList from '@/components/SimpleArticleList';
import ClientOnly from '@/components/ClientOnly';
import { INFINITE_SCROLL_CONFIG } from '@/config/infiniteScroll';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Lucas Wesley - Blog',
  description: 'Blog sobre programação, tecnologia e desenvolvimento de software. Artigos sobre DDD, Domain-Driven Design, Node.js, JavaScript, TypeScript, IA e muito mais.',
  keywords: ['blog', 'programação', 'tecnologia', 'tutoriais', 'artigos técnicos']
});

export default function Home() {
  // Carregar os primeiros artigos no servidor (SSR)
  const initialArticles = getAllArticles({ 
    limit: INFINITE_SCROLL_CONFIG.INITIAL_ARTICLES_LIMIT,
    includeContent: false
  });
  
  // Carregar total de artigos para o infinite scroll
  const totalArticles = getAllArticles({ 
    includeContent: false 
  }).length;
  
  const categories = getAllCategories();

  // Breadcrumb para homepage
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://lucaswesley.dev' }
  ])

  return (
    <>
      {/* Structured Data para Breadcrumbs */}
      <StructuredData data={breadcrumbSchema} />
      
      <main className="container mx-auto px-4 py-4">
        <div className="mb-12">
          <div className="bg-blue-100 p-4 rounded-lg mb-5">
            <p className="text-neutral-800 text-left text-base sm:text-sm">
              📝 Compartilhando meus estudos. Escrito a mão todos os artigos.
            </p>
          </div>
          
          {/* Barra de pesquisa */}
          <form 
            action="/pesquisa" 
            className="max-w-2xl mx-auto mb-5"
          >
            <input
              type="search"
              name="q"
              placeholder="Pesquisar artigos..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          {/* Lista de categorias */}
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/categoria/${encodeURIComponent(category.toLowerCase())}`}
                className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-base sm:text-sm"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Artigos mais recentes com infinite scroll */}
        <section>
          <h2 className="text-2xl sm:text-xl font-bold mb-6">
            Artigos Mais Recentes
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({totalArticles} artigos)
            </span>
          </h2>
          
          {initialArticles.length === 0 ? (
            <p className="text-center text-gray-600 text-base sm:text-sm">
              Nenhum artigo publicado ainda.
            </p>
          ) : (
            <ClientOnly 
              fallback={<SimpleArticleList articles={initialArticles} />}
            >
              <InfiniteArticleList 
                initialArticles={initialArticles}
                totalArticles={totalArticles}
              />
            </ClientOnly>
          )}
        </section>
      </main>
    </>
  );
}