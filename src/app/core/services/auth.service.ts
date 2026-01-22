import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private username: string | null = null;

  setUsername(name: string) {
    this.username = name;
  };

  getUsername(){
    return this.username;
  }
}
