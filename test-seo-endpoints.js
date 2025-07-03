#!/usr/bin/env node

/**
 * 🔍 Script para testar todos os endpoints de SEO
 * 
 * Este script verifica se todos os endpoints essenciais de SEO estão funcionando:
 * - /sitemap.xml
 * - /robots.txt  
 * - /feed.xml
 * - /manifest.json
 * - /api/og
 * 
 * Execute com: node test-seo-endpoints.js
 */

const https = require('https');
const http = require('http');

// Configuração
const BASE_URL = 'http://localhost:3030'; // Altere para sua URL de produção quando necessário

// Lista de endpoints para testar
const endpoints = [
  {
    path: '/sitemap.xml',
    expectedContentType: 'application/xml',
    name: 'Sitemap XML'
  },
  {
    path: '/robots.txt',
    expectedContentType: 'text/plain',
    name: 'Robots.txt'
  },
  {
    path: '/feed.xml',
    expectedContentType: 'application/rss+xml',
    name: 'RSS Feed'
  },
  {
    path: '/manifest.json',
    expectedContentType: 'application/json',
    name: 'Web App Manifest (JSON)'
  },
  {
    path: '/manifest.webmanifest',
    expectedContentType: 'application/manifest+json',
    name: 'Web App Manifest (WebManifest)'
  },
  {
    path: '/api/og?title=Teste&category=SEO',
    expectedContentType: 'image/png',
    name: 'Open Graph Image Generator'
  }
];

// Função para fazer requisição HTTP
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const requestModule = url.startsWith('https://') ? https : http;
    
    requestModule.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          contentType: res.headers['content-type']
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Função para validar XML
function isValidXML(xmlString) {
  try {
    // Verificação básica de XML válido
    return xmlString.includes('<?xml') && xmlString.includes('<') && xmlString.includes('>');
  } catch (e) {
    return false;
  }
}

// Função para validar JSON
function isValidJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (e) {
    return false;
  }
}

// Função principal de teste
async function testSEOEndpoints() {
  console.log('🚀 Iniciando testes dos endpoints de SEO...\n');
  console.log(`Base URL: ${BASE_URL}\n`);
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const url = `${BASE_URL}${endpoint.path}`;
    
    try {
      console.log(`🔍 Testando: ${endpoint.name}`);
      console.log(`   URL: ${url}`);
      
      const response = await makeRequest(url);
      
      // Verificações básicas
      const isOk = response.statusCode === 200;
      const hasCorrectContentType = response.contentType && 
        response.contentType.includes(endpoint.expectedContentType.split('/')[0]);
      
      // Verificações específicas por tipo
      let isValidContent = true;
      let contentInfo = '';
      
      if (endpoint.path.includes('.xml')) {
        isValidContent = isValidXML(response.data);
        const lines = response.data.split('\n').length;
        contentInfo = `${lines} linhas`;
      } else if (endpoint.path.includes('.json') || endpoint.path.includes('manifest')) {
        isValidContent = isValidJSON(response.data);
        contentInfo = 'JSON válido';
      } else if (endpoint.path.includes('/api/og')) {
        isValidContent = response.data.length > 1000; // Imagem deve ter tamanho razoável
        contentInfo = `${Math.round(response.data.length / 1024)}KB`;
      } else {
        contentInfo = `${response.data.length} caracteres`;
      }
      
      const status = isOk && hasCorrectContentType && isValidContent ? '✅' : '❌';
      
      console.log(`   Status: ${response.statusCode} ${status}`);
      console.log(`   Content-Type: ${response.contentType || 'N/A'}`);
      console.log(`   Conteúdo: ${contentInfo}`);
      
      results.push({
        endpoint: endpoint.name,
        url,
        success: isOk && hasCorrectContentType && isValidContent,
        statusCode: response.statusCode,
        contentType: response.contentType,
        contentInfo
      });
      
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
      results.push({
        endpoint: endpoint.name,
        url,
        success: false,
        error: error.message
      });
    }
    
    console.log(''); // Linha em branco
  }
  
  // Relatório final
  console.log('📊 RELATÓRIO FINAL');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.endpoint}`);
    if (result.error) {
      console.log(`   Erro: ${result.error}`);
    }
  });
  
  console.log('');
  console.log(`Sucessos: ${successful}/${total}`);
  
  if (successful === total) {
    console.log('🎉 Todos os endpoints de SEO estão funcionando perfeitamente!');
  } else {
    console.log('⚠️  Alguns endpoints precisam de atenção.');
    console.log('');
    console.log('💡 DICAS:');
    console.log('   - Certifique-se de que o servidor está rodando (npm run dev)');
    console.log('   - Verifique se todos os arquivos de rota estão corretos');
    console.log('   - Teste individualmente cada endpoint no navegador');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  testSEOEndpoints().catch(console.error);
}

module.exports = { testSEOEndpoints };
