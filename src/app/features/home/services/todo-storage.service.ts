import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task } from '../models/task.model';
import { Category } from '../models/category.model';

const TASKS_KEY = 'tasks';
const CATEGORIES_KEY = 'categories';

@Injectable({ providedIn: 'root' })
export class TodoStorageService {
  private readonly storage = inject(Storage);
  private isReady = false;

  async init(): Promise<void> {
    if (this.isReady) return;
    await this.storage.create();
    this.isReady = true;
  }

  async getTasks(): Promise<Task[]> {
    await this.init();
    return (await this.storage.get(TASKS_KEY)) ?? [];
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    await this.init();
    await this.storage.set(TASKS_KEY, tasks);
  }

  async getCategories(): Promise<Category[]> {
    await this.init();
    return (await this.storage.get(CATEGORIES_KEY)) ?? [];
  }

  async saveCategories(categories: Category[]): Promise<void> {
    await this.init();
    await this.storage.set(CATEGORIES_KEY, categories);
  }
}