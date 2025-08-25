import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';
import ProductSkeleton from '@/components/ui/ProductSkeleton';
import { Product, ProductWithRelations, isValidProduct, convertToProduct } from '@/types/product';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FilterState {
  search: string;
  selectedCategories: string[];
}

const AllProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    selectedCategories: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('display_order');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories!inner (
            id,
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
        .order('display_order', { ascending: true });

      if (productsError) throw productsError;

      const validProducts: Product[] = [];
      if (productsData) {
        for (const item of productsData) {
          if (isValidProduct(item)) {
            validProducts.push(convertToProduct(item));
          }
        }
      }

      setProducts(validProducts);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.categories?.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by categories
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        filters.selectedCategories.includes(product.category_id)
      );
    }

    return filtered;
  }, [products, filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Todos os Produtos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="todos-produtos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Todos os Produtos</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Explore nossa coleção completa com {products.length} produtos em {categories.length} categorias diferentes.
            Use os filtros para encontrar exatamente o que você procura.
          </p>
        </div>

        <ProductFilter
          onFilterChange={handleFilterChange}
          categories={categories}
        />

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Tente ajustar os filtros ou remover alguns termos de busca.
              </p>
              <button
                onClick={() => setFilters({ search: '', selectedCategories: [] })}
                className="text-rose-gold-600 hover:text-rose-gold-700 font-medium"
              >
                Limpar todos os filtros
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-600">
                Mostrando {filteredProducts.length} de {products.length} produtos
              </p>
              
              {(filters.search || filters.selectedCategories.length > 0) && (
                <button
                  onClick={() => setFilters({ search: '', selectedCategories: [] })}
                  className="text-sm text-rose-gold-600 hover:text-rose-gold-700 font-medium"
                >
                  Ver todos os produtos
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
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
          </>
        )}
      </div>
    </section>
  );
};

export default AllProductsSection;