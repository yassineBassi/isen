import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Upgrade', url: '/profilet', icon: 'fas fa-crown', iconColor: 'rgb(222, 150, 0)'},
    { title: 'Profile', url: '/profile', icon: 'fas fa-user' },
    { title: 'Find New Friends', url: '/new-friends', icon: 'fas fa-search' },
    { title: 'Friends', url: '/friends', icon: 'fas fa-users' },
    { title: 'Messages', url: '/messages', icon: 'fas fa-comments' },
    { title: 'Channels', url: '/channels', icon: 'far fa-object-group' },
    { title: 'settings', url: '/settings', icon: 'fas fa-cog' }
  ];

  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor() {}
}
