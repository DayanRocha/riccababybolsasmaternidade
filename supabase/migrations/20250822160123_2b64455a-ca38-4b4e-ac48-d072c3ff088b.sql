
-- Atualizar o perfil do usuário autorizado para role 'admin'
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'dayan_erikas2@hotmail.com';

-- Se o perfil ainda não existir, vamos criá-lo
INSERT INTO public.profiles (id, email, role)
SELECT auth.users.id, auth.users.email, 'admin'
FROM auth.users 
WHERE auth.users.email = 'dayan_erikas2@hotmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.email = 'dayan_erikas2@hotmail.com'
);
