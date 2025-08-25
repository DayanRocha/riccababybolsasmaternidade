
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import OptimizedImage from '@/components/ui/OptimizedImage';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // Se não estiver na página inicial, navegar para lá primeiro
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
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
          <Link to="/" className="flex-shrink-0">
            <OptimizedImage 
              src="/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png" 
              alt="Ricca Baby - Bolsas Maternidade Premium" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            <Link 
              to="/"
              className="text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 font-medium"
            >
              Início
            </Link>
            <Link 
              to="/collections"
              className="text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 font-medium"
            >
              Coleções
            </Link>
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
            className="lg:hidden text-sage-900 hover:text-rose-gold-500 transition-colors duration-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left font-medium"
              >
                Início
              </Link>
              
              <Link 
                to="/collections"
                onClick={() => setIsMenuOpen(false)}
                className="text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left font-medium"
              >
                Coleções
              </Link>
              
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
