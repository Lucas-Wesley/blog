// Configurações do infinite scroll
export const INFINITE_SCROLL_CONFIG = {
  // Número de artigos carregados inicialmente no servidor
  INITIAL_ARTICLES_LIMIT: 10,
  
  // Número de artigos carregados a cada scroll
  LOAD_MORE_LIMIT: 10,
  
  // Distância do final da página para triggerar o carregamento
  ROOT_MARGIN: '100px',
  
  // Threshold para o Intersection Observer
  THRESHOLD: 0.1,
  
  // Debounce em millisegundos para evitar múltiplas chamadas
  DEBOUNCE_MS: 200,
} as const; 