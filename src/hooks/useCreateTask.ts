import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../lib/api';

type CreateTaskData = {
  subject: string;
  description: string;
  date: string;
};

const createTaskFn = async (data: CreateTaskData) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.error ?? 'Erro ao criar task');
  return json;
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTaskFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};
