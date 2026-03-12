import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Category } from '../models/category.model';
import { Task } from '../models/task.model';

const TASKS_KEY = 'todo_tasks';
const CATEGORIES_KEY = 'todo_categories';

@Injectable({ providedIn: 'root' })
export class TodoStorageService {
  private readonly storage = inject(Storage);
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;
    await this.storage.create();
    this.initialized = true;
  }

  async loadState(): Promise<{ tasks: Task[]; categories: Category[] }> {
    await this.init();

    const [tasks, categories] = await Promise.all([
      this.storage.get(TASKS_KEY),
      this.storage.get(CATEGORIES_KEY),
    ]);

    return {
      tasks: Array.isArray(tasks) ? tasks : [],
      categories: Array.isArray(categories) ? categories : [],
    };
  }

  async saveState(state: { tasks: Task[]; categories: Category[] }): Promise<void> {
    await this.init();

    await Promise.all([
      this.storage.set(TASKS_KEY, state.tasks),
      this.storage.set(CATEGORIES_KEY, state.categories),
    ]);
  }
}