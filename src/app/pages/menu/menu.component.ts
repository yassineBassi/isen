import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  public appPages = [
    { title: 'Upgrade', url: '/profilet', icon: 'fas fa-crown', iconColor: 'rgb(222, 150, 0)'},
    { title: 'Profile', url: '/profile', icon: 'fas fa-user' },
    { title: 'Find New Friends', url: '/new-friends', icon: 'fas fa-search' },
    { title: 'Friends', url: '/friends', icon: 'fas fa-users' },
    { title: 'Messages', url: '/messages', icon: 'fas fa-comments' },
    { title: 'Channels', url: '/channels', icon: 'far fa-object-group' },
    { title: 'settings', url: '/settings', icon: 'fas fa-cog' }
  ];

  constructor() { }

  ngOnInit() {}

}
