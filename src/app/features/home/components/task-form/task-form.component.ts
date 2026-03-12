import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Category } from '../../models/category.model';
import {
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,IonButtons, IonTitle, IonToolbar, IonHeader } from '@ionic/angular/standalone';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons,
    IonInput,
    IonLabel,
    IonItem,
    IonButton,
    IonSelect,
    IonSelectOption
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent {
  readonly categories = input<readonly Category[]>([]);
  readonly categoriesEnabled = input(false);

  readonly createTask = output<{ title: string; categoryId: string | null }>();
  readonly close = output<void>();

  readonly title = signal('');
  readonly categoryId = signal<string | null>(null);

  onTitleInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value;
    this.title.set(typeof value === 'string' ? value : '');
  }

  onCategoryChange(event: CustomEvent): void {
    this.categoryId.set(event.detail.value ?? null);
  }

  submit(): void {
    const cleanTitle = this.title().trim();
    if (!cleanTitle) return;

    this.createTask.emit({
      title: cleanTitle,
      categoryId: this.categoriesEnabled() ? this.categoryId() : null,
    });

    this.title.set('');
    this.categoryId.set(null);
  }

  dismiss(): void {
    this.close.emit();
  }
}
