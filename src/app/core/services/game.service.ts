import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private socketService = inject(SocketService);
  private socket = this.socketService.getSocket();

  board$ = new BehaviorSubject<(string | null)[]>([]);
  role$ = new BehaviorSubject<string>('');
  turn$ = new BehaviorSubject<string>('');
  winner$ = new BehaviorSubject<string | null>(null);
  waiting$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.socket.on('role', role => this.role$.next(role));

    this.socket.on('waiting', () => this.waiting$.next(true));

    this.socket.on('state', state => {
      this.board$.next(state.board);
      this.turn$.next(state.turn);
      this.winner$.next(state.winner);
      this.waiting$.next(false);
    });

    this.socket.on('opponent-left', () => {
      alert('Opponent left');
      location.reload();
    });
  };

  findMatch() {
    this.socket.emit('find-match');
  };

  move(index: number) {
    this.socket.emit('move', index);
  };

  rematch() {
    this.socket.emit('rematch');
  };
}
