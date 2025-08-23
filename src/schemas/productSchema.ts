import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional().or(z.literal("")),
  image_url: z.string().url("URL da imagem inválida").optional().or(z.literal("")),
  image_alt: z.string().min(1, "Texto alternativo é obrigatório"),
  category_id: z.string().uuid("ID da categoria inválido"),
  whatsapp_link: z.string().url("Link do WhatsApp inválido").optional().or(z.literal("")),
  is_active: z.boolean().default(true),
  display_order: z.number().int().min(0, "Ordem de exibição deve ser um número positivo").default(0)
});

export type ProductFormData = z.infer<typeof productSchema>;