
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import SchoolBagsSection from "@/components/SchoolBagsSection";
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
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
