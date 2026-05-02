import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../lib/api';

type UpdateTaskData = {
  id: number;
  data: {
    subject?: string;
    description?: string;
    date?: string;
  };
};

const updateTaskFn = async ({ id, data }: UpdateTaskData) => {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export const useUpdateTask = () => {
  return useMutation({ mutationFn: updateTaskFn });
};
