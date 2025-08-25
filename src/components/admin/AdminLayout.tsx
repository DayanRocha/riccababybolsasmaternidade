
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import '@/styles/admin-mobile.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  userEmail?: string;
  currentView?: string;
  onViewChange?: (view: 'products') => void;
}

const AdminLayout = ({ children, userEmail, currentView, onViewChange }: AdminLayoutProps) => {
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Ricca Baby</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Painel Administrativo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className="hidden sm:block">
                <span className="text-sm text-gray-600 truncate max-w-[200px]">
                  {userEmail}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
          
          {/* Mobile user email */}
          <div className="sm:hidden pb-2 border-t border-gray-100 pt-2">
            <span className="text-xs text-gray-600 truncate block">
              {userEmail}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
