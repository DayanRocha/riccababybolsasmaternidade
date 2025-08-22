import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Product } from '@/types/product';

interface ProductsListProps {
  onEdit: (product: Product) => void;
  onAdd: () => void;
  refreshTrigger?: number;
}

const ProductsList = ({ onEdit, onAdd, refreshTrigger }: ProductsListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, [refreshTrigger]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso!",
      });
      
      loadProducts();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
    setDeleteProduct(null);
  };

  const toggleActive = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Produto ${!product.is_active ? 'ativado' : 'desativado'} com sucesso!`,
      });
      
      loadProducts();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando produtos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Produtos</h2>
          <p className="text-gray-600">Gerencie todos os produtos da loja</p>
        </div>
        <Button
          onClick={onAdd}
          className="bg-pink-600 hover:bg-pink-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum produto encontrado. Clique em "Novo Produto" para adicionar o primeiro.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">Sem img</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {product.categories?.name || 'Sem categoria'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.display_order}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActive(product)}
                        title={product.is_active ? 'Desativar' : 'Ativar'}
                      >
                        {product.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(product)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteProduct(product)}
                        title="Excluir"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir o produto "{deleteProduct?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProduct && handleDelete(deleteProduct)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsList;
