import { MessengerService } from './../messenger.service';
import { ToastService } from './../../services/toast.service';
import { User } from './../../models/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from './../../services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @Input() user: User;
  appPages = [
    { title: 'Upgrade', url: '/subscription', icon: 'fas fa-crown', iconColor: 'rgb(222, 150, 0)'},
    { title: 'Profile', url: '/profile/display/null', icon: 'fas fa-user' },
    { title: 'Find New Friends', url: '/new-friends', exact: true, icon: 'fas fa-search' },
    { title: 'Random chat', url: '/new-friends/random', exact: true, icon: 'fas fa-random' },
    { title: 'Friends', url: '/friends', icon: 'fas fa-users' },
    { title: 'Messages', url: '/messages', icon: 'fas fa-comments' },
    { title: 'Channels', url: '/channels', icon: 'far fa-object-group' },
    { title: 'buy and sell', url: '/buy-and-sell', icon: 'fas fa-store' },
    { title: 'small business', url: '/small-business', icon: 'fas fa-briefcase' },
    { title: 'settings', url: '/settings', icon: 'fas fa-cog' }
  ];

  constructor(private auth: AuthService, private nativeStorage: NativeStorage, private router: Router,
              private messengerService: MessengerService) {
      this.messengerService.onMessage().subscribe(msg =>  {
        if(msg.event == "update-user"){
          this.updateUserData();
        }
      })
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.updateUserData();
  }

  updateUserData(){
    this.nativeStorage.getItem('user')
    .then(
      user => {
        this.user = new User().initialize(user);
      }
    )
  }
}