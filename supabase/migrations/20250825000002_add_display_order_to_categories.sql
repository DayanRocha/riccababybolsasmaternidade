-- Adicionar coluna display_order à tabela categories se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'categories' 
        AND column_name = 'display_order'
        AND table_schema = 'public'
    ) THEN
        -- Adicionar coluna display_order
        ALTER TABLE public.categories ADD COLUMN display_order INTEGER DEFAULT 0;
        
        -- Atualizar categorias existentes com valores de display_order
        UPDATE public.categories 
        SET display_order = 1
        WHERE slug = 'bolsas-maternidade';
        
        UPDATE public.categories 
        SET display_order = 2
        WHERE slug = 'bolsas-escolares';
        
        -- Definir display_order para outras categorias baseado na ordem de criação
        WITH numbered_categories AS (
            SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
            FROM public.categories
            WHERE display_order = 0
        )
        UPDATE public.categories 
        SET display_order = nc.rn + 2
        FROM numbered_categories nc
        WHERE categories.id = nc.id;
    END IF;
END $$;