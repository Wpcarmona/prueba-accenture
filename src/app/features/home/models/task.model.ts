export type TaskSort = 'recent' | 'completed';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string | null;
  createdAt: string;
  completedAt: string | null;
}