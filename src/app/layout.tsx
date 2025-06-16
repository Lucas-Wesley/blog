import type { Metadata, Viewport } from 'next';
import { Noto_Sans_Mono } from 'next/font/google';
import Script from 'next/script';
import { generateSEOMetadata, generateWebsiteSchema, StructuredData } from '@/lib/seo';
import './globals.css';

const notoSansMono = Noto_Sans_Mono({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-mono',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1E3A8A',
}

export const metadata: Metadata = generateSEOMetadata({
  title: 'Lucas Wesley - Blog',
  description: 'Blog sobre programação, tecnologia e desenvolvimento de software. Artigos sobre DDD, Node.js, IA e muito mais.',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const websiteSchema = generateWebsiteSchema()

  return (
    <html lang="pt-BR" className={notoSansMono.variable}>
      <body className={`${notoSansMono.className} antialiased`}>
        {/* Structured Data para Website */}
        <StructuredData data={websiteSchema} />
        
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto">
            <a href="/" className="text-xl font-bold mr-3">Lucas Wesley</a>
          </div>
        </nav>
        
        <main>
          {children}
        </main>

        {/* Google Analytics com melhor performance */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-211018649V"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-211018649V', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}