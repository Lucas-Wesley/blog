'use client'

import { useEffect, useRef, useState } from 'react'

interface MarkdownContentProps {
  html: string
  className?: string
}

export default function MarkdownContent({ html, className }: MarkdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [highlightLoaded, setHighlightLoaded] = useState(false)

  useEffect(() => {
    // Carrega CSS e aplica highlight.js no cliente após a montagem
    if (contentRef.current && typeof window !== 'undefined') {
      // Carrega CSS do highlight.js
      if (!document.querySelector('link[href*="highlight.js"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
        document.head.appendChild(link)
      }

      // Carrega highlight.js dinamicamente
      import('highlight.js').then((hljs) => {
        const codeBlocks = contentRef.current!.querySelectorAll('pre code')
        codeBlocks.forEach((block) => {
          // Remove classes anteriores para evitar conflitos
          block.className = block.className.replace(/hljs[^\s]*/g, '').trim()
          // Aplica highlight sem modificar atributos que causem hidratação inconsistente
          hljs.default.highlightElement(block as HTMLElement)
        })
        setHighlightLoaded(true)
      }).catch((error) => {
        console.warn('Erro ao carregar highlight.js:', error)
        setHighlightLoaded(true) // Define como carregado mesmo com erro
      })
    } else {
      setHighlightLoaded(true) // No servidor, define como carregado
    }
  }, [html])

  return (
    <div 
      ref={contentRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning={!highlightLoaded} // Suprime warnings durante carregamento
    />
  )
} 