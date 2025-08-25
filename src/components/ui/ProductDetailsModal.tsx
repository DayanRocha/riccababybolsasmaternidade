import { useState } from 'react';
import { X, MessageCircle, Share2, Heart } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import ImageCarousel from './ImageCarousel';
import { Product } from '@/types/product';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onImageClick?: (imageUrl: string) => void;
}

const ProductDetailsModal = ({ product, onClose, onImageClick }: ProductDetailsModalProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Prepare images array for carousel
  const images = [];
  
  // Add main image first
  if (product.image_url) {
    images.push({
      url: product.image_url,
      alt: product.image_alt || product.name
    });
  }

  // Add additional images
  if (product.product_images) {
    product.product_images
      .filter(img => !img.is_primary)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      .forEach(img => {
        images.push({
          url: img.image_url,
          alt: img.image_alt || product.name
        });
      });
  }

  const handleWhatsAppClick = () => {
    if (product.whatsapp_link) {
      window.open(product.whatsapp_link, '_blank');
    } else {
      // Create a detailed message with product information
      const categoryName = product.categories?.name || 'Produto';
      const productImage = product.image_url || (product.product_images && product.product_images[0]?.image_url);
      
      let message = `🌟 Olá! Tenho interesse nesta ${categoryName.toLowerCase()}:\n\n`;
      message += `📝 *${product.name}*\n`;
      
      if (product.description) {
        message += `\n📋 Descrição: ${product.description}\n`;
      }
      
      message += `\n🔗 Link do produto: ${window.location.href}`;
      
      if (productImage) {
        message += `\n\n📸 Imagem: ${productImage}`;
      }
      
      message += `\n\n💬 Gostaria de saber mais informações sobre disponibilidade, preço e formas de pagamento.`;
      
      const whatsappUrl = `https://wa.me/5518996125628?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || '',
          url: window.location.href
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900 truncate">
            {product.name}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Image Section */}
          <div className="lg:w-1/2 p-6">
            <ImageCarousel
              images={images}
              onImageClick={onImageClick}
              className="w-full"
            />
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Product Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h1>
                    {product.categories && (
                      <Badge variant="secondary" className="mb-3">
                        {product.categories.name}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`ml-2 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                {product.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Features/Specifications */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Características</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Material:</span>
                    <span>Couro sintético premium</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compartimentos:</span>
                    <span>Múltiplos organizadores</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fechamento:</span>
                    <span>Zíper de alta qualidade</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cuidados:</span>
                    <span>Limpar com pano úmido</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t">
                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Entrar em Contato
                </Button>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-xs text-gray-500 pt-4 border-t">
                <p className="mb-1">
                  ✓ Entrega para todo o Brasil
                </p>
                <p className="mb-1">
                  ✓ Produto com garantia de qualidade
                </p>
                <p>
                  ✓ Atendimento personalizado via WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;