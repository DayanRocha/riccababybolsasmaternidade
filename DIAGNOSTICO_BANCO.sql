-- DIAGNÓSTICO DO BANCO DE DADOS
-- Execute este código no Supabase SQL Editor para diagnosticar o problema

-- 1. Verificar se a tabela products existe
SELECT 'Tabela products existe?' as check_type,
       CASE WHEN EXISTS (
           SELECT 1 FROM information_schema.tables 
           WHERE table_name = 'products' AND table_schema = 'public'
       ) THEN 'SIM' ELSE 'NÃO' END as result;

-- 2. Verificar se a tabela categories existe
SELECT 'Tabela categories existe?' as check_type,
       CASE WHEN EXISTS (
           SELECT 1 FROM information_schema.tables 
           WHERE table_name = 'categories' AND table_schema = 'public'
       ) THEN 'SIM' ELSE 'NÃO' END as result;

-- 3. Verificar colunas da tabela products
SELECT 'Colunas da tabela products:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Verificar colunas da tabela categories (se existir)
SELECT 'Colunas da tabela categories:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'categories' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Verificar foreign keys
SELECT 'Foreign keys da tabela products:' as info;
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'products'
    AND tc.table_schema = 'public';

-- 6. Contar registros
SELECT 'Contagem de registros:' as info;
SELECT 
    (SELECT COUNT(*) FROM public.products) as total_products,
    (SELECT COUNT(*) FROM public.categories) as total_categories;

-- 7. Verificar políticas RLS
SELECT 'Políticas RLS:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('products', 'categories');

-- 8. Verificar se RLS está habilitado
SELECT 'RLS habilitado:' as info;
SELECT schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('products', 'categories');