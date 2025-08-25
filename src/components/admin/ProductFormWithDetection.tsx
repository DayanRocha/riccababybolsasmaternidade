
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Product, ProductImage } from '@/types/product';
import { productSchema } from '@/schemas/productSchema';
import MultipleImageUpload from './MultipleImageUpload';

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: Product | null;
  onSave: () => void;
  onCancel: () => void;
}

const ProductFormWithDetection = ({ product, onSave, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    description: '',
    image_url: '',
    image_alt: '',
    category_id: '',
    whatsapp_link: 'https://wa.me/SEUNUMERO',
    is_active: true,
    display_order: 0,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [multipleImagesSupported, setMultipleImagesSupported] = useState(true); // Ativado agora que a tabela existe
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
    if (product) {
      setFormData(product);
      if (product.id) {
        loadProductImages(product.id);
      }
    }
  }, [product]);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias.",
        variant: "destructive",
      });
    } else {
      setCategories(data || []);
    }
  };

  const loadProductImages = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('display_order');

      if (error) throw error;
      
      console.log('Loaded product images:', data);
      setProductImages(data || []);
    } catch (error: any) {
      console.error('Error loading product images:', error);
      // Se der erro, ainda mantemos o suporte ativo mas com array vazio
      setProductImages([]);
    }
  };

  const saveProductImages = async (productId: string) => {
    if (productImages.length === 0) return;
    
    try {
      // Primeiro, deletar imagens existentes se estamos editando
      if (product?.id) {
        const { error: deleteError } = await supabase
          .from('product_images')
          .delete()
          .eq('product_id', productId);
        
        if (deleteError) throw deleteError;
      }

      // Inserir novas imagens
      const imagesToInsert = productImages.map((img, index) => ({
        product_id: productId,
        image_url: img.image_url,
        image_alt: img.image_alt || 'Produto Ricca Baby',
        display_order: index,
        is_primary: index === 0 || img.is_primary,
      }));

      const { error: insertError } = await supabase
        .from('product_images')
        .insert(imagesToInsert);

      if (insertError) throw insertError;
      
      console.log('Product images saved successfully');
    } catch (error: any) {
      console.error('Error saving product images:', error);
      throw error; // Re-throw para ser capturado no handleSubmit
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validação básica manual
      if (!formData.name.trim()) {
        throw new Error("Nome do produto é obrigatório");
      }
      if (!formData.category_id) {
        throw new Error("Categoria é obrigatória");
      }

      // Pegar imagem principal se múltiplas imagens estão disponíveis
      const primaryImage = multipleImagesSupported 
        ? (productImages.find(img => img.is_primary) || productImages[0])
        : null;

      // Preparar dados para inserção/atualização
      const productData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        image_url: primaryImage?.image_url || formData.image_url || null,
        image_alt: primaryImage?.image_alt || formData.image_alt || formData.name.trim(),
        category_id: formData.category_id,
        whatsapp_link: formData.whatsapp_link || 'https://wa.me/5518996125628',
        is_active: formData.is_active,
        display_order: formData.display_order || 0,
      };

      console.log('Saving product data:', productData);

      let savedProductId: string;

      if (product?.id) {
        // Update existing product
        const { data, error } = await supabase
          .from('products')
          .update({
            ...productData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', product.id)
          .select();
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        savedProductId = product.id;
        console.log('Product updated:', data);
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select();
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        savedProductId = data[0].id;
        console.log('Product created:', data);
      }

      // Salvar imagens se suportado e há imagens
      if (multipleImagesSupported && productImages.length > 0) {
        await saveProductImages(savedProductId);
      }
      
      toast({
        title: "Sucesso",
        description: `Produto ${product ? 'atualizado' : 'criado'} com sucesso!`,
      });
      
      onSave();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar produto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {product ? 'Editar Produto' : 'Novo Produto'}
          {multipleImagesSupported && (
            <span className="ml-2 text-sm text-green-600 font-normal">
              ✓ Múltiplas imagens ativadas
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Ex: Mochila Maternidade Premium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição detalhada do produto..."
              rows={3}
            />
          </div>

          {/* Sistema de imagens - múltiplas imagens ativadas */}
          <MultipleImageUpload
            productId={product?.id}
            images={productImages}
            onImagesChange={setProductImages}
          />

          <div className="space-y-2">
            <Label htmlFor="whatsapp_link">Link do WhatsApp</Label>
            <Input
              id="whatsapp_link"
              value={formData.whatsapp_link}
              onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_link: e.target.value }))}
              placeholder="https://wa.me/SEUNUMERO"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Ordem de Exibição</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
              min="0"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-pink-600 hover:bg-pink-700"
            >
              {loading ? 'Salvando...' : 'Salvar Produto'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductFormWithDetection;
