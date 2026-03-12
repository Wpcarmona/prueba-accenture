import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { Category } from '../../models/category.model';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonHeader,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-category-form-modal',
  templateUrl: './category-form-modal.component.html',
  styleUrls: ['./category-form-modal.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonInput,
    IonLabel,
    IonItem,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormModalComponent {
  readonly category = input<Category | null>(null);

  readonly save = output<{ id?: string; name: string; color: string }>();
  readonly close = output<void>();

  readonly name = signal('');
  readonly color = signal('#5b8def');

  constructor() {
    effect(() => {
      const current = this.category();

      this.name.set(current?.name ?? '');
      this.color.set(current?.color ?? '#5b8def');
    });
  }

  onNameInput(event: Event): void {
    const value = (event.target as HTMLIonInputElement | null)?.value;
    this.name.set(typeof value === 'string' ? value : '');
  }

  onColorInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value;
    this.color.set(value || '#5b8def');
  }

  submit(): void {
    const cleanName = this.name().trim();
    if (!cleanName) return;

    this.save.emit({
      id: this.category()?.id,
      name: cleanName,
      color: this.color(),
    });
  }

  dismiss(): void {
    this.close.emit();
  }
}
