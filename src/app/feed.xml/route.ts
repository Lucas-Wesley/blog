import { getAllArticles } from '@/lib/api'
import { siteConfig } from '@/lib/seo'

export async function GET() {
  const articles = getAllArticles({ 
    status: 'published',
    includeContent: false,
    limit: 50 
  })

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <description>${siteConfig.description}</description>
    <link>${siteConfig.url}</link>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml" />
    <language>pt-BR</language>
    <managingEditor>${siteConfig.author.name}</managingEditor>
    <webMaster>${siteConfig.author.name}</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <generator>Next.js</generator>
    <image>
      <url>${siteConfig.ogImage}</url>
      <title>${siteConfig.name}</title>
      <link>${siteConfig.url}</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${articles
      .map(article => `
    <item>
      <title><![CDATA[${article.metadata.title}]]></title>
      <description><![CDATA[${article.metadata.description}]]></description>
      <link>${siteConfig.url}/artigos/${article.metadata.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/artigos/${article.metadata.slug}</guid>
      <pubDate>${new Date(article.metadata.date).toUTCString()}</pubDate>
      <author>${article.metadata.autor || siteConfig.author.name}</author>
      <category><![CDATA[${article.metadata.category}]]></category>
      ${article.metadata.tags?.map(tag => `<category><![CDATA[${tag}]]></category>`).join('') || ''}
    </item>`)
      .join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
} 