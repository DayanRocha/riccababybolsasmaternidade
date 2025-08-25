import { supabase } from '@/integrations/supabase/client';

// Categorias que serão criadas
const categories = [
  {
    name: 'Bolsas Maternidade',
    slug: 'bolsas-maternidade'
  },
  {
    name: 'Mochilas Maternidade',
    slug: 'mochilas-maternidade'
  },
  {
    name: 'Bolsas Professoras',
    slug: 'bolsas-professoras'
  },
  {
    name: 'Bolsas para Manicure',
    slug: 'bolsas-manicure'
  },
  {
    name: 'Acessórios',
    slug: 'acessorios'
  },
  {
    name: 'Necessaire',
    slug: 'necessaire'
  },
  {
    name: 'Mala de Mão',
    slug: 'mala-de-mao'
  },
  {
    name: 'Mala de Rodinhas',
    slug: 'mala-de-rodinhas'
  }
];

// Produtos de exemplo para cada categoria
const sampleProducts = [
  // Bolsas Maternidade
  {
    name: 'Bolsa Maternidade Elegance',
    description: 'Bolsa maternidade com design elegante e compartimentos organizados para todas as necessidades do bebê.',
    image_url: '/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png',
    image_alt: 'Bolsa Maternidade Elegance',
    category_slug: 'bolsas-maternidade',
    whatsapp_link: 'https://wa.me/5518996125628?text=Olá! Tenho interesse na Bolsa Maternidade Elegance',
    is_active: true,
    display_order: 1
  },
  {
    name: 'Bolsa Maternidade Premium',
    description: 'Bolsa maternidade premium com acabamento em couro sintético e múltiplos compartimentos.',
    image_url: '/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png',
    image_alt: 'Bolsa Maternidade Premium',
    category_slug: 'bolsas-maternidade',
    whatsapp_link: 'https://wa.me/5518996125628?text=Olá! Tenho interesse na Bolsa Maternidade Premium',
    is_active: true,
    display_order: 2
  },
  
  // Mochilas Maternidade
  {
    name: 'Mochila Maternidade Urban',
    description: 'Mochila prática para mães modernas, com design urbano e compartimentos inteligentes.',
    image_url: '/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png',
    image_alt: 'Mochila Maternidade Urban',
    category_slug: 'mochilas-maternidade',
    whatsapp_link: 'https://wa.me/5518996125628?text=Olá! Tenho interesse na Mochila Maternidade Urban',
    is_active: true,
    display_order: 1
  },
  {
    name: 'Mochila Maternidade Travel',
    description: 'Mochila ideal para viagens com bebê, resistente à água e com múltiplos bolsos.',
    image_url: '/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png',
    image_alt: 'Mochila Maternidade Travel',
    category_slug: 'mochilas-maternidade',
    whatsapp_link: 'https://wa.me/5518996125628?text=Olá! Tenho interesse na Mochila Maternidade Travel',
    is_active: true,
    display_order: 2
  },

  // Bolsas Professoras
  {
    name: 'Bolsa Professora Organizer',
    description: 'Bolsa especialmente desenvolvida para professoras, com compartimentos para materiais didáticos.',
    image_url: '/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png',
    image_alt: 'Bolsa Professora Organizer',
    category_slug: 'bolsas-professoras',
    whatsapp_link: 'https://wa.me/5518996125628?text=Olá! Tenho interesse na Bolsa Professora Organizer',
    is_active: true,
    display_order: 1
  },

  // Bolsas para Manicure
  {
    name: 'Bolsa Manicure Professional',
    description: 'Bolsa profissional para manicures com divisórias especiais para equipamentos.',
    image_url: '/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png',
    image_alt: 'Bolsa Manicure Professional',
    category_slug: 'bolsas-manicure',
    whatsapp_link: 'https://wa.me/5518996125628?text=Olá! Tenho interesse na Bolsa Manicure Professional',
    is_active: true,
    display_order: 1
  },

  // Acessórios
  {
    name: 'Organizador de Fraldas',
    description: 'Organizador prático para fraldas e acessórios do bebê.',
    image_url: '/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png',
    image_alt: 'Organizador de Fraldas',
    category_slug: 'acessorios',
    whatsapp_link: 'https://wa.me/5518996125628?text=Olá! Tenho interesse no Organizador de Fraldas',
    is_active: true,
    display_order: 1
  },

  // Necessaire
  {
    name: 'Necessaire Elegante',
    description: 'Necessaire elegante para organizar cosméticos e itens pessoais.',
    image_url: '/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png',
    image_alt: 'Necessaire Elegante',
    category_slug: 'necessaire',
    whatsapp_link: 'https://wa.me/5518996125628?text=Olá! Tenho interesse na Necessaire Elegante',
    is_active: true,
    display_order: 1
  },

  // Mala de Mão
  {
    name: 'Mala de Mão Compact',
    description: 'Mala compacta e sofisticada para viagens curtas.',
    image_url: '/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png',
    image_alt: 'Mala de Mão Compact',
    category_slug: 'mala-de-mao',
    whatsapp_link: 'https://wa.me/5518996125628?text=Olá! Tenho interesse na Mala de Mão Compact',
    is_active: true,
    display_order: 1
  },

  // Mala de Rodinhas
  {
    name: 'Mala de Rodinhas Luxury',
    description: 'Mala com rodinhas de alta qualidade para viagens confortáveis.',
    image_url: '/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png',
    image_alt: 'Mala de Rodinhas Luxury',
    category_slug: 'mala-de-rodinhas',
    whatsapp_link: 'https://wa.me/5518996125628?text=Olá! Tenho interesse na Mala de Rodinhas Luxury',
    is_active: true,
    display_order: 1
  }
];

