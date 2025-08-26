-- Adicionar coluna is_active à tabela categories se não existir
DO $$
BEGIN
    -- Verificar se a coluna is_active existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'categories' 
        AND column_name = 'is_active'
    ) THEN
        -- Adicionar a coluna is_active
        ALTER TABLE public.categories ADD COLUMN is_active BOOLEAN DEFAULT true;
        
        -- Atualizar todas as categorias existentes para ativas
        UPDATE public.categories SET is_active = true WHERE is_active IS NULL;
        
        -- Tornar a coluna NOT NULL
        ALTER TABLE public.categories ALTER COLUMN is_active SET NOT NULL;
        
        -- Criar índice para melhor performance
        CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active) WHERE is_active = true;
        
        RAISE NOTICE 'Coluna is_active adicionada à tabela categories com sucesso';
    ELSE
        RAISE NOTICE 'Coluna is_active já existe na tabela categories';
    END IF;
END
$$;