import { ShoppingBag, Users, Star, Truck } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: ShoppingBag,
      number: "9",
      label: "Categorias de Produtos",
      description: "Diversidade para todas as necessidades"
    },
    {
      icon: Users,
      number: "1000+",
      label: "Clientes Satisfeitas",
      description: "Mães que confiam na nossa qualidade"
    },
    {
      icon: Star,
      number: "5.0",
      label: "Avaliação Média",
      description: "Excelência reconhecida"
    },
    {
      icon: Truck,
      number: "100%",
      label: "Entrega Personalizada",
      description: "Atendimento sob medida para você"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-rose-gold-50 via-white to-sage-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por que escolher a <span className="text-rose-gold-600">Ricca Baby</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Números que comprovam nossa dedicação em oferecer produtos de qualidade excepcional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-rose-gold-200"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-gold-500 to-rose-gold-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="mb-4">
                <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-rose-gold-600 transition-colors duration-300">
                  {stat.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {stat.label}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-100">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-gold-400 to-rose-gold-500 border-2 border-white flex items-center justify-center">
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-400 to-sage-500 border-2 border-white flex items-center justify-center">
                <span className="text-white text-sm font-bold">B</span>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">Ricca Baby</p>
              <p className="text-xs text-gray-600">Qualidade Premium Garantida</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;