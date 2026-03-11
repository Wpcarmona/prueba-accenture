import { Injectable, computed, signal } from '@angular/core';
import { Task } from '../models/task.model';
import { Category } from '../models/category.model';
import { TodoStorageService } from './todo-storage.service';

@Injectable()
export class TodoStoreService {
  private readonly _tasks = signal<Task[]>([]);
  private readonly _categories = signal<Category[]>([]);
  private readonly _selectedCategoryId = signal<string | null>(null);

  readonly tasks = this._tasks.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly selectedCategoryId = this._selectedCategoryId.asReadonly();

  readonly filteredTasks = computed(() => {
    const selected = this._selectedCategoryId();
    const tasks = this._tasks();

    if (!selected) return tasks;
    return tasks.filter(task => task.categoryId === selected);
  });

  constructor(private storage: TodoStorageService) {}

  async init(): Promise<void> {
    const [tasks, categories] = await Promise.all([
      this.storage.getTasks(),
      this.storage.getCategories(),
    ]);

    this._tasks.set(tasks);
    this._categories.set(categories);
  }

  async addTask(title: string, categoryId: string | null): Promise<void> {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      categoryId,
      createdAt: new Date().toISOString(),
    };

    const updated = [newTask, ...this._tasks()];
    this._tasks.set(updated);
    await this.storage.saveTasks(updated);
  }

  async toggleTask(taskId: string): Promise<void> {
    const updated = this._tasks().map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    this._tasks.set(updated);
    await this.storage.saveTasks(updated);
  }

  async removeTask(taskId: string): Promise<void> {
    const updated = this._tasks().filter(task => task.id !== taskId);
    this._tasks.set(updated);
    await this.storage.saveTasks(updated);
  }

  async addCategory(name: string): Promise<void> {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
    };

    const updated = [...this._categories(), newCategory];
    this._categories.set(updated);
    await this.storage.saveCategories(updated);
  }

  async updateCategory(categoryId: string, name: string): Promise<void> {
    const updated = this._categories().map(category =>
      category.id === categoryId ? { ...category, name: name.trim() } : category
    );

    this._categories.set(updated);
    await this.storage.saveCategories(updated);
  }

  async removeCategory(categoryId: string): Promise<void> {
    const updatedCategories = this._categories().filter(category => category.id !== categoryId);
    const updatedTasks = this._tasks().map(task =>
      task.categoryId === categoryId ? { ...task, categoryId: null } : task
    );

    this._categories.set(updatedCategories);
    this._tasks.set(updatedTasks);

    await Promise.all([
      this.storage.saveCategories(updatedCategories),
      this.storage.saveTasks(updatedTasks),
    ]);
  }

  setCategoryFilter(categoryId: string | null): void {
    this._selectedCategoryId.set(categoryId);
  }
}