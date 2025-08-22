
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

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
          categories (
            name
          )
        `)
        .eq('is_active', true)
        .eq('categories.slug', 'bolsas-escolares')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSchoolProducts(data || []);
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
          <div className="text-center py-8">Carregando produtos escolares...</div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schoolProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image_url || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&crop=center"}
              name={product.name}
              description={product.description || ''}
              whatsappLink={product.whatsapp_link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SchoolBagsSection;
