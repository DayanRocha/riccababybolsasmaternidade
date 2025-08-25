
import OptimizedImage from '@/components/ui/OptimizedImage';

const Hero = () => {
  return (
    <section id="inicio" className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="container mx-auto px-0 sm:px-4 text-center relative z-10 pt-20 sm:pt-16 md:pt-0">
        <div className="animate-fade-in">
          <div className="relative mb-6 sm:mb-8 -mt-4 sm:mt-8 md:mt-0">
            <OptimizedImage 
              src="/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png" 
              alt="Ricca Baby - Bolsas Maternidade Premium" 
              className="w-full h-[calc(60vh)] sm:h-48 md:h-56 lg:h-64 xl:h-72 sm:w-auto mx-auto object-contain filter drop-shadow-2xl"
            />
          </div>

          {/* Mobile: Botões logo abaixo da logo */}
          <div className="sm:hidden px-6 flex flex-col gap-4 mb-8">
            <a 
              href="https://wa.me/5518996125628" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>Fale Conosco</span>
            </a>
            <button 
              onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full backdrop-blur-sm bg-white/20 shadow-lg"
            >
              Ver Coleção Completa
            </button>
          </div>
          
          <div className="hidden sm:block">
            <h1 className="hero-text mb-6">
              Elegância que acompanha
              <br />
              <span className="text-rose-gold-400">cada momento</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Descubra nossa coleção completa: bolsas maternidade, mochilas, necessaires, malas e muito mais. 
              <span className="text-rose-gold-300 font-semibold">Qualidade premium para todas as ocasiões.</span>
            </p>
          </div>
          
          {/* Desktop: Botões normais */}
          <div className="hidden sm:flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/5518996125628" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span className="relative z-10">Fale Conosco</span>
            </a>
            <button 
              onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-primary-foreground text-primary-foreground font-semibold rounded-full hover:bg-primary-foreground hover:text-primary transition-all duration-300 transform hover:scale-105"
            >
              Ver Coleção Completa
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
