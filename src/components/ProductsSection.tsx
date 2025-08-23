
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import ProductSkeleton from '@/components/ui/ProductSkeleton';
import { Product, ProductWithRelations, isValidProduct, convertToProduct } from '@/types/product';

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
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
        .eq('categories.slug', 'bolsas-maternidade')
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      // Validar e converter os dados
      const validProducts: Product[] = [];
      if (data) {
        console.log(`Loaded ${data.length} maternity products from database`);
        for (const item of data) {
          if (isValidProduct(item)) {
            // Verificar se realmente pertence à categoria correta
            if (item.categories?.slug === 'bolsas-maternidade') {
              validProducts.push(convertToProduct(item));
            } else {
              console.warn('Product with wrong category found:', item.name, item.categories?.slug);
            }
          } else {
            console.warn('Invalid product data:', item);
          }
        }
      }
      
      console.log(`Displaying ${validProducts.length} valid maternity products`);
      setProducts(validProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="produtos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Bolsas Maternidade</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">Nenhum produto disponível no momento.</p>
            <p className="text-sm mt-2">Novos produtos em breve!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
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
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
