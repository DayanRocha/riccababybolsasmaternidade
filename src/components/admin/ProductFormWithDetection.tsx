
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Product, ProductImage } from '@/types/product';
import { productSchema } from '@/schemas/productSchema';
import MultipleImageUpload from './MultipleImageUpload';
import { Image, AlertCircle, Upload, X } from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface Category {
  id: string;
  name: string;
  cover_image_url?: string;
  cover_image_alt?: string;
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
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState<string>('');
  const [showCategoryImageEdit, setShowCategoryImageEdit] = useState(false);
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
      .select('id, name, cover_image_url, cover_image_alt')
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

  const handleCategoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCategoryImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCategoryImage = () => {
    setCategoryImageFile(null);
    setCategoryImagePreview('');
  };

  const uploadCategoryImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `category-${Date.now()}.${fileExt}`;
    const filePath = `categories/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const saveCategoryImage = async () => {
    if (!categoryImageFile || !formData.category_id) return;

    try {
      const imageUrl = await uploadCategoryImage(categoryImageFile);
      
      const { error } = await supabase
        .from('categories')
        .update({
          cover_image_url: imageUrl,
          cover_image_alt: `Capa da categoria`
        })
        .eq('id', formData.category_id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Capa da categoria atualizada com sucesso!",
      });

      // Recarregar categorias para atualizar a interface
      await loadCategories();
      setShowCategoryImageEdit(false);
      setCategoryImageFile(null);
      setCategoryImagePreview('');
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao salvar capa da categoria: " + error.message,
        variant: "destructive",
      });
    }
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat.id === formData.category_id);
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
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, category_id: value }));
                setShowCategoryImageEdit(false);
                setCategoryImageFile(null);
                setCategoryImagePreview('');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      {category.name}
                      {!category.cover_image_url && (
                        <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs">
                          Sem capa
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Cover Management */}
          {formData.category_id && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Capa da Categoria</Label>
                {getSelectedCategory() && !getSelectedCategory()?.cover_image_url && (
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Sem capa
                  </Badge>
                )}
              </div>

              {!showCategoryImageEdit ? (
                <div className="space-y-3">
                  {getSelectedCategory()?.cover_image_url ? (
                    <div className="flex items-center gap-3">
                      <OptimizedImage
                        src={getSelectedCategory()!.cover_image_url}
                        alt={getSelectedCategory()!.cover_image_alt || getSelectedCategory()!.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Categoria possui capa</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCategoryImageEdit(true)}
                          className="mt-1"
                        >
                          <Image className="h-3 w-3 mr-1" />
                          Alterar Capa
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <AlertCircle className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-3">
                        Esta categoria não possui capa de imagem
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCategoryImageEdit(true)}
                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Adicionar Capa
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {categoryImagePreview ? (
                    <div className="relative">
                      <OptimizedImage
                        src={categoryImagePreview}
                        alt="Preview da capa"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeCategoryImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Selecione uma imagem para a capa da categoria
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCategoryImageChange}
                        className="hidden"
                        id="category-image-upload"
                      />
                      <Label htmlFor="category-image-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>Escolher Arquivo</span>
                        </Button>
                      </Label>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCategoryImageEdit(false);
                        setCategoryImageFile(null);
                        setCategoryImagePreview('');
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={saveCategoryImage}
                      disabled={!categoryImageFile}
                      className="flex-1 bg-pink-600 hover:bg-pink-700"
                    >
                      Salvar Capa
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

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
