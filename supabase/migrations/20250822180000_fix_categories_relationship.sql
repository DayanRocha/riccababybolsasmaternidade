-- Verificar se a tabela categories existe, se não, criar
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

-- Habilitar RLS na tabela categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Políticas para categories
CREATE POLICY IF NOT EXISTS "Anyone can view categories" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS "Admins can manage categories" ON public.categories
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- Inserir categorias padrão se não existirem
INSERT INTO public.categories (name, slug, description, display_order) 
VALUES 
  ('Bolsas Maternidade', 'bolsas-maternidade', 'Bolsas especialmente desenvolvidas para mães modernas', 1),
  ('Bolsas Escolares', 'bolsas-escolares', 'Bolsas funcionais para estudantes de todas as idades', 2)
ON CONFLICT (slug) DO NOTHING;

-- Verificar se a coluna category_id existe na tabela products
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'category_id'
        AND table_schema = 'public'
    ) THEN
        -- Adicionar coluna category_id se não existir
        ALTER TABLE public.products ADD COLUMN category_id UUID REFERENCES public.categories(id);
        
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

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active) WHERE is_active = true;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para categories
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para products (se não existir)
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();