import { Component, inject } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskService } from '../../services/task.service';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ITask } from '../../interfaces/task.interface';
@Component({
  selector: 'app-task-list-section',
  imports: [TaskCardComponent, CdkDropList, CdkDrag],
  templateUrl: './task-list-section.component.html',
  styleUrls: ['./task-list-section.component.css'],
})
export class TaskListSectionComponent {
  todoTasks: ITask[] = [];
  doingTasks: ITask[] = [];
  doneTasks: ITask[] = [];
  private readonly _tasks = inject(TaskService);

  ngOnInit() {
    this._tasks.todoTasks.subscribe((tasks) => {
      this.todoTasks = tasks;
    });
    this._tasks.doingTasks.subscribe((tasks) => {
      this.doingTasks = tasks;
    });
    this._tasks.doneTasks.subscribe((tasks) => {
      this.doneTasks = tasks;
    });
  }

  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
