-- Adicionar novas categorias para o aplicativo Ricca Baby
INSERT INTO public.categories (name, slug, description, display_order) 
VALUES 
  ('Mochilas Maternidade', 'mochilas-maternidade', 'Mochilas práticas e elegantes para mães em movimento', 3),
  ('Bolsas Professoras', 'bolsas-professoras', 'Bolsas funcionais e organizadas para profissionais da educação', 4),
  ('Bolsas para Manicure', 'bolsas-manicure', 'Bolsas especializadas para profissionais de manicure e pedicure', 5),
  ('Acessórios', 'acessorios', 'Acessórios complementares para bolsas e necessidades diárias', 6),
  ('Necessaire', 'necessaire', 'Necessaires organizadoras para cosméticos e itens pessoais', 7),
  ('Mala de Mão', 'mala-de-mao', 'Malas compactas para viagens curtas e uso diário', 8),
  ('Mala de Rodinhas', 'mala-de-rodinhas', 'Malas com rodinhas para viagens confortáveis e práticas', 9)
ON CONFLICT (slug) DO NOTHING;

-- Atualizar a ordem de exibição das categorias existentes se necessário
UPDATE public.categories 
SET display_order = 1 
WHERE slug = 'bolsas-maternidade';

UPDATE public.categories 
SET display_order = 2 
WHERE slug = 'bolsas-escolares';