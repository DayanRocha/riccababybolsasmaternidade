import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cover_image_url?: string;
  cover_image_alt?: string;
}

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({});

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

  // Função para encurtar URL da imagem
  const shortenImageUrl = (url: string) => {
    // Extrai apenas o nome do arquivo da URL
    const fileName = url.split('/').pop() || 'imagem';
    return fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;
  };

  useEffect(() => {
    const loadProducts = async () => {
      if (!categorySlug) return;
      
      setLoading(true);
      try {
        // Carregar categoria com campos de capa
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id, name, slug, description, cover_image_url, cover_image_alt')
          .eq('slug', categorySlug)
          .single();

        if (categoryError) throw categoryError;
        
        if (!categoryData) {
          setProducts([]);
          setCategory(null);
          return;
        }

        console.log('Categoria carregada:', categoryData);
        setCategory(categoryData);

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

  const handleProductDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductDetails = () => {
    setSelectedProduct(null);
  };

  // Use category data from database or fallback to hardcoded values
  const categoryTitle = category?.name || (categorySlug ? categoryTitles[categorySlug] : "Categoria");
  const categoryDescription = category?.description || (categorySlug ? categoryDescriptions[categorySlug] : "");

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
            
            {/* Category Header with Cover Image */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {category?.cover_image_url && (
                <div className="flex-shrink-0">
                  <OptimizedImage
                    src={category.cover_image_url}
                    alt={category.cover_image_alt || category.name}
                    className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-sage-800 mb-2">
                  {categoryTitle}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {categoryDescription}
                </p>
              </div>
            </div>
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
              <div className="space-y-8">
                {products.map((product) => {
                  // Prepare all images for the product
                  const allImages = [];
                  
                  // Add main image if exists
                  if (product.image_url) {
                    allImages.push({
                      url: product.image_url,
                      alt: product.image_alt || product.name,
                      isPrimary: true
                    });
                  }
                  
                  // Add additional images
                  if (product.product_images && product.product_images.length > 0) {
                    product.product_images
                      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                      .forEach(img => {
                        // Only add if it's not already included as main image
                        if (!allImages.some(existing => existing.url === img.image_url)) {
                          allImages.push({
                            url: img.image_url,
                            alt: img.image_alt || product.name,
                            isPrimary: img.is_primary || false
                          });
                        }
                      });
                  }

                   return (
                     <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                       {/* Images Grid */}
                       <div className="p-4 sm:p-6">
                         {allImages.length > 0 && (
                           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                             {allImages.map((img, index) => (
                               <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group">
                                 <OptimizedImage 
                                   src={img.url} 
                                   alt={img.alt}
                                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                                 />
                               </div>
                             ))}
                           </div>
                         )}
                       </div>
                       
                       {/* Product Information */}
                       <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                         <div className="text-center mb-4 sm:mb-6">
                           <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                             {product.name} ✨ ❤️
                           </h2>
                           {product.description && (
                             <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto">
                               {product.description}
                             </p>
                           )}
                         </div>
                         
                         <a 
                           href={`https://wa.me/5518996125628?text=Olá! Tenho interesse no produto: ${encodeURIComponent(product.name)}${allImages.length > 0 ? `%0A%0A📸 Foto: ${encodeURIComponent(allImages[0].url)}` : ''}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                           aria-label={`Falar no WhatsApp sobre ${product.name}`}
                         >
                           <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                           </svg>
                           <span>Fale no WhatsApp</span>
                         </a>
                       </div>
                     </div>
                   );
                })}
              </div>
            )}
          </div>
        </section>

        <Footer />
        <WhatsAppButton 
          categoryName={categoryTitle}
          categoryImage={products.length > 0 ? products[0].image_url : undefined}
        />
        
        {/* Image Modal */}
        {selectedImage && (
          <SimpleImageModal
            imageUrl={selectedImage}
            alt="Produto"
            onClose={() => setSelectedImage(null)}
            allImages={allImages}
          />
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={handleCloseProductDetails}
            onImageClick={handleImageClick}
          />
        )}
      </div>
    </>
  );
};

export default CategoryPage;