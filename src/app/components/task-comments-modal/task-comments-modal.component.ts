import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ITask } from '../../interfaces/task.interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ICommentFormControls } from '../../interfaces/comment-form-controls.interface';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-comments-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-comments-modal.component.html',
  styleUrls: ['./task-comments-modal.component.css'],
})
export class TaskCommentsModalComponent {
  readonly _data: { task: ITask } = inject(DIALOG_DATA);
  readonly _taskService = inject(TaskService);
  readonly _dialogRef = inject(DialogRef);
  task: ITask = this._data.task;

  ngOnInit() {
    this._taskService.todoTasks.subscribe((tasks) => {
      this.task = tasks.find((t) => t.id === this.task.id) || this.task;
    });
  }

  commentForm: FormGroup = new FormGroup({
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
  });

  onFormSubmit() {
    this.saveComment(this.commentForm.value);
    this.commentForm.reset();
  }

  saveComment(formValues: ICommentFormControls) {
    this._taskService.saveComments(this.task.id, formValues.description);
  }

  closeModal() {
    this._dialogRef.close();
  }
}
