import { getAllArticles } from '@/lib/api';
import { INFINITE_SCROLL_CONFIG } from '@/config/infiniteScroll';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || INFINITE_SCROLL_CONFIG.LOAD_MORE_LIMIT.toString());
    const skip = (page - 1) * limit;

    // Buscar artigos com paginação
    const allArticles = getAllArticles({ 
      status: 'published',
      includeContent: false 
    });

    // Aplicar paginação
    const paginatedArticles = allArticles.slice(skip, skip + limit);
    const hasMore = skip + limit < allArticles.length;

    return NextResponse.json({
      articles: paginatedArticles,
      hasMore,
      totalArticles: allArticles.length,
      currentPage: page,
      totalPages: Math.ceil(allArticles.length / limit)
    });

  } catch (error) {
    console.error('Erro ao carregar artigos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 