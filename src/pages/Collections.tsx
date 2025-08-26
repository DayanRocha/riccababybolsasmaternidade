import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cover_image_url?: string;
  cover_image_alt?: string;
  is_active: boolean;
  display_order: number;
}

const Collections = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback categories - sempre mostrar estes cards
  const fallbackCategories = [
    {
      id: "fallback-1",
      slug: "bolsas-maternidade",
      name: "Bolsas Maternidade",
      description: "Bolsas elegantes e funcionais para o dia a dia da maternidade",
      cover_image_url: "",
      is_active: true,
      display_order: 1
    },
    {
      id: "fallback-2",
      slug: "mochilas-maternidade", 
      name: "Mochilas Maternidade",
      description: "Mochilas práticas e elegantes para mães em movimento",
      cover_image_url: "",
      is_active: true,
      display_order: 2
    },
    {
      id: "fallback-3",
      slug: "bolsas-professoras",
      name: "Bolsas Professoras", 
      description: "Bolsas organizadas para profissionais da educação",
      cover_image_url: "",
      is_active: true,
      display_order: 3
    },
    {
      id: "fallback-4",
      slug: "bolsas-manicure",
      name: "Bolsas para Manicure",
      description: "Bolsas profissionais com compartimentos especializados",
      cover_image_url: "",
      is_active: true,
      display_order: 4
    },
    {
      id: "fallback-5",
      slug: "acessorios",
      name: "Acessórios",
      description: "Acessórios complementares para sua rotina",
      cover_image_url: "",
      is_active: true,
      display_order: 5
    },
    {
      id: "fallback-6",
      slug: "necessaire",
      name: "Necessaire",
      description: "Necessaires elegantes e funcionais",
      cover_image_url: "",
      is_active: true,
      display_order: 6
    },
    {
      id: "fallback-7",
      slug: "mala-de-mao",
      name: "Mala de Mão",
      description: "Malas compactas para viagens e uso diário",
      cover_image_url: "",
      is_active: true,
      display_order: 7
    },
    {
      id: "fallback-8",
      slug: "mala-de-rodinhas",
      name: "Mala de Rodinhas", 
      description: "Malas com rodinhas para viagens confortáveis",
      cover_image_url: "",
      is_active: true,
      display_order: 8
    }
  ];

  // Imagem padrão para categorias sem capa
  const defaultImage = "/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png";

  useEffect(() => {
    loadCategories();
  }, []);

  // Debug: mostrar dados das categorias no console
  useEffect(() => {
    if (categories.length > 0) {
      console.log('=== DEBUG CATEGORIAS ===');
      categories.forEach(cat => {
        console.log(`${cat.name} (${cat.slug}):`, {
          id: cat.id,
          cover_image_url: cat.cover_image_url,
          cover_image_alt: cat.cover_image_alt
        });
      });
    }
  }, [categories]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      
      // Carregar categorias do banco com todos os campos necessários
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, description, cover_image_url, cover_image_alt, is_active, display_order')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Erro ao carregar categorias:', error);
        // Em caso de erro, usar categorias fallback
        setCategories(fallbackCategories);
        return;
      }
      
      console.log('=== CATEGORIAS DO BANCO ===');
      console.log('Total de categorias ativas:', data?.length);
      data?.forEach((cat: any, index: number) => {
        console.log(`${index + 1}. ${cat.name} - slug: "${cat.slug}" - capa: ${cat.cover_image_url ? 'SIM' : 'NÃO'}`);
      });
      
      // Se não há categorias ativas no banco, usar fallback
      if (!data || data.length === 0) {
        console.log('Nenhuma categoria ativa no banco, usando fallback');
        setCategories(fallbackCategories);
        return;
      }

      // Usar diretamente os dados do banco, sem mesclagem com fallback
      const categoriesWithDefaults = data.map(category => ({
        ...category,
        cover_image_url: category.cover_image_url || defaultImage,
        cover_image_alt: category.cover_image_alt || `Imagem da categoria ${category.name}`
      }));

      console.log('🎯 Categorias finais:', categoriesWithDefaults);
      setCategories(categoriesWithDefaults);
      
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      // Em caso de erro, sempre mostrar categorias fallback
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Coleções - Ricca Baby"
        description="Explore todas as nossas coleções de bolsas maternidade, mochilas, acessórios e muito mais."
        url="https://riccababy.com/collections"
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-sage-800">
              Nossas Coleções
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra nossa linha completa de produtos desenvolvidos especialmente para você
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
                <p className="text-lg text-muted-foreground">Carregando categorias...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <div className="aspect-square overflow-hidden">
                        <OptimizedImage
                          src={category.cover_image_url || defaultImage}
                          alt={category.cover_image_alt || category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-sage-800">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-muted-foreground mb-4">
                            {category.description}
                          </p>
                        )}
                        <Button className="w-full bg-sage-600 hover:bg-sage-700">
                          Ver Produtos
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Collections;