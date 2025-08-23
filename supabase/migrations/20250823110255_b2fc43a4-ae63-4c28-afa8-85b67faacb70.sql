
-- Criar tabela para múltiplas imagens de produtos
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar Row Level Security (RLS)
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Política para administradores poderem ver todas as imagens
CREATE POLICY "Admins can view all product images" 
  ON public.product_images 
  FOR SELECT 
  USING (is_admin_user(auth.uid()));

-- Política para administradores poderem inserir imagens
CREATE POLICY "Admins can insert product images" 
  ON public.product_images 
  FOR INSERT 
  WITH CHECK (is_admin_user(auth.uid()));

-- Política para administradores poderem atualizar imagens
CREATE POLICY "Admins can update product images" 
  ON public.product_images 
  FOR UPDATE 
  USING (is_admin_user(auth.uid()));

-- Política para administradores poderem deletar imagens
CREATE POLICY "Admins can delete product images" 
  ON public.product_images 
  FOR DELETE 
  USING (is_admin_user(auth.uid()));

-- Índices para melhor performance
CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX idx_product_images_display_order ON public.product_images(product_id, display_order);
CREATE INDEX idx_product_images_primary ON public.product_images(product_id, is_primary);

-- Trigger para garantir apenas uma imagem principal por produto
CREATE OR REPLACE FUNCTION ensure_single_primary_image()
RETURNS TRIGGER AS $$
BEGIN
  -- Se a nova imagem está sendo marcada como principal
  IF NEW.is_primary = true THEN
    -- Remover a flag principal de outras imagens do mesmo produto
    UPDATE public.product_images 
    SET is_primary = false 
    WHERE product_id = NEW.product_id AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_single_primary_image
  BEFORE INSERT OR UPDATE ON public.product_images
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_primary_image();
