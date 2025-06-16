import { getAllArticles, getAllCategories, type ArticleMetadata } from '@/lib/api';
import { generateSEOMetadata, StructuredData, generateBreadcrumbSchema } from '@/lib/seo';
import { getReadingTime } from '@/lib/markdown';
import BlogStats from '@/components/BlogStats';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Lucas Wesley - Blog',
  description: 'Blog sobre programação, tecnologia e desenvolvimento de software. Artigos sobre DDD, Domain-Driven Design, Node.js, JavaScript, TypeScript, IA e muito mais.',
  keywords: ['blog', 'programação', 'tecnologia', 'tutoriais', 'artigos técnicos']
});

export default function Home() {
  const articles = getAllArticles({ 
    limit: 20, 
    includeContent: false // Não precisa do conteúdo completo na listagem
  });
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
            📝 Compartilhando meus estudos. Se te servir, aproveite!
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

      {/* Artigos mais recentes */}
      <section>
        <h2 className="text-2xl sm:text-xl font-bold mb-6">Artigos Mais Recentes</h2>
        
        {articles.length === 0 ? (
          <p className="text-center text-gray-600 text-base sm:text-sm">
            Nenhum artigo publicado ainda.
          </p>
        ) : (
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
        )}
      </section>
    </main>
    </>
  );
}