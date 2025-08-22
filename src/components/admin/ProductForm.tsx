import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Link, X } from 'lucide-react';
import { Product } from '@/types/product';

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: Product | null;
  onSave: () => void;
  onCancel: () => void;
}

const ProductForm = ({ product, onSave, onCancel }: ProductFormProps) => {
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
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url');
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
    if (product) {
      setFormData(product);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        image_url: data.publicUrl,
        image_alt: formData.name || 'Produto Ricca Baby'
      }));

      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product?.id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', product.id);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!",
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Produto criado com sucesso!",
        });
      }
      
      onSave();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
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

          <div className="space-y-4">
            <Label>Imagem do Produto</Label>
            <div className="flex gap-4 mb-4">
              <Button
                type="button"
                variant={uploadMethod === 'url' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('url')}
                size="sm"
              >
                <Link className="h-4 w-4 mr-2" />
                URL da Imagem
              </Button>
              <Button
                type="button"
                variant={uploadMethod === 'upload' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('upload')}
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload de Arquivo
              </Button>
            </div>

            {uploadMethod === 'url' ? (
              <div className="space-y-2">
                <Input
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-gray-500">Enviando...</p>}
              </div>
            )}

            {formData.image_url && (
              <div className="relative">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2"
                  onClick={() => setFormData(prev => ({ ...prev, image_url: '', image_alt: '' }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

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

export default ProductForm;
