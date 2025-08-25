import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Link, X, Star, ArrowUp, ArrowDown } from 'lucide-react';
import { ProductImage } from '@/types/product';

interface MultipleImageUploadProps {
  productId?: string;
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  productId,
  images,
  onImagesChange
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('upload');
  const [newImageUrl, setNewImageUrl] = useState('');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        return {
          id: `temp-${Date.now()}-${Math.random()}`,
          product_id: productId || '',
          image_url: data.publicUrl,
          image_alt: file.name,
          display_order: images.length,
          is_primary: images.length === 0,
        };
      });

      const newImages = await Promise.all(uploadPromises);
      onImagesChange([...images, ...newImages]);

      toast({
        title: "Sucesso",
        description: `${newImages.length} imagem(ns) enviada(s) com sucesso!`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleUrlAdd = () => {
    if (!newImageUrl.trim()) return;

    const newImage: ProductImage = {
      id: `temp-${Date.now()}-${Math.random()}`,
      product_id: productId || '',
      image_url: newImageUrl.trim(),
      image_alt: 'Produto Ricca Baby',
      display_order: images.length,
      is_primary: images.length === 0,
    };

    onImagesChange([...images, newImage]);
    setNewImageUrl('');

    toast({
      title: "Sucesso",
      description: "Imagem adicionada com sucesso!",
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Reordenar e ajustar primary se necessário
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      display_order: i,
      is_primary: i === 0 || (img.is_primary && i === 0)
    }));
    
    onImagesChange(reorderedImages);
  };

  const setPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index
    }));
    onImagesChange(newImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    
    // Trocar posições
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    
    // Atualizar display_order
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      display_order: i
    }));
    
    onImagesChange(reorderedImages);
  };

  return (
    <div className="space-y-4">
      <Label>Imagens do Produto</Label>
      
      {/* Upload Methods */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
        <Button
          type="button"
          variant={uploadMethod === 'upload' ? 'default' : 'outline'}
          onClick={() => setUploadMethod('upload')}
          size="sm"
          className="flex-1 sm:flex-none"
        >
          <Upload className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Upload de Arquivos</span>
          <span className="sm:hidden">Upload</span>
        </Button>
        <Button
          type="button"
          variant={uploadMethod === 'url' ? 'default' : 'outline'}
          onClick={() => setUploadMethod('url')}
          size="sm"
          className="flex-1 sm:flex-none"
        >
          <Link className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">URL da Imagem</span>
          <span className="sm:hidden">URL</span>
        </Button>
      </div>

      {/* Upload Interface */}
      {uploadMethod === 'upload' ? (
        <div className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-gray-500">Enviando imagens...</p>}
          <p className="text-xs text-gray-500">
            Você pode selecionar múltiplas imagens de uma vez
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="https://exemplo.com/imagem.jpg"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUrlAdd()}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleUrlAdd}
            disabled={!newImageUrl.trim()}
            className="w-full sm:w-auto"
          >
            Adicionar
          </Button>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <Label>Imagens Adicionadas ({images.length})</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {images.map((image, index) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200">
                  <img
                    src={image.image_url}
                    alt={image.image_alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Primary Badge */}
                {image.is_primary && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Principal
                  </div>
                )}
                
                {/* Controls */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                {/* Bottom Controls */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => moveImage(index, 'up')}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                    )}
                    {index < images.length - 1 && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => moveImage(index, 'down')}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  {!image.is_primary && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setPrimary(index)}
                      className="h-6 w-6 p-0"
                      title="Definir como principal"
                    >
                      <Star className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                {/* Order Number */}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-1 py-0.5 rounded text-xs">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-gray-500">
            • A primeira imagem será a principal por padrão<br/>
            • Use as setas para reordenar as imagens<br/>
            • Clique na estrela para definir uma imagem como principal
          </p>
        </div>
      )}
    </div>
  );
};

export default MultipleImageUpload;