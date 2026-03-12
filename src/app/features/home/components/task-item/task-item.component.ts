import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { IonNote, IonButton, IonLabel, IonCheckbox, IonItem } from "@ionic/angular/standalone";

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  imports: [IonItem, IonCheckbox, IonLabel, IonButton, IonNote],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {

readonly task = input.required<Task>();
  readonly category = input<Category | null>(null);

  readonly toggleTask = output<string>();
  readonly removeTask = output<string>();

  onToggle(): void {
    this.toggleTask.emit(this.task().id);
  }

  onRemove(): void {
    this.removeTask.emit(this.task().id);
  }

}
