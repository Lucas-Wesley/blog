import { getArticleBySlug, getArticleSlugs } from '@/lib/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { remark } from 'remark';
import html from 'remark-html';

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({
    // Remove a extensão .md e divide o caminho em segmentos
    // Cada segmento é codificado para URL
    slug: slug
      .replace(/\.md$/, '')
      .split('/')
      .map(segment => encodeURIComponent(segment)),
  }));
}

export default async function Article({ params }: { params: { slug?: string[] } }) {
  // Se não houver slug, significa que estamos na raiz de /artigos
  if (!params.slug) {
    // Aqui você pode implementar a lógica para listar todos os artigos
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Artigos</h1>
        {/* Implementar listagem de artigos aqui */}
      </div>
    );
  }

  // Decodifica os segmentos da URL e junta o caminho do artigo
  const decodedSlug = params.slug.map(segment => decodeURIComponent(segment));
  const fullPath = `artigos/${decodedSlug.join('/')}.md`;
  const article = getArticleBySlug(fullPath);
  
  const processedContent = await remark()
    .use(html)
    .process(article.content);
  const contentHtml = processedContent.toString();

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{article.metadata.title}</h1>
        <div className="flex items-center text-gray-600">
          <time dateTime={article.metadata.date}>
            {format(new Date(article.metadata.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </time>
          <span className="mx-2">•</span>
          <span>{article.metadata.category}</span>
        </div>
      </header>
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }} 
      />
    </article>
  );
}