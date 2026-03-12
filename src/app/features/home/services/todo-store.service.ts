import { Injectable, computed, inject, signal } from '@angular/core';
import { Category } from '../models/category.model';
import { Task, TaskSort } from '../models/task.model';
import { TodoStorageService } from './todo-storage.service';
import { RemoteConfigService } from 'src/app/core/services/remote-config-firebase';

type CategoryFilter = 'all' | 'uncategorized' | string;

const FEATURE_CATEGORIES_ENABLED = 'feature_categories_enabled';

@Injectable({ providedIn: 'root' })
export class TodoStoreService {
  private readonly storage = inject(TodoStorageService);
  private readonly remoteConfig = inject(RemoteConfigService);

  private readonly _tasks = signal<Task[]>([]);
  private readonly _categories = signal<Category[]>([]);
  private readonly _selectedCategoryId = signal<CategoryFilter>('all');
  private readonly _sortBy = signal<TaskSort>('recent');
  private readonly _categoriesEnabled = signal(true);
  private readonly _ready = signal(false);

  readonly tasks = this._tasks.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly selectedCategoryId = this._selectedCategoryId.asReadonly();
  readonly sortBy = this._sortBy.asReadonly();
  readonly categoriesEnabled = this._categoriesEnabled.asReadonly();
  readonly ready = this._ready.asReadonly();

  readonly totalTasks = computed(() => this._tasks().length);
  readonly completedTasks = computed(() => this._tasks().filter(task => task.completed).length);
  readonly pendingTasks = computed(() => this.totalTasks() - this.completedTasks());

  readonly categoryCountMap = computed<Record<string, number>>(() => {
    const tasks = this._tasks();
    const counts: Record<string, number> = {
      all: tasks.length,
      uncategorized: 0,
    };

    for (const task of tasks) {
      if (!task.categoryId) {
        counts["uncategorized"] = (counts["uncategorized"] ?? 0) + 1;
        continue;
      }

      counts[task.categoryId] = (counts[task.categoryId] ?? 0) + 1;
    }

    return counts;
  });

  readonly visibleTasks = computed(() => {
    const selectedCategoryId = this._selectedCategoryId();
    const sortBy = this._sortBy();

    let tasks = [...this._tasks()];

    if (this._categoriesEnabled()) {
      if (selectedCategoryId === 'uncategorized') {
        tasks = tasks.filter(task => !task.categoryId);
      } else if (selectedCategoryId !== 'all') {
        tasks = tasks.filter(task => task.categoryId === selectedCategoryId);
      }
    }

    if (sortBy === 'recent') {
      tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (sortBy === 'completed') {
      tasks.sort((a, b) => {
        if (a.completed === b.completed) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return Number(b.completed) - Number(a.completed);
      });
    }

    return tasks;
  });

  readonly categoriesSorted = computed(() =>
    [...this._categories()].sort((a, b) => a.name.localeCompare(b.name, 'es'))
  );

  async init(): Promise<void> {
    if (this._ready()) return;

    const [{ tasks, categories }] = await Promise.all([
      this.storage.loadState(),
      this.loadRemoteFlags(),
    ]);

    this._tasks.set(tasks);
    this._categories.set(categories);
    this._ready.set(true);
  }

  private async loadRemoteFlags(): Promise<void> {
    try {
      await this.remoteConfig.init();
      this._categoriesEnabled.set(this.remoteConfig.isEnabled(FEATURE_CATEGORIES_ENABLED));
    } catch {
      this._categoriesEnabled.set(true);
    }
  }

  private async persist(): Promise<void> {
    await this.storage.saveState({
      tasks: this._tasks(),
      categories: this._categories(),
    });
  }

  private createId(): string {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  async addTask(title: string, categoryId: string | null): Promise<void> {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    const newTask: Task = {
      id: this.createId(),
      title: cleanTitle,
      completed: false,
      categoryId: this._categoriesEnabled() ? categoryId : null,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    this._tasks.update(tasks => [newTask, ...tasks]);
    await this.persist();
  }

  async toggleTask(taskId: string): Promise<void> {
    this._tasks.update(tasks =>
      tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null,
            }
          : task
      )
    );

    await this.persist();
  }

  async removeTask(taskId: string): Promise<void> {
    this._tasks.update(tasks => tasks.filter(task => task.id !== taskId));
    await this.persist();
  }

  async createCategory(payload: { name: string; color: string }): Promise<void> {
    const cleanName = payload.name.trim();
    if (!cleanName) return;

    const newCategory: Category = {
      id: this.createId(),
      name: cleanName,
      color: payload.color,
      createdAt: new Date().toISOString(),
    };

    this._categories.update(categories => [...categories, newCategory]);
    await this.persist();
  }

  async updateCategory(payload: { id: string; name: string; color: string }): Promise<void> {
    const cleanName = payload.name.trim();
    if (!cleanName) return;

    this._categories.update(categories =>
      categories.map(category =>
        category.id === payload.id
          ? {
              ...category,
              name: cleanName,
              color: payload.color,
            }
          : category
      )
    );

    await this.persist();
  }

  async removeCategory(categoryId: string): Promise<void> {
    this._categories.update(categories => categories.filter(category => category.id !== categoryId));

    this._tasks.update(tasks =>
      tasks.map(task =>
        task.categoryId === categoryId
          ? { ...task, categoryId: null }
          : task
      )
    );

    if (this._selectedCategoryId() === categoryId) {
      this._selectedCategoryId.set('all');
    }

    await this.persist();
  }

  setCategoryFilter(categoryId: CategoryFilter): void {
    this._selectedCategoryId.set(categoryId);
  }

  setSortBy(sortBy: TaskSort): void {
    this._sortBy.set(sortBy);
  }
}