import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonCard,
  IonCardContent,
  IonModal,
  IonFabButton,
  IonFab,
  IonIcon,
  IonFabList,
} from '@ionic/angular/standalone';
import { TodoStoreService } from '../services/todo-store.service';
import { TaskFormComponent } from '../components/task-form/task-form.component';
import { CategoryFilterComponent } from '../components/category-filter/category-filter.component';
import { CategoryManagerComponent } from '../components/category-manager/category-manager.component';
import { TaskListComponent } from '../components/task-list/task-list.component';
import { Category } from '../models/category.model';
import { addIcons } from 'ionicons';
import { add, close, listOutline, pricetagOutline } from 'ionicons/icons';
import { CategoryFormModalComponent } from '../components/category-form-modal/category-form-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonFabList,
    IonIcon,
    IonFab,
    IonFabButton,
    IonModal,
    IonCardContent,
    IonCard,
    IonHeader,
    IonToolbar,
    IonContent,
    TaskFormComponent,
    CategoryFilterComponent,
    CategoryManagerComponent,
    TaskListComponent,
    CategoryFormModalComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  readonly store = inject(TodoStoreService);

  readonly taskModalOpen = signal(false);
  readonly categoryModalOpen = signal(false);
  readonly fabOpen = signal(false);
  readonly editingCategory = signal<Category | null>(null);

  constructor() {
    addIcons({ add, close, listOutline, pricetagOutline });
    void this.store.init();
  }

  closeTaskModal(): void {
    this.taskModalOpen.set(false);
  }

  closeCategoryModal(): void {
    this.categoryModalOpen.set(false);
    this.editingCategory.set(null);
  }

  toggleFab(): void {
    this.fabOpen.update((value) => !value);
  }

  async handleCreateTask(event: {
    title: string;
    categoryId: string | null;
  }): Promise<void> {
    await this.store.addTask(event.title, event.categoryId);
    this.closeTaskModal();
  }

  async handleSaveCategory(event: {
    id?: string;
    name: string;
    color: string;
  }): Promise<void> {
    if (event.id) {
      await this.store.updateCategory({
        id: event.id,
        name: event.name,
        color: event.color,
      });
    } else {
      await this.store.createCategory({
        name: event.name,
        color: event.color,
      });
    }

    this.closeCategoryModal();
  }

  private openAfterFab(callback: () => void): void {
    this.fabOpen.set(false);
    requestAnimationFrame(() => callback());
  }

  openTaskModal(): void {
    this.openAfterFab(() => {
      this.taskModalOpen.set(true);
    });
  }

  openCreateCategoryModal(): void {
    this.openAfterFab(() => {
      this.editingCategory.set(null);
      this.categoryModalOpen.set(true);
    });
  }

  openEditCategoryModal(category: Category): void {
    this.editingCategory.set(category);
    requestAnimationFrame(() => {
      this.categoryModalOpen.set(true);
    });
  }
}
