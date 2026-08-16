import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';

import { MIN_PASSWORD_LENGTH, signUpSchema, type SignUpValues } from '../schemas';

import styles from './SignUpForm.module.scss';

interface SignUpFormProps {
  onSubmit: (values: SignUpValues) => Promise<void>;
}

export function SignUpForm({ onSubmit }: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: '', password: '', confirmPassword: '' },
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        label="Usuário"
        autoComplete="username"
        placeholder="como quer ser chamado"
        error={errors.username?.message}
        {...register('username')}
      />

      <TextField
        label="Senha"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        hint={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres.`}
        error={errors.password?.message}
        {...register('password')}
      />

      <TextField
        label="Confirmar senha"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" isLoading={isSubmitting} fullWidth>
        Criar conta
      </Button>
    </form>
  );
}
