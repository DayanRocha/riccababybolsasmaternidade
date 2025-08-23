
import OptimizedImage from '@/components/ui/OptimizedImage';

const Hero = () => {
  return (
    <section id="inicio" className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-fade-in">
          <OptimizedImage 
            src="/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png" 
            alt="Ricca Baby - Bolsas Maternidade Premium" 
            className="h-32 md:h-48 w-auto mx-auto mb-8"
          />
          
          <h1 className="hero-text mb-6">
            Elegância que acompanha
            <br />
            <span className="text-rose-gold-400">cada momento</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto mb-8 leading-relaxed">
            Bolsas maternidade premium com design sofisticado para mães modernas que não abrem mão do estilo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/5518996125628" 
              target="_blank" 
              rel="noopener noreferrer"
              className="whatsapp-button inline-flex items-center justify-center"
            >
              Fale Conosco
            </a>
            <button 
              onClick={() => document.getElementById('bolsas')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 border-2 border-primary-foreground text-primary-foreground font-medium rounded-full hover:bg-primary-foreground hover:text-primary transition-all duration-300"
            >
              Ver Coleção
            </button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-rose-gold-400/20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-primary-foreground/10 animate-pulse delay-1000"></div>
    </section>
  );
};

export default Hero;
