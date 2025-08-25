import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const Collections = () => {
  const categories = [
    {
      slug: "bolsas-maternidade",
      title: "Bolsas Maternidade",
      description: "Bolsas elegantes e funcionais para o dia a dia da maternidade",
      image: "/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png"
    },
    {
      slug: "mochilas-maternidade", 
      title: "Mochilas Maternidade",
      description: "Mochilas práticas e elegantes para mães em movimento",
      image: "/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png"
    },
    {
      slug: "bolsas-professoras",
      title: "Bolsas Professoras", 
      description: "Bolsas organizadas para profissionais da educação",
      image: "/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png"
    },
    {
      slug: "bolsas-manicure",
      title: "Bolsas para Manicure",
      description: "Bolsas profissionais com compartimentos especializados",
      image: "/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png"
    },
    {
      slug: "acessorios",
      title: "Acessórios",
      description: "Acessórios complementares para sua rotina",
      image: "/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png"
    },
    {
      slug: "necessaire",
      title: "Necessaire",
      description: "Necessaires elegantes e funcionais",
      image: "/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png"
    },
    {
      slug: "mala-de-mao",
      title: "Mala de Mão",
      description: "Malas compactas para viagens e uso diário",
      image: "/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png"
    },
    {
      slug: "mala-de-rodinhas",
      title: "Mala de Rodinhas", 
      description: "Malas com rodinhas para viagens confortáveis",
      image: "/lovable-uploads/b6e94355-695d-454b-89b9-8c4d30200f7f.png"
    }
  ];

  return (
    <>
      <SEO 
        title="Coleções - Ricca Baby"
        description="Explore todas as nossas coleções de bolsas maternidade, mochilas, acessórios e muito mais."
        url="https://riccababy.com/collections"
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-sage-800">
              Nossas Coleções
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra nossa linha completa de produtos desenvolvidos especialmente para você
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-sage-800">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {category.description}
                      </p>
                      <Button className="w-full bg-sage-600 hover:bg-sage-700">
                        Ver Produtos
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Collections;