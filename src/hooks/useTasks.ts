import { useQuery } from '@tanstack/react-query';
import type { Task } from '../types/task';
import { API_URL } from '../lib/api';

const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks`);
  return response.json();
};

export const useTasks = () => {
  return useQuery({ queryKey: ['tasks'], queryFn: fetchTasks });
};
