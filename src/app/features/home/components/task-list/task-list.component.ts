import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { Category } from '../../models/category.model';
import { Task } from '../../models/task.model';
import { IonList, IonIcon } from '@ionic/angular/standalone';
import { TaskItemComponent } from '../task-item/task-item.component';
import { addIcons } from 'ionicons';
import { clipboardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [IonIcon, IonList, TaskItemComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  readonly tasks = input<readonly Task[]>([]);
  readonly categories = input<readonly Category[]>([]);
  readonly categoriesEnabled = input(false);

  readonly toggleTask = output<string>();
  readonly removeTask = output<string>();

  constructor() {
    addIcons({
      clipboardOutline,
    });
  }

  readonly categoryMap = computed(() => {
    const map = new Map<string, Category>();

    for (const category of this.categories()) {
      map.set(category.id, category);
    }

    return map;
  });

  resolveCategory(task: Task): Category | null {
    if (!task.categoryId) return null;
    return this.categoryMap().get(task.categoryId) ?? null;
  }
}
