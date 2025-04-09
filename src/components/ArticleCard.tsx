import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ArticleMetadata } from '@/lib/api';

type ArticleCardProps = {
  metadata: ArticleMetadata;
};

export default function ArticleCard({ metadata }: ArticleCardProps) {
  return (
    <article className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <Link 
        href={`/artigos/${metadata.slug}`}
        className="block"
      >
        <div className="flex items-center mb-4">
          <span className="text-sm text-gray-500">
            {format(new Date(metadata.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-sm text-blue-600">{metadata.category}</span>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">{metadata.title}</h2>
        <p className="text-gray-600">{metadata.description}</p>
      </Link>
    </article>
  );
}