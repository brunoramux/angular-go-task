import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { TaskFormModalComponent } from './components/task-form-modal/task-form-modal.component';
import { TaskCommentsModalComponent } from './components/task-comments-modal/task-comments-modal.component';
import { DialogModule } from '@angular/cdk/dialog';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, MainContentComponent, DialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-go-task';
}
