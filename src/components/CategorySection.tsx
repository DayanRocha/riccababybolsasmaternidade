import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import ProductSkeleton from '@/components/ui/ProductSkeleton';
import { Product, ProductWithRelations, isValidProduct, convertToProduct } from '@/types/product';

interface CategorySectionProps {
  categorySlug: string;
  title: string;
  description: string;
  sectionId: string;
  backgroundColor?: string;
}

const CategorySection = ({ 
  categorySlug, 
  title, 
  description, 
  sectionId, 
  backgroundColor = "bg-background" 
}: CategorySectionProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [categorySlug]);

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
        .eq('categories.slug', categorySlug)
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      const validProducts: Product[] = [];
      if (data) {
        console.log(`Loaded ${data.length} products for category ${categorySlug}`);
        for (const item of data) {
          if (isValidProduct(item)) {
            if (item.categories?.slug === categorySlug) {
              validProducts.push(convertToProduct(item));
            } else {
              console.warn('Product with wrong category found:', item.name, item.categories?.slug);
            }
          } else {
            console.warn('Invalid product data:', item);
          }
        }
      }
      
      console.log(`Displaying ${validProducts.length} valid products for ${categorySlug}`);
      setProducts(validProducts);
    } catch (error) {
      console.error(`Error loading products for ${categorySlug}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Não renderiza a seção se não há produtos e não está carregando
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section id={sectionId} className={`py-20 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <h2 className="section-title">{title}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {description}
        </p>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
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

export default CategorySection;