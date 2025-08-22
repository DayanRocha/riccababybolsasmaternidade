
-- Phase 1: Fix Critical RLS Recursion Issue
-- Create a security definer function to safely check user roles without causing recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Phase 2: Fix Privilege Escalation Vulnerability
-- Drop existing problematic policies on profiles table
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new secure policies using the security definer function
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile (except role)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  -- Prevent users from changing their own role
  (OLD.role = NEW.role OR public.get_current_user_role() = 'admin')
);

CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Update other tables to use the new security definer function
-- Fix products table policies
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;

CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can view all products" 
ON public.products 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

-- Fix categories table policies
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;

CREATE POLICY "Admins can manage categories" 
ON public.categories 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Fix the handle_new_user function security issue
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$function$;
