import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lucas Wesley - Blog',
  description: 'Documentando meus estudos em Tecnologia'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto">
            <a href="/" className="text-xl font-bold mr-3">Inicio</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}