
const AboutSection = () => {
  return (
    <section id="sobre" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title">Sobre a Ricca Baby</h2>
          
          <div className="animate-fade-in">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              A Ricca Baby nasceu do desejo de oferecer às mães modernas bolsas maternidade que combinam 
              funcionalidade excepcional com design sofisticado. Cada peça é cuidadosamente desenvolvida 
              pensando no dia a dia das famílias contemporâneas, sem abrir mão da elegância e qualidade premium.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              Nossa missão é acompanhar você em cada momento especial da maternidade, oferecendo praticidade 
              e estilo que se adaptam perfeitamente ao seu ritmo de vida.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 rose-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Design Premium</h3>
                <p className="text-muted-foreground">Peças únicas com acabamento impecável</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rose-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤱</span>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Funcionalidade</h3>
                <p className="text-muted-foreground">Pensadas para o dia a dia das mães</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rose-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Qualidade</h3>
                <p className="text-muted-foreground">Materiais selecionados e duradouros</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
