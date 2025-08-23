
export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  image_alt: string;
  display_order: number;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  image_alt: string;
  category_id: string;
  whatsapp_link: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  categories?: {
    name: string;
  };
  product_images?: ProductImage[];
}

// Tipo específico para consultas com relacionamentos do Supabase
export interface ProductWithRelations {
  id: string;
  name: string;
  description: string;
  image_url: string;
  image_alt: string;
  category_id: string;
  whatsapp_link: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  categories: {
    name: string;
    slug?: string;
  } | null;
  product_images: ProductImage[] | null;
}

// Type guard para validar dados da API
export const isValidProduct = (data: any): data is ProductWithRelations => {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.description === 'string' &&
    typeof data.image_url === 'string' &&
    typeof data.whatsapp_link === 'string' &&
    typeof data.is_active === 'boolean'
  );
};

// Função para converter ProductWithRelations para Product
export const convertToProduct = (productWithRelations: ProductWithRelations): Product => {
  return {
    ...productWithRelations,
    categories: productWithRelations.categories || undefined,
    product_images: productWithRelations.product_images || undefined,
  };
};
