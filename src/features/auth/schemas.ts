import { z } from 'zod';

export const MIN_USERNAME_LENGTH = 3;
export const MIN_PASSWORD_LENGTH = 6;

const usernameField = z
  .string()
  .trim()
  .min(1, 'Escolha um nome de usuário.')
  .min(MIN_USERNAME_LENGTH, `O usuário precisa de ao menos ${MIN_USERNAME_LENGTH} caracteres.`);

const passwordField = z
  .string()
  .min(1, 'Escolha uma senha.')
  .min(MIN_PASSWORD_LENGTH, `A senha precisa de ao menos ${MIN_PASSWORD_LENGTH} caracteres.`);

export const signInSchema = z.object({
  username: z.string().trim().min(1, 'Informe seu usuário.'),
  password: z.string().min(1, 'Informe sua senha.'),
});

export const signUpSchema = z
  .object({
    username: usernameField,
    password: passwordField,
    confirmPassword: z.string().min(1, 'Repita a senha para confirmar.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
  });

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe a senha atual.'),
    newPassword: passwordField,
    confirmPassword: z.string().min(1, 'Repita a nova senha para confirmar.'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ['newPassword'],
    message: 'A nova senha precisa ser diferente da atual.',
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
