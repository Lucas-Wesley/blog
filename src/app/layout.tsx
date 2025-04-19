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
      <body className={notoSansMono.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto">
            <a href="/" className="text-xl font-bold mr-3">Lucas Wesley</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}