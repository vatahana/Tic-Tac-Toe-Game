import { Routes } from '@angular/router';
import { UsernameForm } from './features/username-form/username-form';
import { MainComponent } from './features/main-component/main-component';
import { ChatForm } from './features/chat-form/chat-form';
import { GameForm } from './features/game-form/game-form';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: UsernameForm},
    { path: '', component: MainComponent, children:[
        { path: 'chat', component: ChatForm },
        { path: 'game', component: GameForm }
    ]},
    { path: '**', redirectTo: 'login' }
];
