
interface ProductCardProps {
  image: string;
  name: string;
  description: string;
  whatsappLink?: string;
}

const ProductCard = ({ image, name, description, whatsappLink = "https://wa.me/SEUNUMERO" }: ProductCardProps) => {
  return (
    <div className="product-card animate-scale-in">
      <div className="aspect-square overflow-hidden rounded-lg mb-4">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <h3 className="text-xl font-semibold text-primary mb-2">{name}</h3>
      <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
      
      <a 
        href={whatsappLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-button w-full text-center inline-block"
      >
        Fale no WhatsApp
      </a>
    </div>
  );
};

export default ProductCard;
