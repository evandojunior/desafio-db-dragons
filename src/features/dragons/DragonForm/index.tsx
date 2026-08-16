import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { Alert } from '@/shared/components/Alert';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';

import {
  MAX_NAME_LENGTH,
  MAX_TYPE_LENGTH,
  dragonFormSchema,
  type DragonFormValues,
} from '../schemas';

import styles from './DragonForm.module.scss';

interface DragonFormProps {
  initialValues?: DragonFormValues;
  submitLabel: string;
  submitError?: string;
  requireChanges?: boolean;
  onSubmit: (values: DragonFormValues) => Promise<void>;
  onCancel: () => void;
}

const EMPTY_VALUES: DragonFormValues = { name: '', type: '' };

export function DragonForm({
  initialValues = EMPTY_VALUES,
  submitLabel,
  submitError,
  requireChanges = false,
  onSubmit,
  onCancel,
}: DragonFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<DragonFormValues>({
    resolver: zodResolver(dragonFormSchema),
    defaultValues: initialValues,
    mode: 'onBlur',
  });

  const values = useWatch({ control, defaultValue: initialValues });

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {submitError && (
        <Alert
          tone="danger"
          title="O registro não foi salvo"
          description={`${submitError} Seus dados continuam preenchidos abaixo, é só tentar de novo.`}
        />
      )}

      <div className={styles.fields}>
        <TextField
          label="Nome"
          placeholder="Digite o nome do dragão"
          autoComplete="off"
          isRequired
          maxLength={MAX_NAME_LENGTH}
          counter={`${values.name?.length ?? 0}/${MAX_NAME_LENGTH}`}
          error={errors.name?.message}
          {...register('name')}
        />

        <TextField
          label="Tipo"
          placeholder="Digite o tipo do dragão"
          autoComplete="off"
          isRequired
          maxLength={MAX_TYPE_LENGTH}
          counter={`${values.type?.length ?? 0}/${MAX_TYPE_LENGTH}`}
          hint="Elemento ou linhagem da criatura."
          error={errors.type?.message}
          {...register('type')}
        />
      </div>

      <p className={styles.legend}>
        <span aria-hidden="true">*</span> Campos obrigatórios.
      </p>

      <div className={styles.actions}>
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting} disabled={requireChanges && !isDirty}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
