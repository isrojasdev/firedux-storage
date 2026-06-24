import { Component } from "@angular/core";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FireduxService } from "./firedux.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, FormsModule],
  template: `
    <h1>firedux-storage — Angular</h1>

    <!-- Auth -->
    <div class="auth">
      <ng-container *ngIf="firedux.user$ | async as user; else guest">
        <span>Signed in as <strong>{{ user.email }}</strong></span>
        <button (click)="firedux.signOut()">Sign out</button>
      </ng-container>
      <ng-template #guest>
        <button (click)="firedux.signInGoogle()">Sign in with Google</button>
      </ng-template>
    </div>

    <!-- Add todo -->
    <div class="form">
      <input [(ngModel)]="newTitle" placeholder="New todo title" (keydown.enter)="addTodo()" />
      <button (click)="addTodo()" [disabled]="!newTitle.trim()">Add</button>
    </div>

    <p *ngIf="error" class="error">{{ error }}</p>

    <!-- List -->
    <ul>
      <li *ngFor="let todo of firedux.todos$ | async">
        {{ todo.title }}
        <button (click)="firedux.deleteTodo(todo.id)">Delete</button>
      </li>
    </ul>
  `,
  styles: [`
    h1 { font-size: 1.4rem; }
    .auth { margin-bottom: 1rem; display: flex; align-items: center; gap: 1rem; }
    .form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .form input { flex: 1; padding: 0.4rem; border: 1px solid #ccc; border-radius: 4px; }
    ul { list-style: none; padding: 0; }
    li { display: flex; justify-content: space-between; padding: 0.4rem; border-bottom: 1px solid #eee; }
    .error { color: red; }
  `],
})
export class AppComponent {
  newTitle = "";
  error = "";

  constructor(public firedux: FireduxService) {}

  async addTodo() {
    const title = this.newTitle.trim();
    if (!title) return;
    this.error = "";

    const [res] = await this.firedux.addTodo(title);
    if (res.status === "failed") {
      this.error = res.error;
    } else {
      this.newTitle = "";
    }
  }
}
