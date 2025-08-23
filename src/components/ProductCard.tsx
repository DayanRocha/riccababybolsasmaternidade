
import OptimizedImage from "@/components/ui/OptimizedImage";
import SimpleImageCarousel from "@/components/ui/SimpleImageCarousel";
import { ProductImage } from "@/types/product";

interface ProductCardProps {
  image: string;
  name: string;
  description: string;
  whatsappLink?: string;
  images?: ProductImage[];
}

const ProductCard = ({ 
  image, 
  name, 
  description, 
  whatsappLink = "https://wa.me/5518996125628",
  images = []
}: ProductCardProps) => {
  return (
    <div className="product-card animate-scale-in">
      {images && images.length > 0 ? (
        <SimpleImageCarousel 
          images={images}
          productName={name}
          className="mb-4"
        />
      ) : (
        <div className="aspect-square overflow-hidden rounded-lg mb-4">
          <OptimizedImage 
            src={image} 
            alt={`${name} - Bolsa maternidade Ricca Baby`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-primary mb-2">{name}</h3>
      <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
      
      <a 
        href={whatsappLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-button w-full text-center inline-block"
        aria-label={`Falar no WhatsApp sobre ${name}`}
      >
        Fale no WhatsApp
      </a>
    </div>
  );
};

export default ProductCard;
