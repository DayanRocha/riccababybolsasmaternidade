import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { seedDatabase } from '@/scripts/seedDatabase';
import { toast } from 'sonner';

const DatabaseSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      toast.success('Banco de dados populado com sucesso!');
    } catch (error) {
      console.error('Erro ao popular banco:', error);
      toast.error('Erro ao popular banco de dados');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>População do Banco de Dados</CardTitle>
        <CardDescription>
          Popule o banco de dados com categorias e produtos de exemplo para testar o sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Este processo irá:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Criar 8 categorias de produtos</li>
              <li>Adicionar produtos de exemplo em cada categoria</li>
              <li>Configurar imagens principais para cada produto</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="w-full"
          >
            {isSeeding ? 'Populando...' : 'Popular Banco de Dados'}
          </Button>
          
          <div className="text-xs text-muted-foreground">
            <p>⚠️ Este processo pode sobrescrever dados existentes com o mesmo nome.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseSeeder;