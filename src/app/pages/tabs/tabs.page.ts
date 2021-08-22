import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  tabs: {
    url: string,
    icon?: string,
    // exact?: boolean,
  }[] = [
    // { title: 'Upgrade', url: '/tabs/subscription', icon: 'fas fa-crown', iconColor: 'rgb(222, 150, 0)'},
    // { title: 'Random chat', url: '/new-friends/random', exact: true, icon: 'fas fa-random' },
    { url: 'buy-and-sell', icon: 'fas fa-store' },
    { url: 'small-business', icon: 'fas fa-briefcase' },
    { url: 'channels', icon: 'fas fa-object-group' },
    { url: 'new-friends', icon: 'fas fa-search' },
    { url: 'messages', icon: 'fas fa-comments' },
    { url: 'friends', icon: 'fas fa-users' },
    { url: 'profile', icon: 'fas fa-user' },
    // { title: 'settings', url: '/settings', icon: 'fas fa-cog' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
