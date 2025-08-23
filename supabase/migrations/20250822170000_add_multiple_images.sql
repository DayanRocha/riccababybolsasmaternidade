-- Criar tabela para múltiplas imagens de produtos
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na nova tabela
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Políticas para product_images (mesmas regras dos produtos)
CREATE POLICY "Anyone can view product images" ON public.product_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage product images" ON public.product_images
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- Migrar imagens existentes para a nova tabela
INSERT INTO public.product_images (product_id, image_url, image_alt, is_primary, display_order)
SELECT 
  id as product_id,
  image_url,
  image_alt,
  true as is_primary,
  0 as display_order
FROM public.products 
WHERE image_url IS NOT NULL AND image_url != '';

-- Criar índices para performance
CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX idx_product_images_display_order ON public.product_images(product_id, display_order);
CREATE INDEX idx_product_images_primary ON public.product_images(product_id, is_primary) WHERE is_primary = true;