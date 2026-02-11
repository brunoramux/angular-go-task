import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { ITask } from '../interfaces/task.interface';
import { ITaskFormControls } from '../interfaces/task-form-controls.interface';
import { TaskStatusEnum } from '../enums/task-status.enum';
import { generateUniqueIdWithTimestamp } from '../utils/generate-unique-id';
import { IComment } from '../interfaces/comment.interface';
import { ICommentFormControls } from '../interfaces/comment-form-controls.interface';
import { TaskStatus } from '../types/task-status';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private todoTasks$ = new BehaviorSubject<ITask[]>(
    this.loadTasksFromLocalStorage('todoTasks'),
  );
  // ACESSO APENAS A UMA COPIA DO OBSERVABLE PARA EVITAR MODIFICAÇÕES DIRETAS NOS DADOS
  readonly todoTasks = this.todoTasks$.asObservable().pipe(
    map((tasks) => structuredClone(tasks)),
    tap((tasks) => this.saveTasksOnLocalStorage('todoTasks', tasks)),
  );

  private doingTasks$ = new BehaviorSubject<ITask[]>(
    this.loadTasksFromLocalStorage('doingTasks'),
  );
  readonly doingTasks = this.doingTasks$.asObservable().pipe(
    map((tasks) => structuredClone(tasks)),
    tap((tasks) => this.saveTasksOnLocalStorage('doingTasks', tasks)),
  );

  private doneTasks$ = new BehaviorSubject<ITask[]>(
    this.loadTasksFromLocalStorage('doneTasks'),
  );
  readonly doneTasks = this.doneTasks$.asObservable().pipe(
    map((tasks) => structuredClone(tasks)),
    tap((tasks) => this.saveTasksOnLocalStorage('doneTasks', tasks)),
  );

  addTask(task: ITaskFormControls) {
    const currentTasks = this.todoTasks$.getValue();
    const newTask: ITask = {
      id: generateUniqueIdWithTimestamp(),
      name: task.name,
      description: task.description,
      comments: [],
      status: TaskStatusEnum.TODO,
    };
    this.todoTasks$.next([...currentTasks, newTask]);
  }

  saveTask(taskId: string, updatedTask: ITaskFormControls) {
    const currentTasks = this.todoTasks$.getValue();
    const taskIndex = currentTasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      const taskToUpdate = currentTasks[taskIndex];
      const updatedTaskData: ITask = {
        ...taskToUpdate,
        name: updatedTask.name,
        description: updatedTask.description,
      };
      const updatedTasks = [...currentTasks];
      updatedTasks[taskIndex] = updatedTaskData;
      this.todoTasks$.next(updatedTasks);
    }
  }

  deleteTask(taskId: string) {
    const currentTasks = this.todoTasks$.getValue();
    const updatedTasks = currentTasks.filter((task) => task.id !== taskId);
    this.todoTasks$.next(updatedTasks);
  }

  saveComments(taskId: string, comments: string) {
    const currentTasks = this.todoTasks$.getValue();
    const taskIndex = currentTasks.findIndex((task) => task.id === taskId);
    const newComment: IComment = {
      id: generateUniqueIdWithTimestamp(),
      description: comments,
    };
    if (taskIndex !== -1) {
      const taskToUpdate = currentTasks[taskIndex];
      const updatedTaskData: ITask = {
        ...taskToUpdate,
        comments: [...taskToUpdate.comments, newComment],
      };
      const updatedTasks = [...currentTasks];
      updatedTasks[taskIndex] = updatedTaskData;
      this.todoTasks$.next(updatedTasks);
    }
  }

  updateTaskStatus(
    taskId: string,
    taskCurrentStatus: TaskStatus,
    newStatus: TaskStatus,
  ) {
    const currentTaskList = this.getListByStatus(taskCurrentStatus);
    const newTaskList = this.getListByStatus(newStatus);

    const taskToUpdate = currentTaskList.value.find(
      (task) => task.id === taskId,
    );

    if (taskToUpdate) {
      taskToUpdate.status = newStatus;
      const currentTaskListWithoutTask = currentTaskList.value.filter(
        (task) => task.id !== taskId,
      );

      currentTaskList.next([...currentTaskListWithoutTask]);

      newTaskList.next([...newTaskList.value, taskToUpdate]);
      console.log(newTaskList.value);
    }
  }

  getListByStatus(status: TaskStatus): BehaviorSubject<ITask[]> {
    switch (status) {
      case TaskStatusEnum.TODO:
        return this.todoTasks$;
      case TaskStatusEnum.DOING:
        return this.doingTasks$;
      case TaskStatusEnum.DONE:
        return this.doneTasks$;
      default:
        throw new Error('Status desconhecido');
    }
  }

  private saveTasksOnLocalStorage(key: string, tasks: ITask[]) {
    try {
      localStorage.setItem(key, JSON.stringify(tasks));
    } catch (error) {
      console.log('Erro ao salvar tarefas no localStorage:', error);
    }
  }

  private loadTasksFromLocalStorage(key: string): ITask[] {
    try {
      const tasksJson = localStorage.getItem(key);
      if (tasksJson) {
        return JSON.parse(tasksJson) as ITask[];
      }
      return [];
    } catch (error) {
      console.log('Erro ao carregar tarefas do localStorage:', error);
      return [];
    }
  }
}
