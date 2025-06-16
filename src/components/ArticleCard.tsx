import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ArticleMetadata } from '@/lib/api';

type ArticleCardProps = {
  metadata: ArticleMetadata;
  readingTime?: number;
  showTags?: boolean;
};

export default function ArticleCard({ 
  metadata, 
  readingTime, 
  showTags = false 
}: ArticleCardProps) {
  return (
    <article className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <Link 
        href={`/artigos/${metadata.slug}`}
        className="block"
      >
        <div className="flex items-center mb-4 flex-wrap gap-2">
          <span className="text-sm sm:text-xs text-gray-500">
            {format(new Date(metadata.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-sm sm:text-xs text-blue-600">{metadata.category}</span>
          {readingTime && (
            <>
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-sm sm:text-xs text-gray-500">{readingTime} min</span>
            </>
          )}
        </div>
        
        <h2 className="text-xl sm:text-lg font-bold mb-2 text-gray-900">{metadata.title}</h2>
        <p className="text-gray-600 text-base sm:text-sm mb-3">{metadata.description}</p>
        
        {showTags && metadata.tags && metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metadata.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {metadata.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{metadata.tags.length - 3} mais
              </span>
            )}
          </div>
        )}
      </Link>
    </article>
  );
}