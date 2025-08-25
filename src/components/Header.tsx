
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
          <nav className="hidden lg:flex space-x-6">
            <button 
              onClick={() => scrollToSection('inicio')}
              className="text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 font-medium"
            >
              Início
            </button>
            <div className="relative group">
              <button className="text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 font-medium flex items-center gap-1">
                Produtos
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-2">
                  <button onClick={() => scrollToSection('produtos')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-gold-50 hover:text-rose-gold-600">
                    Bolsas Maternidade
                  </button>
                  <button onClick={() => scrollToSection('bolsas-escolares')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-gold-50 hover:text-rose-gold-600">
                    Bolsas Escolares
                  </button>
                  <button onClick={() => scrollToSection('mochilas-maternidade')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-gold-50 hover:text-rose-gold-600">
                    Mochilas Maternidade
                  </button>
                  <button onClick={() => scrollToSection('bolsas-professoras')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-gold-50 hover:text-rose-gold-600">
                    Bolsas Professoras
                  </button>
                  <button onClick={() => scrollToSection('bolsas-manicure')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-gold-50 hover:text-rose-gold-600">
                    Bolsas para Manicure
                  </button>
                  <button onClick={() => scrollToSection('acessorios')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-gold-50 hover:text-rose-gold-600">
                    Acessórios
                  </button>
                  <button onClick={() => scrollToSection('necessaire')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-gold-50 hover:text-rose-gold-600">
                    Necessaire
                  </button>
                  <button onClick={() => scrollToSection('mala-de-mao')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-gold-50 hover:text-rose-gold-600">
                    Mala de Mão
                  </button>
                  <button onClick={() => scrollToSection('mala-de-rodinhas')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-gold-50 hover:text-rose-gold-600">
                    Mala de Rodinhas
                  </button>
                </div>
              </div>
            </div>
            <button 
              onClick={() => scrollToSection('todos-produtos')}
              className="text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 font-medium"
            >
              Catálogo
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
            className="lg:hidden text-sage-900 hover:text-rose-gold-500 transition-colors duration-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => scrollToSection('inicio')}
                className="text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left font-medium"
              >
                Início
              </button>
              
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Produtos</p>
                <div className="pl-4 space-y-2">
                  <button onClick={() => scrollToSection('produtos')} className="block text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left text-sm">
                    Bolsas Maternidade
                  </button>
                  <button onClick={() => scrollToSection('bolsas-escolares')} className="block text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left text-sm">
                    Bolsas Escolares
                  </button>
                  <button onClick={() => scrollToSection('mochilas-maternidade')} className="block text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left text-sm">
                    Mochilas Maternidade
                  </button>
                  <button onClick={() => scrollToSection('bolsas-professoras')} className="block text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left text-sm">
                    Bolsas Professoras
                  </button>
                  <button onClick={() => scrollToSection('bolsas-manicure')} className="block text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left text-sm">
                    Bolsas para Manicure
                  </button>
                  <button onClick={() => scrollToSection('acessorios')} className="block text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left text-sm">
                    Acessórios
                  </button>
                  <button onClick={() => scrollToSection('necessaire')} className="block text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left text-sm">
                    Necessaire
                  </button>
                  <button onClick={() => scrollToSection('mala-de-mao')} className="block text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left text-sm">
                    Mala de Mão
                  </button>
                  <button onClick={() => scrollToSection('mala-de-rodinhas')} className="block text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left text-sm">
                    Mala de Rodinhas
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => scrollToSection('todos-produtos')}
                className="text-sage-900 hover:text-rose-gold-500 transition-colors duration-300 text-left font-medium"
              >
                Catálogo Completo
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
