
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import ProductSkeleton from '@/components/ui/ProductSkeleton';
import { Product, ProductWithRelations, isValidProduct, convertToProduct } from '@/types/product';

const SchoolBagsSection = () => {
  const [schoolProducts, setSchoolProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchoolProducts();
  }, []);

  const loadSchoolProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories!inner (
            name,
            slug
          ),
          product_images (
            id,
            image_url,
            image_alt,
            display_order,
            is_primary
          )
        `)
        .eq('is_active', true)
        .eq('categories.slug', 'bolsas-escolares')
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      // Validar e converter os dados
      const validProducts: Product[] = [];
      if (data) {
        console.log(`Loaded ${data.length} school products from database`);
        for (const item of data) {
          if (isValidProduct(item)) {
            // Verificar se realmente pertence à categoria correta
            if (item.categories?.slug === 'bolsas-escolares') {
              validProducts.push(convertToProduct(item));
            } else {
              console.warn('Product with wrong category found:', item.name, item.categories?.slug);
            }
          } else {
            console.warn('Invalid product data:', item);
          }
        }
      }
      
      console.log(`Displaying ${validProducts.length} valid school products`);
      setSchoolProducts(validProducts);
    } catch (error) {
      console.error('Error loading school products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="bolsas-escolares" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Bolsas Escolares</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Descubra nossa linha especial de bolsas escolares, desenvolvidas para acompanhar 
            seu filho em todas as aventuras do aprendizado com estilo e funcionalidade.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (schoolProducts.length === 0) {
    return null; // Não mostra a seção se não há produtos escolares
  }

  return (
    <section id="bolsas-escolares" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Bolsas Escolares</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Descubra nossa linha especial de bolsas escolares, desenvolvidas para acompanhar 
          seu filho em todas as aventuras do aprendizado com estilo e funcionalidade.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {schoolProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image_url || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&crop=center"}
              name={product.name}
              description={product.description || ''}
              whatsappLink={product.whatsapp_link}
              images={product.product_images?.sort((a, b) => a.display_order - b.display_order)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SchoolBagsSection;
