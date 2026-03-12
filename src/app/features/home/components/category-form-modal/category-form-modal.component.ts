import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { Category } from '../../models/category.model';
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  checkmarkOutline,
  closeOutline,
  colorPaletteOutline,
  pricetagOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-category-form-modal',
  templateUrl: './category-form-modal.component.html',
  styleUrls: ['./category-form-modal.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonInput,
    IonItem,
    IonIcon,
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

  readonly presetColors = [
    '#5b5cf0',
    '#7c3aed',
    '#ec4899',
    '#ef4444',
    '#f59e0b',
    '#10b981',
    '#06b6d4',
    '#3b82f6',
  ] as const;

  readonly isEdit = computed(() => !!this.category());

  readonly modalTitle = computed(() =>
    this.isEdit() ? 'Editar categoría' : 'Nueva categoría',
  );

  constructor() {
    addIcons({
      pricetagOutline,
      closeOutline,
      colorPaletteOutline,
      checkmarkOutline,
      checkmarkCircleOutline,
    });

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

  setPresetColor(color: string): void {
    this.color.set(color);
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
