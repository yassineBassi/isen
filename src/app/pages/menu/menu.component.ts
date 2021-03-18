import { ToastService } from './../../services/toast.service';
import { User } from './../../models/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  user: User;
  appPages = [
    { title: 'Upgrade', url: '/profilet', icon: 'fas fa-crown', iconColor: 'rgb(222, 150, 0)'},
    { title: 'Profile', url: '/profile', icon: 'fas fa-user' },
    { title: 'Find New Friends', url: '/new-friends', icon: 'fas fa-search' },
    { title: 'Friends', url: '/friends', icon: 'fas fa-users' },
    { title: 'Messages', url: '/messages', icon: 'fas fa-comments' },
    { title: 'Channels', url: '/channels', icon: 'far fa-object-group' },
    { title: 'settings', url: '/settings', icon: 'fas fa-cog' }
  ];

  constructor(private auth: AuthService, private nativeStorage: NativeStorage, private router: Router,
              private toastrService: ToastService) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.updateUserData()
  }

  signout(){
    this.auth.signout()
    .then(
      () => {
        this.nativeStorage.remove('token');
        this.router.navigate(['/auth/signin']);
      },
      err => {
        this.toastrService.presentErrorToastr('sorry an error has occured, please try again later')
      }
    )
  }

  updateUserData(){
    console.log('hi');
    this.nativeStorage.getItem('user')
    .then(
      user => {
        this.user = new User();
        this.user.initialize(user);
      }
    )
  }
}
