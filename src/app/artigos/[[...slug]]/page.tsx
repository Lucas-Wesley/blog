import { getArticleBySlug, getArticleSlugs } from '@/lib/api';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { remark } from 'remark';
import html from 'remark-html';

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, '').split('/'),
  }));
}

export default async function Article({ params }: { params: { slug?: string[] } }) {
  // Se não houver slug, significa que estamos na raiz de /artigos
  if (!params.slug) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Artigos</h1>
        {/* Implementar listagem de artigos aqui */}
      </div>
    );
  }

  // Junta o caminho do artigo com os segmentos do slug
  const decodedSlug = params.slug.map(segment => decodeURIComponent(segment));
  const fullPath = `${decodedSlug.join('/')}.md`;
  const article = getArticleBySlug(fullPath);
  
  const processedContent = await remark()
    .use(html)
    .process(article.content);
  const contentHtml = processedContent.toString();

  // Função auxiliar para formatar a data com tratamento de erro
  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return 'Data não disponível';
      
      // Tenta parsear a data
      const date = parseISO(dateStr);
      return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      console.error(`Error formatting date: ${dateStr}`, error);
      return 'Data não disponível';
    }
  };

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{article.metadata.title || 'Sem título'}</h1>
        <div className="flex items-center text-gray-600">
          <time dateTime={article.metadata.date}>
            {formatDate(article.metadata.date)}
          </time>
          <span className="mx-2">•</span>
          <span>{article.metadata.category || 'Sem categoria'}</span>
        </div>
      </header>
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }} 
      />
    </article>
  );
}