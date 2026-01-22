import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsernameForm } from './features/username-form/username-form';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tic-tac-toe-game');
}
