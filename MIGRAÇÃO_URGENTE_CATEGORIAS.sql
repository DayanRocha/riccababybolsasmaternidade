-- MIGRAÇÃO URGENTE: Corrigir problema de categorias
-- Execute este código no Supabase SQL Editor

-- 1. Criar tabela categories se não existir
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Habilitar RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas básicas
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (true); -- Temporariamente permissivo para resolver o problema

-- 4. Inserir categorias padrão
INSERT INTO public.categories (name, slug, description, display_order) 
VALUES 
  ('Bolsas Maternidade', 'bolsas-maternidade', 'Bolsas especialmente desenvolvidas para mães modernas', 1),
  ('Bolsas Escolares', 'bolsas-escolares', 'Bolsas funcionais para estudantes de todas as idades', 2)
ON CONFLICT (slug) DO NOTHING;

-- 5. Verificar se products tem category_id, se não, adicionar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'category_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.products ADD COLUMN category_id UUID;
        
        -- Criar foreign key
        ALTER TABLE public.products 
        ADD CONSTRAINT fk_products_category 
        FOREIGN KEY (category_id) REFERENCES public.categories(id);
        
        -- Atualizar produtos existentes com categoria padrão
        UPDATE public.products 
        SET category_id = (
            SELECT id FROM public.categories 
            WHERE slug = 'bolsas-maternidade' 
            LIMIT 1
        )
        WHERE category_id IS NULL;
    END IF;
END $$;

-- 6. Criar índices
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- 7. Verificar se tudo está funcionando
SELECT 'Categorias criadas:' as status;
SELECT id, name, slug FROM public.categories;

SELECT 'Estrutura da tabela products:' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public'
AND column_name IN ('id', 'name', 'category_id');

SELECT 'Produtos com categorias:' as status;
SELECT p.name, c.name as category_name 
FROM public.products p 
LEFT JOIN public.categories c ON p.category_id = c.id 
LIMIT 3;