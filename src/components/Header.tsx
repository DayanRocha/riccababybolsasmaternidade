
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <OptimizedImage 
              src="/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png" 
              alt="Ricca Baby - Bolsas Maternidade Premium" 
              className="h-12 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('inicio')}
              className="text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 font-medium"
            >
              Início
            </button>
            <button 
              onClick={() => scrollToSection('bolsas')}
              className="text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 font-medium"
            >
              Bolsas
            </button>
            <button 
              onClick={() => scrollToSection('sobre')}
              className="text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 font-medium"
            >
              Sobre
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-sage-900 hover:text-rose-gold-500 transition-colors duration-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('inicio')}
                className="text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left font-medium"
              >
                Início
              </button>
              <button 
                onClick={() => scrollToSection('bolsas')}
                className="text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left font-medium"
              >
                Bolsas
              </button>
              <button 
                onClick={() => scrollToSection('sobre')}
                className="text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left font-medium"
              >
                Sobre
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
