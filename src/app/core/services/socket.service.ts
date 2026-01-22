import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private usernameSet = false;

  constructor() {
    this.socket = io('https://node-js-web-socket.onrender.com', {
      transports: ['websocket'],
    });
  }

  getSocket(): Socket {
    return this.socket;
  }

  setUsername(username: string) {
    if (!this.usernameSet) {
      this.socket.emit('set-username', username);
      this.usernameSet = true;
    }
  }
}