export async function seedDatabase() {
  try {
    console.log('🌱 Iniciando população do banco de dados...');

    // 1. Criar categorias
    console.log('📁 Criando categorias...');
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'slug' })
      .select();

    if (categoriesError) {
      console.error('Erro ao criar categorias:', categoriesError);
      return;
    }

    console.log(`✅ ${categoriesData.length} categorias criadas/atualizadas`);

    // 2. Criar produtos
    console.log('📦 Criando produtos...');
    
    for (const productData of sampleProducts) {
      // Buscar o ID da categoria
      const category = categoriesData.find(cat => cat.slug === productData.category_slug);
      if (!category) {
        console.warn(`⚠️ Categoria não encontrada: ${productData.category_slug}`);
        continue;
      }

      // Criar o produto
      const { data: product, error: productError } = await supabase
        .from('products')
        .upsert({
          name: productData.name,
          description: productData.description,
          image_url: productData.image_url,
          image_alt: productData.image_alt,
          category_id: category.id,
          whatsapp_link: productData.whatsapp_link,
          is_active: productData.is_active,
          display_order: productData.display_order
        }, { onConflict: 'name' })
        .select()
        .single();

      if (productError) {
        console.error(`Erro ao criar produto ${productData.name}:`, productError);
        continue;
      }

      // Criar imagem principal do produto
      const { error: imageError } = await supabase
        .from('product_images')
        .upsert({
          product_id: product.id,
          image_url: productData.image_url,
          image_alt: productData.image_alt,
          display_order: 1,
          is_primary: true
        }, { onConflict: 'product_id,image_url' });

      if (imageError) {
        console.error(`Erro ao criar imagem para ${productData.name}:`, imageError);
      }

      console.log(`✅ Produto criado: ${productData.name}`);
    }

    console.log('🎉 População do banco de dados concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante a população do banco:', error);
  }
}

// Executar se chamado diretamente
if (typeof window !== 'undefined') {
  // Adicionar função global para executar no console do navegador
  (window as any).seedDatabase = seedDatabase;
}