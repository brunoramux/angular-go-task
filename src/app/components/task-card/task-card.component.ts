import { Component, inject, Input } from '@angular/core';
import { ModalControllerService } from '../../services/modal-controller.service';
import { ITask } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css'],
})
export class TaskCardComponent {
  private readonly _modalControllerService = inject(ModalControllerService);
  private readonly _taskService = inject(TaskService);
  @Input() task!: ITask;

  openEditTaskModal() {
    const dialogRef = this._modalControllerService.openEditTaskModal({
      name: this.task.name,
      description: this.task.description,
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this._taskService.saveTask(this.task.id, result);
      }
    });
  }

  openTaskCommentsModal() {
    const dialogRef = this._modalControllerService.openTaskCommentsModal(
      this.task,
    );

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this._taskService.saveComments(this.task.id, result.description);
      }
    });
  }

  deleteTask() {
    this._taskService.deleteTask(this.task.id);
  }
}
