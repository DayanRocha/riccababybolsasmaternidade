
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
}
