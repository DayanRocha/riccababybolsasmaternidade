
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/5518996125628"
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
