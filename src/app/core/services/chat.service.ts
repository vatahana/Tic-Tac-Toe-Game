import { inject, Injectable } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket = inject(SocketService).getSocket();

  sendMessage(message: string) {
    this.socket.emit('send-global-message', message);
  }

  getMessages(cb: (messages: any[]) => void) {
    this.socket.on('global-chat-update', cb);
  }

  getOnlineUser(cb: (count: number) => void) {
    this.socket.off('get-online-user');
    this.socket.on('get-online-user', cb);
    this.socket.emit('get-online-user-now');
  }

  onGetChatHistory() {
    this.socket.emit('get-chat-history');
  }
}
