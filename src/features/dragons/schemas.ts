import { z } from 'zod';

export const MAX_NAME_LENGTH = 60;
export const MAX_TYPE_LENGTH = 40;

export const dragonFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe o nome do dragão.')
    .max(MAX_NAME_LENGTH, `O nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`),
  type: z
    .string()
    .trim()
    .min(1, 'Informe o tipo do dragão.')
    .max(MAX_TYPE_LENGTH, `O tipo deve ter no máximo ${MAX_TYPE_LENGTH} caracteres.`),
});

export type DragonFormValues = z.infer<typeof dragonFormSchema>;

export const MAX_HISTORY_LENGTH = 1000;
