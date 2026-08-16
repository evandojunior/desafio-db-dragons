import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';

import { signInSchema, type SignInValues } from '../schemas';

import styles from './SignInForm.module.scss';

interface SignInFormProps {
  onSubmit: (values: SignInValues) => Promise<void>;
}

export function SignInForm({ onSubmit }: SignInFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { username: '', password: '' },
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        label="Usuário"
        autoComplete="username"
        placeholder="seu.usuario"
        error={errors.username?.message}
        {...register('username')}
      />

      <TextField
        label="Senha"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" isLoading={isSubmitting} fullWidth>
        Entrar
      </Button>
    </form>
  );
}
