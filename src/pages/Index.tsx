
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import SchoolBagsSection from "@/components/SchoolBagsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <AboutSection />
      <ProductsSection />
      <SchoolBagsSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
