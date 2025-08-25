
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Ricca Baby</h1>
                <p className="text-xs sm:text-sm text-gray-500">Painel Administrativo</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-600 truncate max-w-full sm:max-w-none">
                {userEmail}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full sm:w-auto justify-center"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
                <span className="sm:hidden">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation - Removed categories tab */}
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
