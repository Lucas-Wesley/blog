import type { Metadata } from 'next';
import { Noto_Sans_Mono } from 'next/font/google';
import './globals.css';

const notoSansMono = Noto_Sans_Mono({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Lucas Wesley - Blog',
  description: 'Documentando meus estudos em Tecnologia'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Documentando meus estudos em Tecnologia" />
        <meta name="theme-color" content="#1E3A8A" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className={notoSansMono.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto">
            <a href="/" className="text-xl font-bold mr-3">Lucas Wesley</a>
          </div>
        </nav>
        {children}

        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-211018649V"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-211018649V');
            `,
          }}
        />
      </body>
    </html>
  );
}