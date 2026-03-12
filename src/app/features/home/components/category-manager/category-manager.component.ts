import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Category } from '../../models/category.model';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonList,
  IonNote,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  createOutline,
  folderOpenOutline,
  pricetagsOutline,
  trashOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.scss'],
  imports: [
    IonIcon,
    IonNote,
    IonList,
    IonButton,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryManagerComponent {
  readonly categories = input<readonly Category[]>([]);
  readonly countMap = input<Record<string, number>>({});

  readonly editCategory = output<Category>();
  readonly deleteCategory = output<string>();

  constructor() {
    addIcons({
      createOutline,
      trashOutline,
      pricetagsOutline,
      folderOpenOutline,
    });
  }

  onEdit(category: Category): void {
    this.editCategory.emit(category);
  }

  onDelete(categoryId: string): void {
    this.deleteCategory.emit(categoryId);
  }
}
