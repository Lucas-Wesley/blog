import { searchArticles } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q || '';
  const articles = query ? searchArticles(query) : [];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        Resultados para: {query}
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard
            key={article.metadata.slug}
            metadata={article.metadata}
          />
        ))}
      </div>

      {articles.length === 0 && (
        <p className="text-center text-gray-600">
          Nenhum artigo encontrado para sua pesquisa.
        </p>
      )}
    </main>
  );
}