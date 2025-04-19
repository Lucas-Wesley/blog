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
    <>
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
      />
      <section>
        {children}
      </section>
    </>
  )
}