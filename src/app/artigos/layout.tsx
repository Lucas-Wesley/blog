import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artigos',
  description: 'Artigos sobre programação e tecnologia',
}

export default function ArtigosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      {children}
    </section>
  )
}