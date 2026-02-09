import { Component, inject } from '@angular/core';
import { ModalControllerService } from '../../services/modal-controller.service';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css'],
})
export class TaskCardComponent {
  private readonly _modalControllerService = inject(ModalControllerService);

  openEditTaskModal() {
    this._modalControllerService.openEditTaskModal({
      name: 'Task 1',
      description: 'Task 1',
    });
  }
}
