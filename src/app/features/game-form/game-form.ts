import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'app-game-form',
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Control before join match -->
    <div *ngIf="!joined" class="container">
      <div class="player-mark">
          <p style="text-transform: uppercase; font-size: 14px; font-weight: 600; color: #a8bec9;">Player Mark Type</p>
          <div class="mark">
              <div class="mark-type">X</div>
              <div class="mark-type">O</div>
          </div>
          <p style="text-transform: uppercase; font-size: 12px; font-weight: 600; color: #a8bec961;">remember x: gose first</p>
      </div>

      <button (click)="findMatch()" class="btn-fine-match">🎯 Find Match</button>
      <p *ngIf="waiting$ | async" style="color: #a8bec9; margin-top: 20px; font-weight: 800;">Waiting for opponent...</p>
    </div>

    <!-- Control after join match -->
    <div *ngIf="joined" class="container">
      <div class="result">
        <p style="text-transform: uppercase; font-size: 14px; font-weight: 600; color: #f2b237;">You are: <b>{{ role$ | async }}</b></p>

        <ng-container *ngIf="turn$ | async as turn">
          <p style="padding: 5px 10px; background-color: #a8bec9; text-transform: uppercase; font-size: 14px; font-weight: 600; color: #070707">Turn: {{ turn }}</p>
        </ng-container>
      </div>

      <ng-container *ngIf="winner$ | async as winner">

        <p *ngIf="winner === 'draw'">🤝 Draw</p>

        <p *ngIf="winner && winner !== 'draw'" class="win-control">
          🏆 Winner: {{ winner }}
        </p>

      </ng-container>

      <div class="board">
        <button
          *ngFor="let cell of (board$ | async); let i = index"
          (click)="play(i)"
          class="btn-turn"
          [disabled]="cell || (winner$ | async)">
          {{ cell }}
        </button>
      </div>

      <ng-container *ngIf="winner$ | async">
        <button class="btn-rematch" (click)="rematch()">
          next round
        </button>
      </ng-container>

    </div>

  `,
  styleUrl: './game-form.css'
})
export class GameForm {
  joined = false;
  private game = inject(GameService);

  constructor() {
    this.game.role$.subscribe(r => {
      if (r) this.joined = true;
    });
  }

  board$ = this.game.board$;
  role$ = this.game.role$;
  turn$ = this.game.turn$;
  winner$ = this.game.winner$;
  waiting$ = this.game.waiting$;

  findMatch() {
    this.game.findMatch();
  }

  play(i: number) {
    this.game.move(i);
  }

  rematch() {
  this.game.rematch();
}

}
