import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { SocketService } from '../../core/services/socket.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-chat-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="w-full h-full">
      <div #chatBox class="chat-box overflow-y-scroll scrollbar-custom" style="display: flex; flex-direction: column;">
        <div
          *ngFor="let m of messages"
          class="message"
          [class.mine]="isMine(m)"
          [class.system]="m.system"
        >
          <div class="bubble" style="word-wrap: break-word;">
            <!-- User: username and datetime -->
            <strong *ngIf="!isMine(m)">
              <span class="text-teal-500">{{ m.username }}  </span> 
              <span class="font-medium text-sm">{{ m.time }}</span>
            </strong>
            <!-- message -->
            <div>{{ m.text }}</div>
          </div>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="send()" class="h-[40px] flex flex-row justify-center">
        <input 
          class="w-[85%] outline-none text-white border border-2 border-teal-500 bg-teal-500/20 rounded-lg me-2 px-2" 
          formControlName="message" 
          placeholder="Type message..." 
        />
        <button 
          type="submit" 
          [disabled]="form.invalid" 
          class="rounded-lg w-[50px] cursor-pointer text-white bg-teal-500"
        >
          <i class="fa-solid fa-share"></i>
        </button>
      </form>
    </div>
  `,
  styles: [`
    .chat-box {
      height: 420px;
      overflow-y: auto;
      padding: 10px 100px;
      margin-bottom: 10px;
    }

    .message {
      display: flex;
      margin-bottom: 8px;
    }

    .message.mine {
      justify-content: flex-end;
    }

    .bubble {
      max-width: 70%;
      padding: 8px 12px;
      border-radius: 10px;
      background: white;
    }

    .message.mine .bubble {
      background: #d1e7ff;
      text-align: right;
    }

    .system {
      justify-content: center;
      color: gray;
      font-size: 13px;
      margin: 2px 0;
    }
  `]
})
export class ChatForm implements OnInit, AfterViewChecked {
  username!: string;
  messages: any[] = [];
  @ViewChild('chatBox') private chatBox!: ElementRef;

  form = new FormGroup({
    message: new FormControl('', Validators.required)
  });

  constructor(
    private auth: AuthService,
    private chat: ChatService,
    private socket: SocketService,
    private router: Router
  ) { }

  ngOnInit() {
    const name = this.auth.getUsername();

    if (!name) {
      this.router.navigate(['/login']);
      return;
    }

    this.username = name;

    /** Set username to user */
    this.socket.setUsername(name);

    /** Get chat history when change button */
    this.chat.onGetChatHistory();

    this.chat.getMessages(msgs => {
      this.messages = msgs;
    });
  };

  ngAfterViewChecked(): void {
      this.toBottom();
  }

  toBottom(){
    try{
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    }catch(err){
      console.log('Error')
    }
  }

  isMine(msg: any): boolean {
    return msg.username === this.username;
  }

  send() {
    this.chat.sendMessage(this.form.value.message!);
    this.form.reset();
  }
}
