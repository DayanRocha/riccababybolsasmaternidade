import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OptimizedImage from './OptimizedImage';

interface SimpleImageModalProps {
  imageUrl: string;
  alt: string;
  onClose: () => void;
  allImages?: string[];
}

const SimpleImageModal: React.FC<SimpleImageModalProps> = ({
  imageUrl,
  alt,
  onClose,
  allImages = []
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Find current image index in allImages array
  useEffect(() => {
    if (allImages.length > 0) {
      const index = allImages.findIndex(img => img === imageUrl);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [imageUrl, allImages]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (allImages.length > 1) prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (allImages.length > 1) nextImage();
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

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allImages.length]);

  const nextImage = () => {
    if (allImages.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
      setIsZoomed(false);
    }
  };

  const prevImage = () => {
    if (allImages.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
      setIsZoomed(false);
    }
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const getCurrentImageUrl = () => {
    return allImages.length > 0 ? allImages[currentIndex] : imageUrl;
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Visualização em tela cheia: ${alt}`}
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
          className="absolute top-2 md:top-4 right-2 md:right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white border-none h-12 w-12 md:h-10 md:w-10"
          onClick={onClose}
        >
          <X className="h-6 w-6 md:h-4 md:w-4" />
        </Button>

        {/* Zoom Button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 md:top-4 right-16 md:right-16 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white border-none h-12 w-12 md:h-10 md:w-10"
          onClick={toggleZoom}
        >
          {isZoomed ? <ZoomOut className="h-6 w-6 md:h-4 md:w-4" /> : <ZoomIn className="h-6 w-6 md:h-4 md:w-4" />}
        </Button>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white border-none h-14 w-14 md:h-12 md:w-12"
              onClick={prevImage}
            >
              <ChevronLeft className="h-7 w-7 md:h-6 md:w-6" />
            </Button>

            <Button
              variant="secondary"
              size="sm"
              className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white border-none h-14 w-14 md:h-12 md:w-12"
              onClick={nextImage}
            >
              <ChevronRight className="h-7 w-7 md:h-6 md:w-6" />
            </Button>
          </>
        )}

        {/* Main Image */}
        <div 
          className={`relative max-w-full max-h-full transition-transform duration-300 cursor-pointer ${
            isZoomed ? 'transform scale-150' : ''
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
            src={getCurrentImageUrl()}
            alt={alt}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Image Info */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white">
            <p className="text-sm opacity-75">
              {currentIndex + 1} de {allImages.length}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="absolute top-16 left-4 text-white text-sm opacity-75 hidden md:block">
          <p>ESC: Fechar | ← →: Navegar | Z/Espaço: Zoom | Clique: Zoom</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleImageModal;