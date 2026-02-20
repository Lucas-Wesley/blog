/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // Configuração para evitar warnings de hidratação
  experimental: {
    optimizeCss: true,
  },
  
  // Configuração para evitar warnings de className mismatch
  webpack: (config) => {
    config.externals = config.externals || {};
    return config;
  },
  
  // Configuração para suprimir warnings específicos de hidratação
  onDemandEntries: {
    // Período em ms para manter as páginas em cache
    maxInactiveAge: 60 * 1000,
    // Número de páginas que devem ser mantidas simultaneamente
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
