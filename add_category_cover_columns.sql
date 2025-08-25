-- Script para adicionar colunas de capa da categoria
-- Execute este script no SQL Editor do painel do Supabase

-- Verificar se as colunas já existem antes de adicionar
DO $$ 
BEGIN
    -- Adicionar cover_image_url se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'categories' 
        AND column_name = 'cover_image_url'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN cover_image_url TEXT;
        COMMENT ON COLUMN public.categories.cover_image_url IS 'URL da imagem de capa da categoria';
    END IF;

    -- Adicionar cover_image_alt se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'categories' 
        AND column_name = 'cover_image_alt'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN cover_image_alt TEXT;
        COMMENT ON COLUMN public.categories.cover_image_alt IS 'Texto alternativo para a imagem de capa da categoria';
    END IF;
END $$;

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'categories' 
AND table_schema = 'public'
ORDER BY ordinal_position;