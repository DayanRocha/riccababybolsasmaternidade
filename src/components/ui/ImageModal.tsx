import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OptimizedImage from './OptimizedImage';
import { ProductImage } from '@/types/product';

interface ImageModalProps {
  images: ProductImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose,
  productName
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (images.length > 1) prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (images.length > 1) nextImage();
          break;
        case 'z':
        case 'Z':
          event.preventDefault();
          toggleZoom();
          break;
        case ' ': // Spacebar
          event.preventDefault();
          toggleZoom();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focar no modal para garantir que receba eventos de teclado
      const modalElement = document.querySelector('[data-modal="image-modal"]') as HTMLElement;
      if (modalElement) {
        modalElement.focus();
      }
    }
    
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || !images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const currentImage = images[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
      data-modal="image-modal"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Visualização em tela cheia: ${productName}`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose}
        aria-label="Fechar modal"
      />

      {/* Modal Content */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Close Button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 md:top-4 right-2 md:right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 active:bg-opacity-90 text-white border-none h-12 w-12 md:h-10 md:w-10 touch-manipulation"
          onClick={onClose}
        >
          <X className="h-6 w-6 md:h-4 md:w-4" />
        </Button>

        {/* Zoom Button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 md:top-4 right-16 md:right-16 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 active:bg-opacity-90 text-white border-none h-12 w-12 md:h-10 md:w-10 touch-manipulation"
          onClick={toggleZoom}
        >
          {isZoomed ? <ZoomOut className="h-6 w-6 md:h-4 md:w-4" /> : <ZoomIn className="h-6 w-6 md:h-4 md:w-4" />}
        </Button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 active:bg-opacity-90 text-white border-none h-14 w-14 md:h-12 md:w-12 touch-manipulation"
              onClick={prevImage}
            >
              <ChevronLeft className="h-7 w-7 md:h-6 md:w-6" />
            </Button>

            <Button
              variant="secondary"
              size="sm"
              className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 active:bg-opacity-90 text-white border-none h-14 w-14 md:h-12 md:w-12 touch-manipulation"
              onClick={nextImage}
            >
              <ChevronRight className="h-7 w-7 md:h-6 md:w-6" />
            </Button>
          </>
        )}

        {/* Main Image */}
        <div 
          className={`relative max-w-full max-h-full transition-transform duration-300 cursor-pointer ${
            isZoomed ? 'transform scale-150 overflow-auto' : ''
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleZoom();
          }}
          style={{
            maxWidth: isZoomed ? '200%' : '90vw',
            maxHeight: isZoomed ? '200%' : '90vh',
          }}
        >
          <OptimizedImage
            src={currentImage.image_url}
            alt={currentImage.image_alt || `${productName} - Bolsa maternidade Ricca Baby`}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Image Info */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white">
          <p className="text-lg font-medium mb-2">{productName}</p>
          {images.length > 1 && (
            <p className="text-sm opacity-75">
              {currentIndex + 1} de {images.length}
            </p>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-20 md:bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={image.id}
                className={`flex-shrink-0 w-20 h-20 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 touch-manipulation ${
                  index === currentIndex 
                    ? 'border-white' 
                    : 'border-transparent opacity-60 hover:opacity-100 active:opacity-100'
                }`}
                onClick={() => goToImage(index)}
              >
                <OptimizedImage
                  src={image.image_url}
                  alt={image.image_alt || `${productName} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="absolute top-16 left-4 text-white text-sm opacity-75 hidden md:block">
          <p>ESC: Fechar | ← →: Navegar | Z/Espaço: Zoom | Clique: Zoom</p>
        </div>

        {/* Touch Support for Mobile */}
        <div 
          className="absolute inset-0 pointer-events-none"
          onTouchStart={(e) => {
            if (e.touches.length === 1) {
              const touch = e.touches[0];
              const startX = touch.clientX;
              const startY = touch.clientY;
              let hasMoved = false;
              
              const handleTouchMove = (moveEvent: TouchEvent) => {
                const moveTouch = moveEvent.touches[0];
                const moveX = moveTouch.clientX;
                const moveY = moveTouch.clientY;
                
                if (Math.abs(moveX - startX) > 10 || Math.abs(moveY - startY) > 10) {
                  hasMoved = true;
                }
              };
              
              const handleTouchEnd = (endEvent: TouchEvent) => {
                const endTouch = endEvent.changedTouches[0];
                const endX = endTouch.clientX;
                const diff = startX - endX;
                
                if (!hasMoved) {
                  // Tap - toggle zoom
                  toggleZoom();
                } else if (Math.abs(diff) > 50 && images.length > 1) {
                  // Swipe - navigate
                  if (diff > 0) {
                    nextImage();
                  } else {
                    prevImage();
                  }
                }
                
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
              };
              
              document.addEventListener('touchmove', handleTouchMove);
              document.addEventListener('touchend', handleTouchEnd);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ImageModal;