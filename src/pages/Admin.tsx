
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import AuthForm from '@/components/admin/AuthForm';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductsList from '@/components/admin/ProductsList';
import ProductFormWithDetection from '@/components/admin/ProductFormWithDetection';

import SEO from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';
import { Product, Category } from '@/types/product';

const AUTHORIZED_ADMIN_EMAIL = 'dayan_erikas2@hotmail.com';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorizedEmail, setIsAuthorizedEmail] = useState(false);
  const [currentView, setCurrentView] = useState<'products' | 'product-form' | 'category-form'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getUser().then(({ data: { user } }) => {
      console.log('Current user:', user);
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
        console.log('Auth state changed:', event, session?.user);
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
      console.log('Checking admin access for user:', user.email);
      
      // First check if email is authorized
      const emailAuthorized = user.email === AUTHORIZED_ADMIN_EMAIL;
      setIsAuthorizedEmail(emailAuthorized);
      console.log('Email authorized:', emailAuthorized);

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
      console.log('Checking profile for user ID:', user.id);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      console.log('Profile query result:', { profile, error });

      if (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
        toast({
          title: "Erro",
          description: "Erro ao verificar permissões de administrador.",
          variant: "destructive",
        });
      } else if (!profile) {
        // Profile doesn't exist yet, let's create it
        console.log('Profile not found, creating admin profile for user:', user.id);
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            role: 'admin'
          })
          .select()
          .single();

        console.log('Profile creation result:', { newProfile, createError });

        if (createError) {
          console.error('Error creating profile:', createError);
          setIsAdmin(false);
          toast({
            title: "Erro",
            description: "Erro ao criar perfil de administrador.",
            variant: "destructive",
          });
        } else {
          setIsAdmin(true);
          toast({
            title: "Acesso liberado",
            description: "Perfil de administrador criado com sucesso!",
          });
        }
      } else {
        const userIsAdmin = profile.role === 'admin';
        console.log('User role:', profile.role, 'Is admin:', userIsAdmin);
        setIsAdmin(userIsAdmin);
        if (!userIsAdmin) {
          // If user exists but is not admin, update to admin since email is authorized
          console.log('Updating user role to admin');
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id);

          if (updateError) {
            console.error('Error updating role:', updateError);
            toast({
              title: "Erro",
              description: "Erro ao atualizar permissões.",
              variant: "destructive",
            });
          } else {
            setIsAdmin(true);
            toast({
              title: "Acesso liberado",
              description: "Permissões de administrador atualizadas!",
            });
          }
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
    setCurrentView('product-form');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setCurrentView('product-form');
  };

  const handleSaveProduct = () => {
    setCurrentView('products');
    setEditingProduct(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancelProductEdit = () => {
    setCurrentView('products');
    setEditingProduct(null);
  };

  const handleEditCategoryFromProducts = (category: Category) => {
    setEditingCategory(category);
    setCurrentView('category-form');
  };

  const handleSaveCategory = () => {
    setCurrentView('products');
    setEditingCategory(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancelCategoryEdit = () => {
    setCurrentView('products');
    setEditingCategory(null);
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
    <>
      <SEO 
        title="Painel Administrativo - Ricca Baby"
        description="Painel administrativo para gerenciar produtos da Ricca Baby"
        url="https://riccababy.com/admin"
      />
      <AdminLayout 
        userEmail={user.email}
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
      >
        <div className="px-2 sm:px-4 py-4 sm:py-6">
          {currentView === 'products' && (
            <ProductsList
              onEdit={handleEditProduct}
              onAdd={handleAddProduct}
              onEditCategory={handleEditCategoryFromProducts}
              refreshTrigger={refreshTrigger}
            />
          )}
          
          {currentView === 'product-form' && (
            <ProductFormWithDetection
              product={editingProduct}
              onSave={handleSaveProduct}
              onCancel={handleCancelProductEdit}
            />
          )}

          {currentView === 'category-form' && (
            <CategoryForm
              category={editingCategory}
              onSave={handleSaveCategory}
              onCancel={handleCancelCategoryEdit}
            />
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default Admin;
