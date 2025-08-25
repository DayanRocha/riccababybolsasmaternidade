
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import ProductsSection from "@/components/ProductsSection";
import SchoolBagsSection from "@/components/SchoolBagsSection";
import CategorySection from "@/components/CategorySection";
import AllProductsSection from "@/components/AllProductsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <>
      <SEO 
        title="Ricca Baby - Bolsas Maternidade Premium"
        description="Bolsas maternidade elegantes e funcionais para mães modernas. Design sofisticado, qualidade premium e praticidade para o dia a dia da maternidade."
        url="https://riccababy.com"
        image="/og-image.jpg"
      />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Hero />
        <AboutSection />
        <ProductsSection />
        <SchoolBagsSection />
        
        {/* Novas Categorias */}
        <CategorySection
          categorySlug="mochilas-maternidade"
          title="Mochilas Maternidade"
          description="Mochilas práticas e elegantes, perfeitas para mães que precisam de mobilidade sem abrir mão do estilo e funcionalidade."
          sectionId="mochilas-maternidade"
          backgroundColor="bg-background"
        />
        
        <CategorySection
          categorySlug="bolsas-professoras"
          title="Bolsas Professoras"
          description="Bolsas especialmente desenvolvidas para profissionais da educação, com compartimentos organizados para materiais didáticos."
          sectionId="bolsas-professoras"
          backgroundColor="bg-muted/30"
        />
        
        <CategorySection
          categorySlug="bolsas-manicure"
          title="Bolsas para Manicure"
          description="Bolsas profissionais para manicures e pedicures, com divisórias especiais para organizar todos os seus equipamentos."
          sectionId="bolsas-manicure"
          backgroundColor="bg-background"
        />
        
        <CategorySection
          categorySlug="acessorios"
          title="Acessórios"
          description="Acessórios complementares que tornam sua rotina ainda mais prática e organizada."
          sectionId="acessorios"
          backgroundColor="bg-muted/30"
        />
        
        <CategorySection
          categorySlug="necessaire"
          title="Necessaire"
          description="Necessaires elegantes e funcionais para organizar seus cosméticos e itens pessoais com praticidade."
          sectionId="necessaire"
          backgroundColor="bg-background"
        />
        
        <CategorySection
          categorySlug="mala-de-mao"
          title="Mala de Mão"
          description="Malas compactas e sofisticadas, ideais para viagens curtas e uso no dia a dia."
          sectionId="mala-de-mao"
          backgroundColor="bg-muted/30"
        />
        
        <CategorySection
          categorySlug="mala-de-rodinhas"
          title="Mala de Rodinhas"
          description="Malas com rodinhas de alta qualidade para viagens confortáveis, combinando praticidade e elegância."
          sectionId="mala-de-rodinhas"
          backgroundColor="bg-background"
        />
        
        {/* Seção "Por que escolher a Ricca Baby" após todas as categorias */}
        <StatsSection />
        
        {/* Seção com todos os produtos e filtros */}
        <AllProductsSection />
        
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
