
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

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
          categories (
            name
          )
        `)
        .eq('is_active', true)
        .eq('categories.slug', 'bolsas-maternidade')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="produtos" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Bolsas Maternidade</h2>
          <div className="text-center py-8">Carregando produtos...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="produtos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Bolsas Maternidade</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum produto disponível no momento.
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
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
