import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SocketService } from '../../core/services/socket.service';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-main-component',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './main-component.html',
})
export class MainComponent implements OnInit {
  private auth = inject(AuthService);
  private chat = inject(ChatService);
  protected username: string | null = null;
  protected countOnlineUser: number = 1;
  protected activeButton: string = 'chat';

  isActive(active: string){
    this.activeButton = active;
  }
  
  constructor() {
    this.username = this.auth.getUsername();
  }
  
  ngOnInit(): void {
      this.chat.getOnlineUser(count => {
        this.countOnlineUser = count;
      })
  }
}
