# Design Document

## Overview

Este documento descreve o design técnico para corrigir os problemas do carousel de imagens, funcionalidade de tela cheia e duplicação de categorias. A solução foca em três áreas principais: correção de tipos TypeScript, melhoria da consulta de dados e otimização da experiência do usuário.

## Architecture

### Component Structure
```
ProductsSection/SchoolBagsSection
├── ProductCard
    ├── ImageCarousel (múltiplas imagens)
    │   ├── OptimizedImage
    │   ├── Navigation Controls
    │   └── ImageModal (tela cheia)
    └── OptimizedImage (imagem única)
```

### Data Flow
1. **Seções de Produto** fazem consultas específicas por categoria
2. **ProductCard** recebe dados tipados corretamente
3. **ImageCarousel** gerencia estado local das imagens
4. **ImageModal** é acionado por cliques nas imagens

## Components and Interfaces

### 1. Type Corrections

**Problem**: Incompatibilidade de tipos entre consulta Supabase e interface Product
**Solution**: Criar tipos específicos para consultas com joins

```typescript
// Novo tipo para consultas com relacionamentos
interface ProductWithRelations extends Omit<Product, 'product_images' | 'categories'> {
  categories: {
    name: string;
    slug: string;
  } | null;
  product_images: ProductImage[] | null;
}
```

### 2. Database Query Optimization

**Current Issue**: Consultas retornando dados incorretos devido a joins mal estruturados
**Solution**: Melhorar consultas com filtros mais específicos

```sql
-- Query otimizada para evitar duplicação
SELECT products.*, categories.name, categories.slug,
       product_images.id, product_images.image_url, 
       product_images.image_alt, product_images.display_order
FROM products
LEFT JOIN categories ON products.category_id = categories.id
LEFT JOIN product_images ON products.id = product_images.product_id
WHERE products.is_active = true 
  AND categories.slug = 'bolsas-maternidade'
ORDER BY products.display_order ASC, product_images.display_order ASC
```

### 3. ImageCarousel Enhancement

**Current Issues**: 
- Controles não responsivos
- Modal não abrindo corretamente
- Navegação por toque inconsistente

**Solutions**:
- Melhorar event handlers
- Corrigir z-index e positioning
- Implementar debounce para gestos de toque

### 4. ImageModal Improvements

**Enhancements**:
- Melhor controle de zoom
- Navegação por teclado mais robusta
- Indicadores visuais mais claros
- Suporte a gestos em dispositivos móveis

## Data Models

### ProductImage Interface
```typescript
interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  image_alt: string;
  display_order: number;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
}
```

### Enhanced Product Interface
```typescript
interface ProductWithImages extends Product {
  product_images: ProductImage[];
  categories: {
    name: string;
    slug: string;
  };
}
```

## Error Handling

### 1. Type Safety
- Implementar type guards para validar dados da API
- Fallbacks para propriedades opcionais
- Tratamento de arrays vazios ou nulos

### 2. Image Loading
- Lazy loading com fallback para imagens quebradas
- Skeleton loading durante carregamento
- Retry mechanism para falhas de rede

### 3. Modal State Management
- Cleanup de event listeners
- Prevenção de scroll do body
- Tratamento de estados de loading

### 4. Category Filtering
- Validação de slugs de categoria
- Fallback para produtos sem categoria
- Logging de erros de consulta

## Testing Strategy

### 1. Unit Tests
- Componentes ImageCarousel e ImageModal
- Funções de navegação e zoom
- Type guards e validações

### 2. Integration Tests
- Fluxo completo de carregamento de produtos
- Navegação entre imagens
- Abertura e fechamento de modal

### 3. Visual Regression Tests
- Screenshots de diferentes estados do carousel
- Responsividade em diferentes dispositivos
- Estados de loading e erro

### 4. Accessibility Tests
- Navegação por teclado
- Screen reader compatibility
- Focus management no modal

## Performance Considerations

### 1. Image Optimization
- Lazy loading de imagens não visíveis
- Preload da próxima imagem no carousel
- Compression e formato otimizado (WebP)

### 2. Component Optimization
- Memoização de componentes pesados
- Debounce de eventos de toque
- Virtual scrolling para muitas imagens

### 3. Database Optimization
- Índices apropriados nas tabelas
- Limit de resultados por consulta
- Cache de consultas frequentes

## Security Considerations

### 1. Image URLs
- Validação de URLs de imagem
- Sanitização de alt text
- CSP headers para imagens externas

### 2. User Input
- Sanitização de parâmetros de consulta
- Validação de IDs de produto
- Rate limiting para consultas

## Mobile Responsiveness

### 1. Touch Gestures
- Swipe horizontal para navegação
- Pinch to zoom no modal
- Touch feedback visual

### 2. Layout Adaptations
- Controles maiores em mobile
- Modal fullscreen em dispositivos pequenos
- Otimização de performance em mobile

### 3. Accessibility
- Tamanho mínimo de toque (44px)
- Contraste adequado
- Suporte a modo escuro