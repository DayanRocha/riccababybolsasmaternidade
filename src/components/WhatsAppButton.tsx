
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  message?: string;
  categoryName?: string;
  categoryImage?: string;
}

const WhatsAppButton = ({ message, categoryName, categoryImage }: WhatsAppButtonProps) => {
  const getWhatsAppUrl = () => {
    let finalMessage = message;
    
    if (!finalMessage && categoryName) {
      finalMessage = `🌟 Olá! Tenho interesse em conhecer mais sobre ${categoryName}!\n\n`;
      finalMessage += `📍 Estou navegando na página: ${window.location.href}\n`;
      
      if (categoryImage) {
        finalMessage += `\n📸 Categoria: ${categoryImage}\n`;
      }
      
      finalMessage += `\n💬 Gostaria de saber mais sobre os produtos disponíveis, preços e formas de pagamento.`;
    }
    
    if (!finalMessage) {
      finalMessage = "Olá! Gostaria de saber mais sobre os produtos da Ricca Baby.";
    }
    
    return `https://wa.me/5518996125628?text=${encodeURIComponent(finalMessage)}`;
  };

  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rose-gold-gradient rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="text-white" size={24} />
    </a>
  );
};

export default WhatsAppButton;
