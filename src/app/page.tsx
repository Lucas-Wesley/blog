import { getAllArticles, getAllCategories } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';

export default function Home() {
  const articles = getAllArticles({ limit: 6 });
  const categories = getAllCategories();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
        
        {/* Barra de pesquisa */}
        <form 
          action="/pesquisa" 
          className="max-w-2xl mx-auto mb-8"
        >
          <input
            type="search"
            name="q"
            placeholder="Pesquisar artigos..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {/* Lista de categorias */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/categoria/${encodeURIComponent(category.toLowerCase())}`}
              className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      {/* Artigos mais recentes */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Artigos Mais Recentes</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard 
              key={article.metadata.slug} 
              metadata={article.metadata} 
            />
          ))}
        </div>
      </section>

      {articles.length === 0 && (
        <p className="text-center text-gray-600">
          Nenhum artigo publicado ainda.
        </p>
      )}
    </main>
  );
}