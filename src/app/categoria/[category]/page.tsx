import { getAllArticles, getAllCategories } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: encodeURIComponent(category.toLowerCase()),
  }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const decodedCategory = decodeURIComponent(params.category);
  const articles = getAllArticles({ category: decodedCategory });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 capitalize">
        Categoria: {decodedCategory}
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
          Nenhum artigo encontrado nesta categoria.
        </p>
      )}
    </main>
  );
}