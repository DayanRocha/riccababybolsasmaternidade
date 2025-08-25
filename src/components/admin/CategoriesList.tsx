import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Category } from '@/types/product';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface CategoriesListProps {
  onEdit: (category: Category) => void;
  onAdd: () => void;
  refreshTrigger: number;
}

const CategoriesList = ({ onEdit, onAdd, refreshTrigger }: CategoriesListProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, [refreshTrigger]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar categorias: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryStatus = async (category: Category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !category.is_active })
        .eq('id', category.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Categoria ${category.is_active ? 'desativada' : 'ativada'} com sucesso!`,
      });

      loadCategories();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao alterar status da categoria: " + error.message,
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (category: Category) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      return;
    }

    try {
      // Check if category has products
      const { data: products, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('category_id', category.id)
        .limit(1);

      if (checkError) throw checkError;

      if (products && products.length > 0) {
        toast({
          title: "Erro",
          description: "Não é possível excluir uma categoria que possui produtos associados.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso!",
      });

      loadCategories();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao excluir categoria: " + error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gerenciar Categorias</h2>
          {categories.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {categories.filter(cat => !cat.cover_image_url).length > 0 && (
                <span className="text-orange-600">
                  {categories.filter(cat => !cat.cover_image_url).length} categoria(s) sem capa de imagem
                </span>
              )}
            </p>
          )}
        </div>
        <Button onClick={onAdd} className="bg-pink-600 hover:bg-pink-700 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Nova Categoria</span>
          <span className="sm:hidden">Adicionar Categoria</span>
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">Nenhuma categoria encontrada</p>
          <Button onClick={onAdd} className="bg-pink-600 hover:bg-pink-700">
            <Plus className="h-4 w-4 mr-2" />
            Criar primeira categoria
          </Button>
        </div>
      ) : (
        <>
          {/* Alert for categories without cover */}
          {categories.filter(cat => !cat.cover_image_url).length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Plus className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-orange-800 mb-1">
                  Categorias sem imagem de capa
                </h3>
                <p className="text-sm text-orange-700 mb-3">
                  As seguintes categorias não possuem imagem de capa. Adicionar uma capa melhora a apresentação visual:
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories
                    .filter(cat => !cat.cover_image_url)
                    .map(cat => (
                      <Button
                        key={cat.id}
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(cat)}
                        className="text-orange-700 border-orange-300 hover:bg-orange-100"
                      >
                        {cat.name}
                      </Button>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Cover Image */}
                <div className="lg:w-48 flex-shrink-0">
                  {category.cover_image_url ? (
                    <OptimizedImage
                      src={category.cover_image_url}
                      alt={category.cover_image_alt || category.name}
                      className="w-full h-32 lg:h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div 
                      className="w-full h-32 lg:h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => onEdit(category)}
                    >
                      <Plus className="h-6 w-6 text-gray-400 mb-1" />
                      <span className="text-gray-400 text-xs text-center">
                        Clique para<br />adicionar capa
                      </span>
                    </div>
                  )}
                </div>

                {/* Category Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">/{category.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={category.is_active ? "default" : "secondary"}>
                        {category.is_active ? "Ativa" : "Inativa"}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Ordem: {category.display_order}
                      </span>
                    </div>
                  </div>

                  {category.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                  )}

                  {/* Desktop buttons */}
                  <div className="hidden sm:flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(category)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>

                    {!category.cover_image_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(category)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar Capa
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCategoryStatus(category)}
                    >
                      {category.is_active ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Ativar
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCategory(category)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>

                  {/* Mobile buttons */}
                  <div className="sm:hidden space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(category)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCategoryStatus(category)}
                        className="flex-1"
                      >
                        {category.is_active ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            <span className="hidden xs:inline">Desativar</span>
                            <span className="xs:hidden">Off</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            <span className="hidden xs:inline">Ativar</span>
                            <span className="xs:hidden">On</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {!category.cover_image_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(category)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          <span className="text-xs">Add Capa</span>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCategory(category)}
                        className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${!category.cover_image_url ? '' : 'col-span-2'}`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
};

export default CategoriesList;