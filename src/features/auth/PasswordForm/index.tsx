import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';

import { MIN_PASSWORD_LENGTH, passwordChangeSchema, type PasswordChangeValues } from '../schemas';

import styles from './PasswordForm.module.scss';

const EMPTY_VALUES: PasswordChangeValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

interface PasswordFormProps {
  onSubmit: (values: PasswordChangeValues) => Promise<void>;
}

export function PasswordForm({ onSubmit }: PasswordFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: EMPTY_VALUES,
  });

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
        reset(EMPTY_VALUES);
      })}
      noValidate
    >
      <TextField
        label="Senha atual"
        type="password"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        {...register('currentPassword')}
      />

      <TextField
        label="Nova senha"
        type="password"
        autoComplete="new-password"
        hint={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres.`}
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />

      <TextField
        label="Confirmar nova senha"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <div className={styles.actions}>
        <Button type="submit" isLoading={isSubmitting}>
          Alterar senha
        </Button>
      </div>
    </form>
  );
}
