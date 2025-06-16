import { getBlogStats } from '@/lib/api'

export default function BlogStats() {
  const stats = getBlogStats()

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{stats.publishedArticles}</div>
          <div className="text-sm text-gray-600">Artigos</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">{stats.categories}</div>
          <div className="text-sm text-gray-600">Categorias</div>
        </div>
        
        {stats.draftArticles > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{stats.draftArticles}</div>
            <div className="text-sm text-gray-600">Rascunhos</div>
          </div>
        )}
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-purple-600">📚</div>
          <div className="text-sm text-gray-600">Blog Ativo</div>
        </div>
      </div>
    </div>
  )
} 