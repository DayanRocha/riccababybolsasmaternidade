import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/types/product';

interface SimpleImageCarouselProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

const SimpleImageCarousel: React.FC<SimpleImageCarouselProps> = ({ 
  images, 
  productName, 
  className = "" 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Se não há imagens, usar imagem padrão
  if (!images || images.length === 0) {
    return (
      <div className={`relative aspect-square overflow-hidden rounded-lg group cursor-pointer ${className}`}>
        <img 
          src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&crop=center"
          alt={`${productName} - Bolsa maternidade Ricca Baby`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onClick={() => {
            console.log('Default image clicked');
            setIsModalOpen(true);
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center pointer-events-none">
          <Expand className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
        </div>
        
        {/* Modal simples */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop&crop=center"
                alt={`${productName} - Bolsa maternidade Ricca Baby`}
                className="max-w-[90vw] max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Se há apenas uma imagem
  if (images.length === 1) {
    return (
      <div className={`relative aspect-square overflow-hidden rounded-lg group cursor-pointer ${className}`}>
        <img 
          src={images[0].image_url}
          alt={images[0].image_alt || `${productName} - Bolsa maternidade Ricca Baby`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onClick={() => {
            console.log('Single image clicked');
            setIsModalOpen(true);
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center pointer-events-none">
          <Expand className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
        </div>
        
        {/* Modal simples */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="relative">
              <img 
                src={images[0].image_url}
                alt={images[0].image_alt || `${productName} - Bolsa maternidade Ricca Baby`}
                className="max-w-[90vw] max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Múltiplas imagens
  const nextImage = () => {
    console.log('Next image clicked');
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    console.log('Previous image clicked');
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    console.log('Go to image:', index);
    setCurrentIndex(index);
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Imagem principal */}
      <div className="aspect-square overflow-hidden rounded-lg cursor-pointer relative">
        <img 
          src={images[currentIndex].image_url}
          alt={images[currentIndex].image_alt || `${productName} - Bolsa maternidade Ricca Baby`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onClick={() => {
            console.log('Carousel image clicked');
            setIsModalOpen(true);
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center pointer-events-none">
          <Expand className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
        </div>
      </div>

      {/* Setas de navegação */}
      <Button
        variant="secondary"
        size="sm"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-10 w-10 p-0 z-10 bg-white/80 hover:bg-white/90 shadow-md"
        onClick={(e) => {
          e.stopPropagation();
          prevImage();
        }}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="secondary"
        size="sm"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-10 w-10 p-0 z-10 bg-white/80 hover:bg-white/90 shadow-md"
        onClick={(e) => {
          e.stopPropagation();
          nextImage();
        }}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Contador */}
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Pontos indicadores */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-white shadow-md' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              goToImage(index);
            }}
          />
        ))}
      </div>

      {/* Modal simples */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative">
            <img 
              src={images[currentIndex].image_url}
              alt={images[currentIndex].image_alt || `${productName} - Bolsa maternidade Ricca Baby`}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </Button>
            
            {/* Navegação no modal */}
            {images.length > 1 && (
              <>
                <Button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleImageCarousel;