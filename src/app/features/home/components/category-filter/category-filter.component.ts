import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Category } from '../../models/category.model';
import { TaskSort } from '../../models/task.model';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { optionsOutline } from 'ionicons/icons';

type CategoryFilter = 'all' | 'uncategorized' | string;

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
  imports: [
    IonSegment,
    IonChip,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonSegmentButton,
    IonLabel,
    IonIcon,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFilterComponent {
  readonly categories = input<readonly Category[]>([]);
  readonly selectedCategoryId = input<CategoryFilter>('all');
  readonly countMap = input<Record<string, number>>({});
  readonly sortBy = input<TaskSort>('recent');

  readonly filterChange = output<CategoryFilter>();
  readonly sortChange = output<TaskSort>();

  constructor() {
    addIcons({
      optionsOutline,
    });
  }

  selectFilter(value: CategoryFilter): void {
    this.filterChange.emit(value);
  }

  onSortChange(event: CustomEvent): void {
    this.sortChange.emit(event.detail.value as TaskSort);
  }
}
