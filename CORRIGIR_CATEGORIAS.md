# Correção do Erro de Categorias

## Problema
Erro: "Could not find the 'categories' column of 'products' in the schema cache"

## Causa
O relacionamento entre as tabelas `products` e `categories` não está configurado corretamente no banco de dados.

## Solução

### 1. Aplicar a Migração
Execute a migração que corrige a estrutura das tabelas:

```sql
-- No Supabase SQL Editor, execute o conteúdo do arquivo:
-- supabase/migrations/20250822180000_fix_categories_relationship.sql
```

### 2. Verificar Estrutura das Tabelas

Após aplicar a migração, verifique se as tabelas foram criadas corretamente:

```sql
-- Verificar tabela categories
SELECT * FROM public.categories;

-- Verificar se products tem category_id
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public';

-- Verificar relacionamento
SELECT p.name, c.name as category_name 
FROM public.products p 
LEFT JOIN public.categories c ON p.category_id = c.id 
LIMIT 5;
```

### 3. Estrutura Esperada

**Tabela categories:**
- id (UUID, PK)
- name (TEXT)
- slug (TEXT, UNIQUE)
- description (TEXT)
- display_order (INTEGER)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**Tabela products:**
- id (UUID, PK)
- name (TEXT)
- description (TEXT)
- image_url (TEXT)
- image_alt (TEXT)
- category_id (UUID, FK -> categories.id)
- whatsapp_link (TEXT)
- is_active (BOOLEAN)
- display_order (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 4. Categorias Padrão
A migração criará automaticamente:
- "Bolsas Maternidade" (slug: bolsas-maternidade)
- "Bolsas Escolares" (slug: bolsas-escolares)

### 5. Testar
Após aplicar a migração:
1. Vá para o painel admin
2. Tente criar/editar um produto
3. Selecione uma categoria
4. Salve o produto

## Comandos Supabase CLI (Alternativo)

Se você estiver usando Supabase CLI localmente:

```bash
# Aplicar migração
supabase db push

# Ou aplicar migração específica
supabase migration up --include-all
```

## Verificação Final

Execute esta query para confirmar que tudo está funcionando:

```sql
-- Deve retornar produtos com suas categorias
SELECT 
  p.name as product_name,
  c.name as category_name,
  c.slug as category_slug
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE p.is_active = true;
```

Se ainda houver problemas, verifique:
1. Se as políticas RLS estão ativas
2. Se o usuário tem permissões adequadas
3. Se as foreign keys estão configuradas corretamente