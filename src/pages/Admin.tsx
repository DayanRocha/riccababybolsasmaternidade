
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import AuthForm from '@/components/admin/AuthForm';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductsList from '@/components/admin/ProductsList';
import ProductForm from '@/components/admin/ProductForm';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';

const AUTHORIZED_ADMIN_EMAIL = 'dayan_erikas2@hotmail.com';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorizedEmail, setIsAuthorizedEmail] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        checkAdminAccess(user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          checkAdminAccess(session.user);
        } else {
          setIsAdmin(false);
          setIsAuthorizedEmail(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminAccess = async (user: User) => {
    try {
      // First check if email is authorized
      const emailAuthorized = user.email === AUTHORIZED_ADMIN_EMAIL;
      setIsAuthorizedEmail(emailAuthorized);

      if (!emailAuthorized) {
        setIsAdmin(false);
        setLoading(false);
        toast({
          title: "Acesso negado",
          description: "Este email não tem autorização para acessar o painel administrativo.",
          variant: "destructive",
        });
        return;
      }

      // If email is authorized, check admin role in database
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
        toast({
          title: "Erro",
          description: "Erro ao verificar permissões de administrador.",
          variant: "destructive",
        });
      } else if (!data) {
        // Profile doesn't exist yet
        console.log('Profile not found for user:', user.id);
        setIsAdmin(false);
        toast({
          title: "Perfil não encontrado",
          description: "Seu perfil ainda está sendo criado. Tente novamente em alguns instantes.",
          variant: "destructive",
        });
      } else {
        const userIsAdmin = data.role === 'admin';
        setIsAdmin(userIsAdmin);
        if (!userIsAdmin) {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar o painel administrativo.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
      setIsAuthorizedEmail(false);
      toast({
        title: "Erro",
        description: "Erro inesperado ao verificar permissões.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setCurrentView('form');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setCurrentView('form');
  };

  const handleSaveProduct = () => {
    setCurrentView('list');
    setEditingProduct(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancelEdit = () => {
    setCurrentView('list');
    setEditingProduct(null);
  };

  // Phase 5: Better session validation
  const handleSessionError = () => {
    toast({
      title: "Sessão expirada",
      description: "Sua sessão expirou. Faça login novamente.",
      variant: "destructive",
    });
    supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  if (!isAuthorizedEmail || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-4">
            {!isAuthorizedEmail 
              ? "Este email não está autorizado a acessar o painel administrativo."
              : "Você não tem permissão para acessar o painel administrativo."
            }
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-pink-600 hover:underline"
          >
            Fazer logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout userEmail={user.email}>
      <div className="px-4 py-6">
        {currentView === 'list' ? (
          <ProductsList
            onEdit={handleEditProduct}
            onAdd={handleAddProduct}
            refreshTrigger={refreshTrigger}
          />
        ) : (
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={handleCancelEdit}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Admin;
