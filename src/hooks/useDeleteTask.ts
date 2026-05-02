import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../lib/api';

const deleteTaskFn = async (id: number) => {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTaskFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};
