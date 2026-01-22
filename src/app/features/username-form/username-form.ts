import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SocketService } from '../../core/services/socket.service';

@Component({
  selector: 'app-username-form',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './username-form.html',
})
export class UsernameForm {
  private route = inject(Router);
  private auth = inject(AuthService);
  private socketService = inject(SocketService);

  form = new FormGroup({
    username: new FormControl('', Validators.required)
  })

  start() {
     if (this.form.invalid) return;

    const username = this.form.value.username!.trim();
    if (!username) return;

    this.auth.setUsername(username);
    this.socketService.setUsername(username);

    this.route.navigate(['/chat']);
  }
}
