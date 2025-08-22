
-- Primeiro, vamos remover as políticas existentes que estão causando recursão
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Criar novas políticas mais simples que não causem recursão
-- Permitir que usuários vejam apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Permitir que usuários atualizem apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Permitir inserção de novos perfis (necessário para criação automática)
CREATE POLICY "Enable insert for authenticated users" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Política especial para permitir que o sistema crie perfis automaticamente
-- usando uma função que não causa recursão
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role = 'admin'
    );
$$;

-- Política para admins gerenciarem todos os perfis usando a função
CREATE POLICY "Admins can manage all profiles" ON public.profiles
    FOR ALL USING (public.is_admin_user(auth.uid()));
