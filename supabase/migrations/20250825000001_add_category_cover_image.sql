-- Adicionar campo de imagem de capa para categorias
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS cover_image_alt TEXT;

-- Comentários para documentação
COMMENT ON COLUMN public.categories.cover_image_url IS 'URL da imagem de capa da categoria';
COMMENT ON COLUMN public.categories.cover_image_alt IS 'Texto alternativo para a imagem de capa da categoria';