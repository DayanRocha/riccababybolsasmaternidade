
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
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-rose-gold-200 animate-scale-in">
      <div className="relative">
        {images && images.length > 0 ? (
          <SimpleImageCarousel 
            images={images}
            productName={name}
            className="aspect-square"
          />
        ) : (
          <div className="aspect-square overflow-hidden">
            <OptimizedImage 
              src={image} 
              alt={`${name} - Bolsa maternidade Ricca Baby`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badge de destaque */}
        <div className="absolute top-4 left-4 bg-rose-gold-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          Premium
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rose-gold-600 transition-colors duration-300">
          {name}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
          {description}
        </p>
        
        <div className="space-y-3">
          {/* Features highlights */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-rose-gold-50 text-rose-gold-700 border border-rose-gold-200">
              ✨ Design Exclusivo
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              📦 Entrega Personalizada
            </span>
          </div>
          
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group/btn relative w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 overflow-hidden"
            aria-label={`Falar no WhatsApp sobre ${name}`}
          >
            {/* Background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Fale no WhatsApp
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
