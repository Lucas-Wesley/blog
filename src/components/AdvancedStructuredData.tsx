import { StructuredData } from './StructuredData'
import { generateFAQSchema, generateHowToSchema, generateCourseSchema } from '@/lib/seo'

interface FAQ {
  question: string
  answer: string
}

interface HowToStep {
  name: string
  text: string
  image?: string
}

interface CourseLesson {
  name: string
  url: string
  description?: string
}

interface AdvancedStructuredDataProps {
  // FAQ Schema
  faqs?: FAQ[]
  
  // HowTo Schema
  howTo?: {
    title: string
    description: string
    steps: HowToStep[]
    estimateTime?: string
    supply?: string[]
    tool?: string[]
  }
  
  // Course Schema (para séries de artigos)
  course?: {
    name: string
    description: string
    provider: string
    lessons: CourseLesson[]
  }
}

/**
 * Componente para adicionar structured data avançado aos artigos
 * 
 * Use este componente em artigos específicos que se beneficiam de
 * schema markup adicional como FAQ, HowTo ou Course.
 * 
 * Exemplo de uso:
 * 
 * ```tsx
 * <AdvancedStructuredData 
 *   faqs={[
 *     {
 *       question: "O que é Clean Architecture?",
 *       answer: "Clean Architecture é uma filosofia de design..."
 *     }
 *   ]}
 *   howTo={{
 *     title: "Como implementar Clean Architecture",
 *     description: "Guia passo a passo...",
 *     steps: [
 *       { name: "Criar entidades", text: "Primeiro passo..." },
 *       { name: "Definir use cases", text: "Segundo passo..." }
 *     ],
 *     estimateTime: "PT30M"
 *   }}
 * />
 * ```
 */
export function AdvancedStructuredData({
  faqs,
  howTo,
  course
}: AdvancedStructuredDataProps) {
  return (
    <>
      {/* FAQ Schema */}
      {faqs && faqs.length > 0 && (
        <StructuredData data={generateFAQSchema(faqs)} />
      )}
      
      {/* HowTo Schema */}
      {howTo && (
        <StructuredData data={generateHowToSchema(howTo)} />
      )}
      
      {/* Course Schema */}
      {course && (
        <StructuredData data={generateCourseSchema(course)} />
      )}
    </>
  )
}

// Helpers para facilitar a criação de dados
export const createFAQ = (question: string, answer: string): FAQ => ({
  question,
  answer
})

export const createHowToStep = (
  name: string, 
  text: string, 
  image?: string
): HowToStep => ({
  name,
  text,
  image
})

export const createCourseLesson = (
  name: string,
  url: string,
  description?: string
): CourseLesson => ({
  name,
  url,
  description
})
