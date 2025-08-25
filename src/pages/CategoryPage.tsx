import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import ImageModal from "@/components/ui/ImageModal";

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);

  const categoryTitles: Record<string, string> = {
    "bolsas-maternidade": "Bolsas Maternidade",
    "mochilas-maternidade": "Mochilas Maternidade", 
    "bolsas-professoras": "Bolsas Professoras",
    "bolsas-manicure": "Bolsas para Manicure",
    "acessorios": "Acessórios",
    "necessaire": "Necessaire",
    "mala-de-mao": "Mala de Mão",
    "mala-de-rodinhas": "Mala de Rodinhas"
  };

  const categoryDescriptions: Record<string, string> = {
    "bolsas-maternidade": "Bolsas elegantes e funcionais para o dia a dia da maternidade",
    "mochilas-maternidade": "Mochilas práticas e elegantes para mães em movimento",
    "bolsas-professoras": "Bolsas organizadas para profissionais da educação",
    "bolsas-manicure": "Bolsas profissionais com compartimentos especializados",
    "acessorios": "Acessórios complementares para sua rotina",
    "necessaire": "Necessaires elegantes e funcionais",
    "mala-de-mao": "Malas compactas para viagens e uso diário",
    "mala-de-rodinhas": "Malas com rodinhas para viagens confortáveis"
  };

  useEffect(() => {
    const loadProducts = async () => {
      if (!categorySlug) return;
      
      setLoading(true);
      try {
        // First get the category ID by slug
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single();

        if (categoryError) throw categoryError;
        
        if (!categoryData) {
          setProducts([]);
          return;
        }

        // Then get products by category_id with product_images
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            product_images (
              id,
              image_url,
              image_alt,
              display_order,
              is_primary
            )
          `)
          .eq('category_id', categoryData.id)
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (productsError) throw productsError;
        
        setProducts(productsData || []);
        
        // Collect all images for the modal
        const images: string[] = [];
        productsData?.forEach(product => {
          if (product.image_url) images.push(product.image_url);
          if (product.product_images) {
            product.product_images.forEach(img => {
              if (img.image_url) images.push(img.image_url);
            });
          }
        });
        setAllImages(images);
        
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categorySlug]);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const categoryTitle = categorySlug ? categoryTitles[categorySlug] : "Categoria";
  const categoryDescription = categorySlug ? categoryDescriptions[categorySlug] : "";

  return (
    <>
      <SEO 
        title={`${categoryTitle} - Ricca Baby`}
        description={categoryDescription}
        url={`https://riccababy.com/category/${categorySlug}`}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        
        {/* Breadcrumb and Header */}
        <section className="py-8 px-4 border-b">
          <div className="container mx-auto">
            <Link 
              to="/collections" 
              className="inline-flex items-center text-sage-600 hover:text-sage-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Coleções
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-sage-800 mb-2">
              {categoryTitle}
            </h1>
            <p className="text-lg text-muted-foreground">
              {categoryDescription}
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Carregando produtos...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  Nenhum produto encontrado nesta categoria.
                </p>
                <Link to="/collections">
                  <Button>Ver Outras Coleções</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="aspect-square overflow-hidden cursor-pointer" onClick={() => handleImageClick(product.image_url)}>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-sage-800">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      {product.price && (
                        <p className="text-2xl font-bold text-sage-600 mb-4">
                          R$ {product.price.toFixed(2)}
                        </p>
                      )}
                      
                      {/* Additional Images */}
                      {product.product_images && product.product_images.length > 0 && (
                        <div className="flex gap-2 mb-4 overflow-x-auto">
                          {product.product_images
                            .filter(img => !img.is_primary)
                            .slice(0, 3)
                            .map((image, index) => (
                            <img
                              key={image.id}
                              src={image.image_url}
                              alt={image.image_alt || `${product.name} - ${index + 2}`}
                              className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                              onClick={() => handleImageClick(image.image_url)}
                            />
                          ))}
                          {product.product_images.filter(img => !img.is_primary).length > 3 && (
                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-600 flex-shrink-0">
                              +{product.product_images.filter(img => !img.is_primary).length - 3}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <Button className="w-full bg-sage-600 hover:bg-sage-700">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
        <WhatsAppButton />
        
        {/* Image Modal */}
        {selectedImage && (
          <ImageModal
            imageUrl={selectedImage}
            alt="Produto"
            onClose={() => setSelectedImage(null)}
            allImages={allImages}
          />
        )}
      </div>
    </>
  );
};

export default CategoryPage;