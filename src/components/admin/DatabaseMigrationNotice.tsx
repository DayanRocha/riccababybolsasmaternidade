import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DatabaseMigrationNotice = () => {
  const handleCopySQL = () => {
    const sql = `-- Script para adicionar colunas de capa da categoria
-- Execute este script no SQL Editor do painel do Supabase

DO $$ 
BEGIN
    -- Adicionar cover_image_url se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'categories' 
        AND column_name = 'cover_image_url'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN cover_image_url TEXT;
        COMMENT ON COLUMN public.categories.cover_image_url IS 'URL da imagem de capa da categoria';
    END IF;

    -- Adicionar cover_image_alt se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'categories' 
        AND column_name = 'cover_image_alt'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN cover_image_alt TEXT;
        COMMENT ON COLUMN public.categories.cover_image_alt IS 'Texto alternativo para a imagem de capa da categoria';
    END IF;
END $$;`;

    navigator.clipboard.writeText(sql);
    alert('SQL copiado para a área de transferência!');
  };

  return (
    <Alert className="mb-6 border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">Migração de Banco Necessária</AlertTitle>
      <AlertDescription className="text-orange-700">
        <p className="mb-3">
          Para usar a funcionalidade de capas de categorias, você precisa executar uma migração no banco de dados.
        </p>
        <div className="space-y-2">
          <p className="text-sm font-medium">Passos:</p>
          <ol className="text-sm list-decimal list-inside space-y-1 ml-2">
            <li>Acesse o painel do Supabase</li>
            <li>Vá para "SQL Editor"</li>
            <li>Cole o script SQL abaixo</li>
            <li>Execute o script</li>
            <li>Recarregue esta página</li>
          </ol>
        </div>
        <Button
          onClick={handleCopySQL}
          variant="outline"
          size="sm"
          className="mt-3 text-orange-700 border-orange-300 hover:bg-orange-100"
        >
          <Database className="h-3 w-3 mr-1" />
          Copiar Script SQL
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default DatabaseMigrationNotice;