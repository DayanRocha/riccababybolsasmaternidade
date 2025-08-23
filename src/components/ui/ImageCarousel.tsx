import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OptimizedImage from './OptimizedImage';
import ImageModal from './ImageModal';
import { ProductImage } from '@/types/product';

interface ImageCarouselProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  productName, 
  className = "" 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Filtrar imagens válidas (sem erro de carregamento)
  const validImages = images?.filter(img => 
    img && 
    img.image_url && 
    typeof img.image_url === 'string' && 
    img.image_url.trim() !== '' &&
    !imageErrors.has(img.id)
  ) || [];

  const handleImageError = (imageId: string) => {
    setImageErrors(prev => new Set([...prev, imageId]));
    // Se a imagem atual falhou, mover para a próxima válida
    if (validImages[currentIndex]?.id === imageId && validImages.length > 1) {
      const nextValidIndex = validImages.findIndex((img, index) => 
        index > currentIndex && !imageErrors.has(img.id)
      );
      if (nextValidIndex !== -1) {
        setCurrentIndex(nextValidIndex);
      } else {
        setCurrentIndex(0);
      }
    }
  };

  const openModal = () => {
    console.log('Opening modal for:', productName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('Closing modal for:', productName);
    setIsModalOpen(false);
  };

  if (!validImages || validImages.length === 0) {
    return (
      <div className={`relative aspect-square overflow-hidden rounded-lg group cursor-pointer ${className}`}>
        <OptimizedImage 
          src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&crop=center"
          alt={`${productName} - Bolsa maternidade Ricca Baby`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onClick={openModal}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center pointer-events-none">
          <Expand className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
        </div>
        {/* Indicador de imagem padrão */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          Imagem padrão
        </div>
        
        <ImageModal
          images={[{
            id: 'default',
            product_id: '',
            image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&crop=center",
            image_alt: `${productName} - Bolsa maternidade Ricca Baby`,
            display_order: 0,
            is_primary: true
          }]}
          initialIndex={0}
          isOpen={isModalOpen}
          onClose={closeModal}
          productName={productName}
        />
      </div>
    );
  }

  if (validImages.length === 1) {
    return (
      <>
        <div className={`relative aspect-square overflow-hidden rounded-lg group cursor-pointer ${className}`}>
          <OptimizedImage 
            src={validImages[0].image_url}
            alt={validImages[0].image_alt || `${productName} - Bolsa maternidade Ricca Baby`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onClick={openModal}
            onError={() => handleImageError(validImages[0].id)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center pointer-events-none">
            <Expand className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
          </div>
        </div>
        
        <ImageModal
          images={validImages}
          initialIndex={0}
          isOpen={isModalOpen}
          onClose={closeModal}
          productName={productName}
        />
      </>
    );
  }

  const nextImage = () => {
    console.log('Next image clicked');
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    console.log('Previous image clicked');
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const goToImage = (index: number) => {
    console.log('Go to image:', index);
    setCurrentIndex(index);
  };

  return (
    <>
      <div className={`relative group ${className}`}>
        {/* Main Image */}
        <div className="aspect-square overflow-hidden rounded-lg cursor-pointer relative" onClick={openModal}>
          <OptimizedImage 
            src={validImages[currentIndex].image_url}
            alt={validImages[currentIndex].image_alt || `${productName} - Bolsa maternidade Ricca Baby`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={() => handleImageError(validImages[currentIndex].id)}
          />
          {/* Overlay com ícone de expandir */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center pointer-events-none">
            <Expand className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
          </div>
        </div>

      {/* Navigation Arrows */}
      <Button
        variant="secondary"
        size="sm"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 sm:opacity-70 transition-opacity duration-200 h-10 w-10 md:h-8 md:w-8 p-0 z-10 bg-white/80 hover:bg-white/90 shadow-md touch-manipulation"
        onClick={(e) => {
          e.stopPropagation();
          prevImage();
        }}
        aria-label="Imagem anterior"
      >
        <ChevronLeft className="h-5 w-5 md:h-4 md:w-4" />
      </Button>

      <Button
        variant="secondary"
        size="sm"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 sm:opacity-70 transition-opacity duration-200 h-10 w-10 md:h-8 md:w-8 p-0 z-10 bg-white/80 hover:bg-white/90 shadow-md touch-manipulation"
        onClick={(e) => {
          e.stopPropagation();
          nextImage();
        }}
        aria-label="Próxima imagem"
      >
        <ChevronRight className="h-5 w-5 md:h-4 md:w-4" />
      </Button>

      {/* Image Counter */}
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
        {currentIndex + 1} / {validImages.length}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {validImages.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 md:w-3 md:h-3 rounded-full transition-all duration-200 touch-manipulation ${
              index === currentIndex 
                ? 'bg-white shadow-md' 
                : 'bg-white/50 hover:bg-white/75 active:bg-white/90'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              goToImage(index);
            }}
            aria-label={`Ir para imagem ${index + 1}`}
          />
        ))}
      </div>


    </div>
    
    <ImageModal
      images={validImages}
      initialIndex={currentIndex}
      isOpen={isModalOpen}
      onClose={closeModal}
      productName={productName}
    />
  </>
  );
};

export default ImageCarousel;