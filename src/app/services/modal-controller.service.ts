import { inject, Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TaskFormModalComponent } from '../components/task-form-modal/task-form-modal.component';
import { TaskCommentsModalComponent } from '../components/task-comments-modal/task-comments-modal.component';
import { ITaskFormControls } from '../interfaces/task-form-controls.interface';
import { ITask } from '../interfaces/task.interface';
import { ICommentFormControls } from '../interfaces/comment-form-controls.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalControllerService {
  private readonly _dialog = inject(Dialog);

  private readonly modalSizeOptions = {
    maxWidth: '620px',
    width: '95%',
  };

  openNewTaskModal() {
    return this._dialog.open<ITaskFormControls>(TaskFormModalComponent, {
      ...this.modalSizeOptions,
      disableClose: true,
      data: {
        mode: 'create',
        formValues: {
          name: '',
          description: '',
        },
      },
    });
  }

  openEditTaskModal(formValues: ITaskFormControls) {
    return this._dialog.open<ITaskFormControls>(TaskFormModalComponent, {
      ...this.modalSizeOptions,
      disableClose: true,
      data: { mode: 'edit', formValues },
    });
  }

  openTaskCommentsModal(task: ITask) {
    return this._dialog.open<ICommentFormControls>(TaskCommentsModalComponent, {
      ...this.modalSizeOptions,
      data: {
        task: task,
      },
    });
  }
}
