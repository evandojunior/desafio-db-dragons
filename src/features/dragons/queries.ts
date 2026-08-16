import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useDragonRepository } from '@/app/providers/useRepositories';
import type { CreateDragonInput, Dragon, UpdateDragonInput } from '@/shared/types';

export const dragonKeys = {
  all: ['dragons'] as const,
  list: () => [...dragonKeys.all, 'list'] as const,
  detail: (id: string) => [...dragonKeys.all, 'detail', id] as const,
};

export function useDragonListQuery() {
  const repository = useDragonRepository();

  return useQuery({
    queryKey: dragonKeys.list(),
    queryFn: ({ signal }) => repository.list(signal),
  });
}

export function useDragonQuery(id: string) {
  const repository = useDragonRepository();

  return useQuery({
    queryKey: dragonKeys.detail(id),
    queryFn: ({ signal }) => repository.findById(id, signal),
    retry: false,
  });
}

export function useCreateDragon() {
  const repository = useDragonRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDragonInput) => repository.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: dragonKeys.all }),
  });
}

export function useUpdateDragon(id: string) {
  const repository = useDragonRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateDragonInput) => repository.update(id, input),
    onSuccess: (dragon) => {
      queryClient.setQueryData(dragonKeys.detail(id), dragon);
      return queryClient.invalidateQueries({ queryKey: dragonKeys.list() });
    },
  });
}

export function useDeleteDragon() {
  const repository = useDragonRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repository.remove(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: dragonKeys.list() });

      const previous = queryClient.getQueryData<Dragon[]>(dragonKeys.list());

      queryClient.setQueryData<Dragon[]>(dragonKeys.list(), (current) =>
        current?.filter((dragon) => dragon.id !== id),
      );

      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(dragonKeys.list(), context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: dragonKeys.all }),
  });
}
