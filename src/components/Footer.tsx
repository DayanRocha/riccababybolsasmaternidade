
import { Instagram, Facebook, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="hero-gradient py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <img 
            src="/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png" 
            alt="Ricca Baby" 
            className="h-16 w-auto mx-auto mb-6"
          />
          
          <div className="flex justify-center space-x-6 mb-8">
            <a 
              href="https://wa.me/SEUNUMERO" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-foreground hover:text-rose-gold-400 transition-colors duration-300"
            >
              <MessageCircle size={24} />
            </a>
            <a 
              href="https://instagram.com/riccababy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-foreground hover:text-rose-gold-400 transition-colors duration-300"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="https://facebook.com/riccababy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-foreground hover:text-rose-gold-400 transition-colors duration-300"
            >
              <Facebook size={24} />
            </a>
          </div>
          
          <p className="text-primary-foreground/80 mb-4">
            Elegância que acompanha cada momento da maternidade
          </p>
          
          <p className="text-primary-foreground/60 text-sm">
            © 2024 Ricca Baby. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
